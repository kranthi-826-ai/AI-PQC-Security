# AI-PQC Security

**AI-Driven Adaptive Post-Quantum Cryptographic Security Framework for Distributed Applications**

This repository is organized for phased development. We are starting with the SOA microservices foundation; AI analysis, adaptive policies, post-quantum cryptography, Docker/Kubernetes deployment, and ML training will be added incrementally.

## Project structure

```text
AI-PQC-Security/
|-- backend/                 Spring Boot microservices
|   |-- discovery-server/
|   |-- api-gateway/
|   |-- auth-service/
|   |-- business-service/
|   `-- security-monitoring-service/
|-- frontend/                Client applications
|   `-- web-dashboard/       React dashboard (later)
|-- platform/                Adaptive AI and cryptographic-security modules
|-- ml/                      Data, training, evaluation, and model artifacts
|-- infrastructure/          Database, Docker, Kubernetes, and monitoring
|-- tests/                   Integration, end-to-end, and performance tests
|-- docs/                    Architecture, API, research, and decisions
`-- scripts/                 Setup, test, and demonstration scripts
```

## Technology direction

- Java 21, Spring Boot, Spring Cloud, Maven
- React dashboard (later)
- Python ML inference service (later)
- Docker Desktop, then Kubernetes (later)
- Bruno for API testing
- Free and open-source tools only

## Local environment variables

Configure these variables in each applicable STS run configuration. Do not commit their real values.

| Variable | Used by | Purpose |
|---|---|---|
| `DB_PASSWORD` | Auth, business, and monitoring services | Local MySQL password |
| `JWT_SECRET` | Auth service | JWT signing secret containing at least 32 characters |

## Implemented authentication flow

- User registration with BCrypt password hashing
- User login through the API Gateway
- Signed JWT access tokens containing username and role
- Stateless JWT validation for protected endpoints
- JSON `401 Unauthorized` responses for missing or invalid tokens
- Protected `GET /api/v1/auth/me` endpoint
- Unit tests for valid, invalid-signature, and expired JWTs

See [Auth Service API](docs/api/auth-service.md) for request examples.

## Import into Spring Tools for Eclipse

Import the repository root with **File → Import → Maven → Existing Maven Projects**. The Spring projects are located under `backend/`. STS automatically creates its own local `.project`, `.classpath`, and `.settings` files; do not copy or commit those files.

After pulling file changes, use **Refresh** and **Maven → Update Project** in STS.
