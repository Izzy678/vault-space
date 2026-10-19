# VaultSpace

VaultSpace is a web application for storing files that are encrypted in the browser before upload. Each file is encrypted with its own AES key, and that key is protected with the user’s RSA public key. The API stores ciphertext and wrapped keys; it does not decrypt file contents.

The interface is intended for someone who wants a private file workspace with a separate login password and vault passphrase. This repository is a working local prototype for the project *Design and Implementation of a Hybrid Secure Cloud Storage System Using AES File Encryption and Asymmetric Key Protection*.

**Status:** Local prototype. It is not a production service and has not been independently audited.

![VaultSpace dashboard showing file categories, storage use, and an integrity-verified file](apps/frontend/public/images/product/vaultspace-desktop-2880.jpg)

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Security](#security)
- [Development](#development)
- [License](#license)

## About

Cloud storage normally receives readable files. VaultSpace keeps file bytes encrypted on the client, then uploads only ciphertext.

A person registers with an account password, then creates a vault passphrase. The browser generates an RSA key pair. The private key is wrapped with a key derived from the vault passphrase and stored by the API. On upload, the browser creates a fresh AES key for that file, encrypts the file, and wraps the AES key with the RSA public key. Download reverses those steps after the vault is unlocked in the browser.

The account password and the vault passphrase are different secrets. Changing or knowing the account password does not recover encrypted files. If the vault passphrase is lost, the current design cannot decrypt those files.

The default account quota is 50 MiB of ciphertext. Filenames, types, sizes, and timestamps are stored as ordinary database fields. Account deletion and remote session revocation are not implemented.

## Features


| Feature            | What you can do                                                                                                |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| Account            | Register, sign in, and sign out. Passwords must include upper- and lower-case letters, a number, and a symbol. |
| Two-factor sign-in | Optionally protect sign-in with an authenticator code and one-time recovery codes.                             |
| Vault              | Create a vault, unlock it, lock it, change the passphrase, and rotate the RSA key pair.                        |
| Files              | Encrypt a file in the browser, upload it, list it, download and decrypt it, and delete it.                     |
| Sharing            | Share a file with another VaultSpace user. Their copy of the AES key is wrapped to their public key.           |
| Contacts           | Add another user by email and mark a contact as verified in the interface.                                     |
| Activity           | Review recent account and file events.                                                                         |
| Settings           | Change the display name, theme, idle lock time, account password, and two-factor setting.                      |


Contact verification is a label you set. It is not a cryptographic check of the other person’s key. The Delete account control does not call a deletion API. Active sessions lists only the current browser.

## Tech Stack


| Area                 | Technology                               | Purpose                                                             |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------- |
| Web app              | Next.js 16, React 19, TypeScript         | Landing page, sign-in, vault gate, and file workspace               |
| API                  | NestJS 11, TypeScript                    | Authentication, records, and storage operations                     |
| Browser cryptography | Web Crypto API                           | File encryption, key wrapping, and vault unlock                     |
| Account passwords    | Argon2id                                 | Password hashing on the server                                      |
| Database             | PostgreSQL, TypeORM                      | Users, vault packages, file records, shares, contacts, and activity |
| Object storage       | S3-compatible API (`@aws-sdk/client-s3`) | Ciphertext objects                                                  |
| Sessions             | JWT (`@nestjs/jwt`)                      | Bearer tokens for API requests                                      |


Node.js 20 or newer is required. The sample configuration targets Neon Postgres and Neon Object Storage, but any reachable PostgreSQL database and S3-compatible endpoint can be used.

## Architecture

```mermaid
flowchart LR
  Browser["Browser (Next.js)"]
  API["NestJS API"]
  DB["PostgreSQL"]
  Store["S3-compatible storage"]

  Browser -->|"account and metadata JSON"| API
  Browser -->|"ciphertext upload and download"| API
  API --> DB
  API --> Store
```



Encryption and decryption stay in the browser.

1. The vault passphrase is stretched with PBKDF2-HMAC-SHA256 (310,000 iterations by default) and used to wrap the RSA private key with AES-256-GCM.
2. The API stores that wrapped private key and the RSA public key. The passphrase is not sent to the API.
3. Each file uses a new AES-256-GCM key and a 12-byte IV. The authentication tag is stored separately from the ciphertext.
4. The file key is wrapped with RSA-OAEP (2048-bit, SHA-256) for the owner, and again for each person the file is shared with.
5. PostgreSQL stores metadata and wrapped keys. Object storage stores ciphertext under `vaultspace/{userId}/{fileId}`.

After unlock, the browser can keep the unwrapped private key in `sessionStorage` for that tab. Locking or signing out clears it. An idle timer can lock the vault.

## Project Structure


| Path                           | Purpose                                                       |
| ------------------------------ | ------------------------------------------------------------- |
| `apps/frontend`                | Next.js application. Dev server defaults to port 3000.        |
| `apps/frontend/src/lib/crypto` | Browser encryption, vault wrapping, and session restore.      |
| `apps/frontend/src/app`        | Routes for the landing page, auth, vault gate, and workspace. |
| `apps/backend`                 | NestJS API. Dev server defaults to port 3001.                 |
| `apps/backend/src/auth`        | Registration, login, JWT, password change, and TOTP.          |
| `apps/backend/src/vault`       | Wrapped vault key packages.                                   |
| `apps/backend/src/files`       | File records and ciphertext upload or download.               |
| `apps/backend/src/shares`      | Per-recipient wrapped file keys.                              |
| `apps/backend/src/storage`     | S3-compatible object storage adapter.                         |
| `apps/backend/.env.example`    | Environment template. Copy this to `apps/backend/.env`.       |


Useful pages: `/` (landing), `/register`, `/login`, `/security` (vault setup or unlock), `/dashboard`, `/files`, `/keys`, `/activity`, and `/settings`.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm (the repository uses npm workspaces and `package-lock.json`)
- A PostgreSQL database
- An S3-compatible bucket and credentials

### Installation

From the repository root:

```bash
npm install
```

### Local setup

```bash
cp apps/backend/.env.example apps/backend/.env
```

Edit `apps/backend/.env` with your database URL, JWT secret, and object-storage credentials. See [Configuration](#configuration). With `TYPEORM_SYNCHRONIZE=true`, the API creates or updates tables when it starts. There is no separate migration command.

The web app calls `http://localhost:3001` unless you set `NEXT_PUBLIC_API_URL`. To override it, create `apps/frontend/.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Run

Start the API and the web app in two terminals, both from the repository root:

```bash
npm run dev:backend
```

```bash
npm run dev:frontend
```

The API is ready when the log includes `Nest application successfully started`. Open [http://localhost:3000](http://localhost:3000).

### First use

1. Create an account.
2. On the vault screen, choose a passphrase of at least 10 characters and confirm it.
3. Upload a file from the workspace.
4. Download it and confirm the original file is returned.

Sign-in uses the account password. The vault screen uses the vault passphrase.

## Configuration

Backend settings are read from `apps/backend/.env`. Do not commit that file.


| Setting                 | Purpose                                                                                                                  | Required when                                | Default                         | Safe example                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ------------------------------- | --------------------------------------------------------------------- |
| `PORT`                  | API listen port                                                                                                          | Optional                                     | `3001`                          | `3001`                                                                |
| `CORS_ORIGIN`           | Allowed browser origin. Comma-separated. In development, localhost, `127.0.0.1`, and private LAN hosts are also allowed. | Optional                                     | `http://localhost:3000`         | `http://localhost:3000`                                               |
| `NODE_ENV`              | Runtime mode                                                                                                             | Optional                                     | none                            | `development`                                                         |
| `DATABASE_URL`          | PostgreSQL connection string                                                                                             | Required unless `DATABASE_URL_POOLED` is set | none                            | `postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require`        |
| `DATABASE_URL_POOLED`   | Preferred Postgres URL when both are set                                                                                 | Optional                                     | none                            | `postgresql://USER:PASSWORD@HOST-pooler:5432/DB_NAME?sslmode=require` |
| `TYPEORM_SYNCHRONIZE`   | Create or alter tables on startup                                                                                        | Optional                                     | off, unless set to `true`       | `true` for local development only                                     |
| `JWT_SECRET`            | Signs access tokens                                                                                                      | Required for real use                        | placeholder in the example file | a long random string                                                  |
| `JWT_EXPIRES_IN`        | Access-token lifetime                                                                                                    | Optional                                     | `7d`                            | `7d`                                                                  |
| `AWS_ACCESS_KEY_ID`     | Object-storage access key                                                                                                | Required                                     | none                            | `EXAMPLEKEY`                                                          |
| `AWS_SECRET_ACCESS_KEY` | Object-storage secret                                                                                                    | Required                                     | none                            | `examplesecret`                                                       |
| `AWS_ENDPOINT_URL_S3`   | S3-compatible endpoint                                                                                                   | Required                                     | none                            | `https://storage.example.com`                                         |
| `AWS_REGION`            | SDK region                                                                                                               | Required                                     | `us-east-2` in the example      | `us-east-2`                                                           |
| `NEON_S3_BUCKET`        | Bucket name                                                                                                              | Optional                                     | `assets`                        | `assets`                                                              |
| `MAX_UPLOAD_BYTES`      | Largest ciphertext accepted                                                                                              | Optional                                     | `52428800`                      | `52428800`                                                            |
| `STORAGE_QUOTA_BYTES`   | Ciphertext quota per account                                                                                             | Optional                                     | `52428800`                      | `52428800`                                                            |



| Setting               | Purpose                          | Required when | Default                 | Safe example            |
| --------------------- | -------------------------------- | ------------- | ----------------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL` | API base URL used by the browser | Optional      | `http://localhost:3001` | `http://localhost:3001` |


Set `TYPEORM_SYNCHRONIZE` only on a development database. It can change the schema automatically.

## Security

Implemented controls:

- Account passwords are hashed with Argon2id and are not stored in plaintext.
- API routes for files, the vault, shares, contacts, and activity require a JWT.
- File plaintext is encrypted in the browser with AES-256-GCM before upload.
- File keys are wrapped with RSA-OAEP. The RSA private key is wrapped with a passphrase-derived AES-256-GCM key.
- A modified ciphertext or authentication tag fails decryption in the browser.
- One user cannot read another user’s file records through the normal API checks. A shared file is available only through a share record and a key wrapped to the recipient.

Limits:

- This is client-side encryption, not a proof that the server learns nothing. The server can read metadata, ciphertext, wrapped keys, and request logs.
- The browser must be trusted. A compromised page or device can read an unlocked vault. The unlocked private key may sit in `sessionStorage`.
- Filenames and other file metadata are not encrypted.
- A forgotten vault passphrase cannot be reset by an administrator.
- Passing the checks above is not a formal security proof or a penetration test.

There is no security-reporting policy in this repository.

## Development

From the repository root:


| Command                | Description                    |
| ---------------------- | ------------------------------ |
| `npm run dev:backend`  | API in watch mode              |
| `npm run dev:frontend` | Next.js dev server             |
| `npm run build`        | Build both workspaces          |
| `npm run lint`         | Lint both workspaces           |
| `npm test`             | Run workspace tests that exist |


`npm test` runs the backend Jest script. That suite does not cover encryption, authentication, or file upload. The frontend package has a lint script and no test script.

Workspace package scripts also work from `apps/backend` and `apps/frontend`, for example `npm run start:dev` in `apps/backend`.

## License

The project code is licensed under the MIT License. See [LICENSE](LICENSE).
