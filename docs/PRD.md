# Product Requirements Document

## 1. Product title

**AI-Driven Adaptive Post-Quantum Cryptographic Security Framework for Distributed Applications**

## 2. Purpose

Build a research-oriented security framework for distributed microservice applications. The system collects security events, estimates risk using an AI/ML model, selects an appropriate classical, hybrid, or post-quantum cryptographic policy, and records the resulting decision for audit and evaluation.

This document is the scope boundary for the project. New work must support the architecture, research objectives, or evaluation criteria defined here.

## 3. Core problem

Distributed applications commonly apply static security controls. They do not automatically adjust cryptographic protection according to observed threats, data sensitivity, compatibility, and performance constraints. The project will demonstrate an adaptive framework that makes explainable, auditable security decisions while supporting migration toward post-quantum cryptography.

## 4. Primary objectives

1. Build a secure Spring Boot microservice foundation with service discovery and API routing.
2. Implement authentication, JWT authorization, role-based access control, and secure password storage.
3. Collect normalized authentication, API, traffic, anomaly, and audit events.
4. Train and evaluate an AI/ML model for threat or anomaly risk classification.
5. Implement an adaptive policy engine that combines model risk with application constraints.
6. Provide crypto-agility across classical, hybrid, and post-quantum modes.
7. Protect service-to-service communication and record every security decision.
8. Measure model quality, cryptographic overhead, API latency, and resource usage.
9. Produce reproducible experimental evidence suitable for a research paper.

## 5. Intended users

- **Application user:** registers, logs in, and accesses protected APIs.
- **Administrator/security analyst:** reviews threats, risks, policy decisions, and audit records.
- **Researcher/developer:** runs experiments, evaluates models, and compares cryptographic modes.

## 6. System scope

### 6.1 Client layer

- React web security dashboard.
- Bruno collections for development and API verification.
- Mobile and external API clients are architecture-compatible but are not required for the first implementation.

### 6.2 Backend microservices

- **Discovery Server:** Eureka service registry.
- **API Gateway:** routing, CORS, request filtering, and rate-limiting entry point.
- **Auth Service:** registration, login, BCrypt, JWT, and RBAC.
- **Business Service:** protected demonstration APIs and application data.
- **Security Monitoring Service:** normalized events, audit records, and risk-decision history.

### 6.3 Adaptive security platform

- **AI Security Service:** Python inference API for threat/anomaly risk scores.
- **Adaptive Policy Engine:** converts risk and constraints into a cryptographic mode.
- **Event Contracts:** versioned schemas exchanged by services.
- **Crypto-Agility Layer:** common interface for classical, hybrid, and PQC operations.

### 6.4 Cryptographic modes

- **Classical:** AES, SHA-2/SHA-3, RSA or ECC where appropriate.
- **Hybrid:** approved classical protection combined with post-quantum protection.
- **Post-quantum:** ML-KEM for key establishment and ML-DSA for signatures.

Cryptographic primitives must use maintained libraries; custom cryptographic algorithms are prohibited.

### 6.5 AI/ML and dataset scope

- Primary public baseline dataset: **UNSW-NB15**.
- Project-generated API and authentication security events will be added for system-specific evaluation.
- Candidate models may include Random Forest, XGBoost/LightGBM-equivalent open-source methods, and a suitable neural baseline.
- Final model selection must use measured validation results rather than a predetermined algorithm.

## 7. Research requirements

1. Review four to six directly relevant peer-reviewed papers.
2. Record each paper's dataset, preprocessing, model, metrics, reported result, and limitations.
3. Reproduce or establish a fair baseline before claiming improvement.
4. Report accuracy together with precision, recall, F1-score, confusion matrix, ROC-AUC when appropriate, and inference latency.
5. Use train/validation/test separation and prevent data leakage.
6. Compare results under the same dataset split and preprocessing whenever possible.
7. Do not promise or invent improved accuracy; improvements must be demonstrated experimentally.
8. Document negative results and trade-offs, including false positives and cryptographic overhead.

## 8. Adaptive policy inputs and outputs

### Inputs

- AI risk score and predicted threat class.
- Data sensitivity.
- Authentication state and user role.
- Application security requirements.
- Client and service cryptographic compatibility.
- Latency, CPU, memory, and key-size constraints.

