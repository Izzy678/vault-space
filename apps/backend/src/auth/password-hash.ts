import { randomBytes } from 'node:crypto';
import { argon2Verify, argon2id } from 'hash-wasm';

/** Same Argon2id parameters the native hasher used, so existing hashes still verify. */
const MEMORY_KIB = 65_536;
const ITERATIONS = 3;
const PARALLELISM = 4;
const HASH_LENGTH = 32;

export async function hashPassword(password: string): Promise<string> {
  return argon2id({
    password,
    salt: randomBytes(16),
    parallelism: PARALLELISM,
    iterations: ITERATIONS,
    memorySize: MEMORY_KIB,
    hashLength: HASH_LENGTH,
    outputType: 'encoded',
  });
}

export async function verifyPassword(
  hash: string,
  password: string,
): Promise<boolean> {
  try {
    return await argon2Verify({ password, hash });
  } catch {
    return false;
  }
}
