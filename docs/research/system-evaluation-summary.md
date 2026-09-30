# System Evaluation Summary

This document is the evidence index for the research demonstration. It links
each project claim to a repeatable test or measured result and prevents the
paper from treating implemented features as experimentally proven outcomes.

## Evaluated evidence

| Research question | Current evidence | Result | Remaining publication work |
|---|---|---|---|
| Can the system detect risky network flows? | Official UNSW-NB15 predefined split | Random Forest test macro F1 89.46%, attack recall 97.65%, ROC-AUC 98.43%, FPR 19.85% | Reduce false positives and compare candidates under the identical split |
| Can risk drive an auditable protection decision? | Policy unit/integration tests and MySQL decision records | Deterministic classical, hybrid, and PQC selection with model/policy versions and fallback reasons | Add scenario-distribution and decision-latency statistics |
| Can the selected profiles execute real standardized PQC? | Java correctness/tamper tests and JMH | ML-KEM-768, ML-DSA-65, hybrid X-Wing, X25519, and AES-GCM execute successfully | Repeat longer controlled benchmark runs and report artifact sizes |
| Does the distributed flow work end to end? | Isolated Docker Compose plus Bruno collection | 7/7 API scenarios passed; registration, login, JWT, risk, policy, crypto, audit, and denial paths verified | Repeat runs and export machine-readable test evidence for the paper |
| Is operational evidence observable? | Prometheus target checks, Grafana provisioning, MySQL audit queries | All seven configured Prometheus targets reported UP in the verified Compose run | Collect a timed demonstration trace and dashboard screenshots |
| Is deployment reproducible? | Maven/pytest/frontend CI, Compose, and rendered Kubernetes resources | Fourteen-module Maven reactor, Python tests, React tests/build, container E2E, and 27 Kubernetes resources validated | Run Kubernetes E2E when local cluster resources are available |

## Measured baselines

### Intrusion model

| Metric | Current held-out result |
|---|---:|
| Accuracy | 89.79% |
| Macro F1 | 89.46% |
| Attack recall | 97.65% |
| False-positive rate | 19.85% |
| ROC-AUC | 98.43% |

The complete dataset hashes, split rules, confusion matrices, and environment
are in [Phase 3 baseline results](phase-3-baseline-results.md).

### Cryptographic execution

| Operation | Local average time |
|---|---:|
| AES-256-GCM encrypt, 4 KiB | 3.043 us |
| ML-KEM-768 encapsulation | 34.539 us |
| Hybrid X-Wing encapsulation | 105.702 us |
| X25519 encapsulation | 210.821 us |
| ML-DSA-65 sign, 4 KiB | 692.220 us |

The protocol and interpretation limits are in the
[Phase 5 benchmark report](phase-5-crypto-benchmark-results.md).

## Demonstration sequence

1. Start the complete stack and confirm service discovery and health.
2. Register and log in through the gateway to obtain a JWT.
3. Prove that an unauthenticated protected request is denied.
4. Submit a network flow and confidential payload to the adaptive endpoint.
5. Show AI risk, policy explanation, selected cryptographic mode, verification,
   and component latency in the response.
6. Show the matching decision, execution, and security-event records in MySQL.
7. Show the same correlation ID and outcome in the dashboard and monitoring
   views.
8. Run the Bruno collection and retain its machine-readable result artifact.

## Claim boundaries

- The project is a research prototype, not a certified production security product.
- Model results are comparable only under the documented dataset and split.
- Local cryptographic timings are hardware- and protocol-dependent.
- Passing functional and vulnerability checks does not prove absence of defects.
- The project integrates standardized primitives; it does not invent a new cipher.
- Accuracy improvement will be claimed only after a candidate beats the current
  baseline on the untouched official test split and passes every promotion gate.