### Outputs

- Risk level and explanation.
- Selected mode: `CLASSICAL`, `HYBRID`, or `PQC`.
- Selected algorithm profile.
- Policy reason and version.
- Timestamp, request correlation ID, and audit record.

Initial deterministic policy:

| Risk | Default mode |
|---|---|
| Low | Classical |
| Medium | Hybrid |
| High | Post-quantum |

Compatibility and performance constraints may select a safe fallback, which must be recorded and explainable.

## 9. Security requirements

- Passwords stored only as adaptive hashes such as BCrypt.
- Stateless JWT authentication with signature and expiration validation.
- RBAC enforcement on protected APIs.
- Secrets supplied through environment variables or a secret manager, never committed.
- Input validation and safe error responses.
- TLS for deployed communication.
- Security-event and policy-decision audit trail.
- Dependency, static-analysis, container, and dynamic API security scanning.
- No sensitive values in logs, datasets, screenshots, or Git history.

## 10. Non-functional requirements

- Java 21 for Java services.
- Free and open-source dependencies and tools only.
- Reproducible local execution on a 16 GB RAM development laptop.
- Independently buildable and testable services.
- Versioned API/event contracts.
- Dockerized deployment followed by local Kubernetes deployment.
- Automated tests and CI checks for every completed phase.
- Observable health, metrics, and structured logs.

## 11. Approved technology stack

| Area | Technology |
|---|---|
| Java backend | Java 21, Spring Boot, Spring Cloud, Maven |
| Service discovery | Netflix Eureka |
| API gateway | Spring Cloud Gateway Server Web MVC |
| Database | MySQL; H2 for isolated automated tests |
| Authentication | Spring Security, BCrypt, JWT |
| Frontend | React |
| AI/ML | Python, scikit-learn and other justified free libraries |
| API testing | Bruno |
| Containers | Docker Desktop and Docker Compose |
| Orchestration | Kubernetes supplied by Docker Desktop |
| Monitoring | Prometheus and Grafana |
| ML experiment tracking | MLflow |
| Security testing | Semgrep, OWASP ZAP, and Trivy |
| CI/CD | GitHub Actions |

Adding a major technology requires an architecture decision in `docs/decisions/`.

## 12. Repository boundaries

| Directory | Responsibility |
|---|---|
| `backend/` | Spring Boot services only |
| `frontend/` | React and future client applications |
| `platform/` | AI inference, policy engine, event contracts, and crypto agility |
| `ml/` | Dataset instructions, training, evaluation, and model metadata |
| `infrastructure/` | Database, Docker, Kafka, Kubernetes, monitoring, and security tools |
| `tests/` | Cross-service, end-to-end, performance, and Bruno tests |
| `docs/` | Architecture, APIs, research evidence, and decisions |
| `scripts/` | Repeatable setup, build, test, and demo automation |

Generated output, IDE metadata, real secrets, large raw datasets, and unversioned model binaries must not be committed.

## 13. Delivery phases

### Phase 1: Microservice and identity foundation

- Eureka, API Gateway, Auth, Business, and Monitoring services.
- MySQL schemas.
- Registration, login, JWT validation, protected endpoint, and tests.

### Phase 2: Business API and security-event pipeline

- Protected business endpoints.
- Correlation IDs and normalized event contracts.
- Monitoring persistence and audit APIs.
- Gateway request controls.

### Phase 3: ML research pipeline

- Research-paper comparison matrix.
- UNSW-NB15 acquisition and reproducible preprocessing.
- Baseline and candidate training.
- Evaluation, model selection, and experiment tracking.

### Phase 4: Adaptive policy engine

- Risk inference integration.
- Versioned deterministic policy rules.
- Explainable crypto-mode decisions and audit records.

### Phase 5: Cryptographic agility

- Common crypto API.
- Classical, hybrid, ML-KEM, and ML-DSA implementations.
- Correctness, interoperability, and benchmark tests.

### Phase 6: Dashboard and observability

- Authentication UI, risk dashboard, policy history, and audit views.
- Prometheus metrics and Grafana dashboards.

### Phase 7: DevSecOps and deployment

- Docker Compose local stack.
- CI security and test gates.
- Kubernetes manifests and local deployment.
- Final end-to-end and performance evaluation.

