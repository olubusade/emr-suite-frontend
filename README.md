# EMR-Suite Backend (Demo)

![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=flat-square) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?style=flat-square) ![Sequelize](https://img.shields.io/badge/ORM-Sequelize-yellow?style=flat-square) ![Docker](https://img.shields.io/badge/Docker-Compose-blue?style=flat-square) ![Jest](https://img.shields.io/badge/Testing-Jest-orange?style=flat-square) ![Swagger](https://img.shields.io/badge/API-Swagger-brightgreen?style=flat-square)

**Electronic Medical Records (EMR) Suite – Backend Demo**

> ⚠️ **Recruiter note:** This repository is a demonstration of a production-minded backend (security, RBAC, auditing, CI). The frontend is intentionally omitted. The demo uses realistic flows but runs in a controlled environment to protect IP.

---

## Quick highlights

* JWT-based authentication (access + refresh tokens).
* Role-based access control (RBAC) + dynamic permissions.
* Audit logging for sensitive actions (CREATE, UPDATE, DELETE, LOGIN, LOGOUT).
* PostgreSQL + Sequelize; seeds & migrations included.
* Dockerized (dev & prod compose files). `.env` files live at project root — **no duplication**.
* Tests: Jest + Supertest integration suites.
* Prometheus-ready metrics endpoint and Swagger UI.

---

## Project layout (updated)

```
emr-suite-backend/
├─ src/
│  ├─ config/               # config.js, db.js (Sequelize)
│  ├─ controllers/
│  ├─ services/
│  ├─ models/
│  ├─ middlewares/
│  ├─ routes/
│  ├─ validation/
│  ├─ seed/                 # seed/seed.js (seed roles/users/permissions)
│  ├─ test/                 # Jest + Supertest
│  ├─ app.js
│  └─ server.js
├─ docker/
│  ├─ Dockerfile            # single multi-mode Dockerfile (NODE_ENV build-arg)
│  ├─ docker-compose.dev.yml
│  └─ docker-compose.prod.yml
├─ .env.dev                 # root: development variables
├─ .env.prod                # root: production variables
├─ package.json
└─ README.md
```

> **Important:** `.env.dev` and `.env.prod` live in the **project root** (not duplicated under `docker/`). Docker Compose files in `docker/` use `env_file: ../.env.dev` (or `../.env.prod`) to pick them up.

---

## Conventions & best practices (short summary)

* **API JSON keys:** `camelCase` for all responses (frontend-friendly).
* **DB columns:** `snake_case` in PostgreSQL (Sequelize `underscored: true`) — service layer maps to camelCase.
* **RBAC:** Permissions enforced via middleware on routes. Roles & direct user permissions are combined.
* **Audit:** Middlewares call `auditService.logAudit(...)` for sensitive operations.
* **JWT:** Access tokens short-lived; refresh tokens are stored hashed (SHA-256) and revocable.
* **Errors:** Central `ApiError` + global error middleware returns consistent shape.
* **Seed:** Seed scripts live in `src/seed/seed.js` and create demo data including default admin.

---

## Demo credentials (if you run seed)

> These are seed/demo credentials — change in production.

* **Admin**: `admin@busade-emr-demo.com`
  **Password:** `admin@123`

(If you change seeds, update the credentials accordingly.)

---

## Environment files (root)

**`.env.dev`** (example — *project root*)

```ini
ENV=dev
NODE_ENV=development
PORT=5000

# Database (the container/service name in compose is `db` so backend can use DB_HOST=db)
DB_HOST=db
DB_PORT=5432          # container port (host mapping controlled in compose)
DB_USER=postgres
DB_PASS=postgres
DB_NAME=busade_emr_demo_db

# Optional override of host port mapping (only used in compose ports mapping)
POSTGRES_HOST_PORT=5432

CORS_ORIGIN=http://localhost:4200

JWT_SECRET=your_dev_jwt_secret
JWT_REFRESH_SECRET=your_dev_refresh_secret
ACCESS_TTL=15m
REFRESH_TTL=7d
JWT_ISSUER=http://localhost:5000
```

**`.env.prod`** (example — *project root*)

```ini
ENV=prod
NODE_ENV=production
PORT=5000
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=super_secure_password
DB_NAME=busade_emr_demo_db

POSTGRES_HOST_PORT=5432

CORS_ORIGIN=https://yourfrontend.com

JWT_SECRET=your_prod_jwt_secret
JWT_REFRESH_SECRET=your_prod_refresh_secret
ACCESS_TTL=15m
REFRESH_TTL=7d
JWT_ISSUER=https://yourbackend.com
```

> **Note:** Docker Compose will read the env file referenced in `docker/docker-compose.*.yml`. The Compose file references the root `.env.*` as `../.env.dev` (see examples below). You do **not** need to copy `.env` files into `docker/`.

---

## Docker (dev & prod) — concrete files + explanation

### `docker/docker-compose.dev.yml` (example)

```yaml
# NO `version:` field (Compose v2+ ignores it)
services:
  db:
    image: postgres:15-alpine
    container_name: busade-emr-db-dev
    env_file:
      - ../.env.dev
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${POSTGRES_HOST_PORT:-5432}:5432"   # host_port:container_port (change POSTGRES_HOST_PORT in .env.dev if local postgres uses 5432)
    volumes:
      - postgres_data_dev:/var/lib/postgresql/data

  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile
      args:
        NODE_ENV: development
    container_name: busade-emr-backend-dev
    env_file:
      - ../.env.dev
    ports:
      - "${PORT:-5000}:5000"
    volumes:
      - ..:/usr/src/app       # live code in dev
      - /usr/src/app/node_modules
    depends_on:
      - db
    command: npm run dev     # use nodemon dev script

volumes:
  postgres_data_dev:
```

### `docker/docker-compose.prod.yml` (example)

```yaml
services:
  db:
    image: postgres:15-alpine
    container_name: busade-emr-db-prod
    env_file:
      - ../.env.prod
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}
      POSTGRES_DB: ${DB_NAME}
    ports:
      - "${POSTGRES_HOST_PORT:-5432}:5432"
    volumes:
      - postgres_data_prod:/var/lib/postgresql/data

  backend:
    build:
      context: ..
      dockerfile: docker/Dockerfile
      args:
        NODE_ENV: production
    container_name: busade-emr-backend-prod
    env_file:
      - ../.env.prod
    ports:
      - "${PORT:-5000}:5000"
    depends_on:
      - db
    restart: unless-stopped
    command: npm run start   # production start

volumes:
  postgres_data_prod:
```

### `docker/Dockerfile` (single file handling dev/prod via build-arg)

```dockerfile
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

ARG NODE_ENV=production

# Install dev deps in non-production so nodemon exists
RUN if [ "$NODE_ENV" = "production" ]; then \
      npm ci --omit=dev; \
    else \
      npm install; \
    fi

COPY . .

EXPOSE 5000

CMD ["node", "src/server.js"]
```

---

## How Compose chooses env files (important)

* Compose file uses `env_file: ../.env.dev` (relative to `docker/` folder). This instructs Compose to load **the file at project root**. **No duplication required.**
* To run dev from project root:

```bash
docker compose -f docker/docker-compose.dev.yml up --build
```

* To run prod:

```bash
docker compose -f docker/docker-compose.prod.yml up --build -d
```

---

## Seed the DB (graceful/retry approach)

Postgres may take a few seconds to accept connections. Use a retry loop when seeding inside the container:

```bash
# start compose first (in dev)
docker compose -f docker/docker-compose.dev.yml up -d --build

# run seed with retry from host:
docker compose -f docker/docker-compose.dev.yml exec backend sh -c "\
  for i in \$(seq 1 30); do \
    echo \"Seeding attempt \$i...\"; \
    node src/seed/seed.js && break; \
    echo 'Seed failed; waiting 2s...'; sleep 2; \
  done"
```

Or run seed from host (non-docker) after DB is reachable:

```bash
npm run seed
```

---

## Useful `package.json` scripts

```json
"scripts": {
  "local": "ENV=dev node src/server.js",
  "dev": "nodemon --watch src --ext js --exec \"ENV=dev node src/server.js\"",
  "start": "ENV=prod node src/server.js",
  "seed": "node src/seed/seed.js",
  "docker:up:dev": "docker compose -f docker/docker-compose.dev.yml up --build",
  "docker:down:dev": "docker compose -f docker/docker-compose.dev.yml down",
  "docker:seed:dev": "docker compose -f docker/docker-compose.dev.yml exec backend node src/seed/seed.js",
  "docker:up:prod": "docker compose -f docker/docker-compose.prod.yml up -d --build",
  "docker:down:prod": "docker compose -f docker/docker-compose.prod.yml down",
  "test": "jest --runInBand",
  "test:watch": "jest --watch",
  "test:rbac": "jest tests/rbac-all.test.js"
}
```

---

## Permission issues (Docker socket) — graceful fixes (no sudo forever)

On Linux you might see: `permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock`.

Recommended solutions (safe & standard):

1. **Add your user to `docker` group (recommended)**

```bash
# Add user to docker group
sudo usermod -aG docker $USER

# Re-login (important). Instead of logging out/in you can use:
newgrp docker
```

After re-login, `docker` commands should run without `sudo`.

2. **Temporary (unsafe) — use sudo**

```bash
sudo docker compose -f docker/docker-compose.dev.yml up
```

(not recommended for everyday use)

3. **Rootless Docker** — set up Docker rootless mode (advanced, optional). See Docker docs.

4. **If `docker compose` command is missing**
   Install modern Docker (Docker Engine + Docker Compose v2) or use `docker-compose` binary. Prefer `docker compose` (v2).

---

## Port conflicts (host already using `5432`)

If host PostgreSQL uses `5432`, either:

* Stop host Postgres while using dev Compose:

```bash
sudo systemctl stop postgresql
# after dev: sudo systemctl start postgresql
```

* Or change host port mapping in `.env.dev`:

```ini
POSTGRES_HOST_PORT=5433
```

Then `docker-compose.dev.yml` will map host `5433 -> container 5432`.

---

## CI/CD — GitHub Actions (example)

Create `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: busade_emr_demo_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run migrate # if using migrations
      - run: npm run seed    # optionally seed test data
      - run: npm test
```

> This ensures CI runs tests against a transient Postgres service and seeds/migrates before testing.

---

## Mermaid architecture (visual)

```mermaid
flowchart TD
  A[Client (browser/mobile)] -->|HTTP / REST| B(Load Balancer / Reverse Proxy)
  B --> C[Express API (src/app.js)]
  C --> D[Middleware: Auth, RBAC, Audit]
  D --> E[Services Layer]
  E --> F[Sequelize ORM]
  F --> G[PostgreSQL: busade_emr_demo_db]
  C --> H[Prometheus metrics /metrics]
  C --> I[Swagger /api-docs]
```

---

## Quick start (recommended for recruiters)

1. clone & install

```bash
git clone https://github.com/<your-org>/emr-suite-backend.git
cd emr-suite-backend
npm install
```

2. copy env for dev

```bash
cp .env.dev .env
# edit .env if you want custom secrets
```

3. run locally (fast)

```bash
npm run dev
# visit http://localhost:5000/api/docs
```

4. or run via Docker dev

```bash
docker compose -f docker/docker-compose.dev.yml up --build
# wait until db + backend are up, then seed:
docker compose -f docker/docker-compose.dev.yml exec backend node src/seed/seed.js
```

5. If Docker permission denied:

```bash
# add to docker group (then relog or newgrp)
sudo usermod -aG docker $USER
newgrp docker
```

6. If local Postgres uses 5432 and interferes:

```bash
# stop host Postgres for the session
sudo systemctl stop postgresql
# OR change host port in root .env.dev (POSTGRES_HOST_PORT=5433)
```