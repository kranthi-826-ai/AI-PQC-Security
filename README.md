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

## Import into Spring Tools for Eclipse

Import the repository root with **File → Import → Maven → Existing Maven Projects**. The Spring projects are located under `backend/`. STS automatically creates its own local `.project`, `.classpath`, and `.settings` files; do not copy or commit those files.
