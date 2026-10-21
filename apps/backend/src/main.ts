import { createServer } from 'node:http';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

function listenPort(): number {
  const value = Number(process.env.PORT ?? 3001);
  return Number.isFinite(value) && value > 0 ? value : 3001;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      callback(null, isAllowedCorsOrigin(origin));
    },
    credentials: true,
  });

  await app.listen(listenPort(), '0.0.0.0');
}

/** Local dev is often opened as 127.0.0.1 or a LAN IP, not only localhost. */
function isAllowedCorsOrigin(origin: string | undefined): boolean {
  if (!origin) return true;

  const configured = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  if (configured.includes(origin)) return true;
  if (process.env.NODE_ENV === 'production') return false;

  try {
    const url = new URL(origin);
    const host = url.hostname;
    const local =
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '::1' ||
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(host) ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
    return (url.protocol === 'http:' || url.protocol === 'https:') && local;
  } catch {
    return false;
  }
}

bootstrap().catch((err: unknown) => {
  const message = startupError(err);
  console.error(err);
  createServer((_req, res) => {
    res.writeHead(500, { 'content-type': 'application/json' });
    res.end(JSON.stringify({ message }));
  }).listen(listenPort(), '0.0.0.0');
});

function startupError(err: unknown): string {
  const message = err instanceof Error ? err.message : 'The API failed to start';
  return message.replace(/postgres(?:ql)?:\/\/\S+/gi, 'postgresql://***');
}