### Phase 8: Research report and demonstration

- Reproducible results and comparison tables.
- Threats to validity and limitations.
- Architecture, demonstration scenario, and final paper material.

## 14. Current status

Completed:

- Structured monorepo and GitHub repository.
- Eureka discovery and API Gateway registration/routing.
- Auth, business, and monitoring service foundations.
- MySQL-backed user registration and BCrypt hashing.
- Login with signed JWT generation.
- Stateless JWT validation and protected current-user endpoint.
- Isolated automated tests and Bruno end-to-end collection.
- Gateway correlation-ID propagation.
- JWT-protected Business Service API.
- Normalized authentication and API security-event contracts.
- Internal event ingestion and MySQL-backed monitoring audit history.
- JWT-protected security-event query API.

Next approved milestone: **Phase 3 — research-paper matrix, UNSW-NB15 preparation, baseline models, and reproducible evaluation**.

Phase 3 foundation completed:

- Traceable literature comparison matrix and experiment protocol.
- Official UNSW-NB15 acquisition and provenance-validation instructions.
- Leakage-safe logistic-regression and random-forest baseline pipelines.
- Accuracy, precision, recall, F1, ROC-AUC, confusion-matrix, false-positive,
  training-time, and inference-latency evidence capture.
- Free local MLflow experiment tracking configuration.

Next execution milestone: download the official predefined UNSW-NB15 files,
validate their hashes/schema, run the baselines, and review measured results.

Baseline execution completed on 2026-09-27. Random Forest is the current
validation winner, but its generalization and false-positive rate require
additional Phase 3 experiments before model promotion. See
`docs/research/phase-3-baseline-results.md`.

Phase 4 adaptive-security foundation implemented:

- Local FastAPI inference service for the promoted UNSW-NB15 model.
- Strict network-flow feature schema validation and explainable risk output.
- Versioned deterministic policy rules using risk, data sensitivity,
  compatibility, and latency constraints.
- Classical, hybrid, and PQC policy profiles with explicit fallback reasons.
- MySQL-backed decision audit containing model and policy versions.
- Internal API-key protection and automated rule, security, and context tests.

The UNSW-NB15 network-flow dataset and generated microservice security events
remain separate because they have different schemas and research meanings.

Next approved milestone: **Phase 5 — implement and benchmark the common crypto
API plus classical, hybrid, ML-KEM, and ML-DSA execution providers**.

Phase 5 cryptographic-agility foundation implemented:

- Common KEM, signature, payload-cipher, key-pair, and secure-envelope APIs.
- X25519, AES-256-GCM, and ECDSA P-256 classical providers.
- NIST ML-KEM-768 and ML-DSA-65 providers through Bouncy Castle 1.86.
- Maintained X-Wing hybrid key establishment combining X25519 and ML-KEM-768.
- Fail-closed mapping from policy `1.1.0` profiles to executable providers.
- Authentication of ciphertext, encapsulation, algorithm metadata, and
  application-supplied associated context.
- Correctness and tamper tests plus reproducible JMH benchmark scaffolding.

Next integration milestone: expose controlled crypto execution to the business
flow, persist execution metrics beside policy decisions, and then implement the
dashboard/observability phase. Accuracy optimization remains deferred until the
complete system path is operational.

## 15. Definition of done

A feature is complete only when:

1. It supports a requirement in this PRD.
2. Source code is placed in the correct repository boundary.
3. Secrets and generated output are excluded from Git.
4. Relevant automated tests pass.
5. API, architecture, or research documentation is updated.
6. The root Maven build remains successful for Java changes.
7. The change is committed and pushed to `main` or reviewed through a pull request.

The overall project is complete when the end-to-end flow from request, authentication, event collection, AI risk inference, policy selection, cryptographic execution, response, and audit visualization is demonstrated and evaluated with reproducible security, accuracy, and performance results.

## 16. Explicit non-goals

- Building a production banking, healthcare, or government system.
- Claiming formal cryptographic or regulatory certification.
- Designing new cryptographic primitives.
- Using paid cloud services or proprietary datasets.
- Implementing unrelated features that do not support adaptive AI/PQC security.
- Claiming accuracy improvement without reproducible evidence.
