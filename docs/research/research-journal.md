# Research Journal

Project: **AI-Driven Adaptive Post-Quantum Cryptographic Security Framework for
Distributed Applications**

Started: **2026-10-01 (Asia/Calcutta)**

This is the ongoing record for preparing the research paper. Record meaningful
design decisions, changes, experiments, failures, and limitations as they happen.
Entries distinguish proposals, implementations, historical measurements, and
newly verified results. Do not infer a measured result from a feature existing.
Earlier work below is reconstructed from saved evidence and project documents;
it is not a complete contemporaneous log of every earlier action.

## Evidence index

- [Project scope and publication objective](../PRD.md)
- [Paper inventory and exact local-copy hashes](papers-manifest.md)
- [Literature comparison and comparability limitations](literature-matrix.md)
- [Dataset, split, and iterative experiment protocol](phase-3-experiment-protocol.md)
- [Recorded ML baseline](phase-3-baseline-results.md)
- [Recorded crypto benchmark](phase-5-crypto-benchmark-results.md)
- [System evaluation and claim boundaries](system-evaluation-summary.md)

## Earlier milestones: reconstructed evidence

| Work | Evidence | Status and interpretation |
|---|---|---|
| Microservice foundation, authentication and audit | PRD and system evaluation summary | Implementation and previously reported API evidence; services are currently stopped |
| Binary intrusion model | Baseline report and local `ml/artifacts/baseline-results.json` | Saved experiment dated 2026-09-27; measurements checked on 2026-10-01, training not rerun |
| Adaptive policy and crypto execution | System evaluation summary and architecture documentation | Implemented risk-to-mode flow with recorded decisions; policy/crypto quality must be measured separately from IDS accuracy |
| Crypto performance | Phase 5 benchmark report | Historical local benchmark; results depend on hardware and measurement protocol |
| Dashboard explanations and controls | Frontend source/tests; latest chat verification | Four frontend tests and production build previously passed; full visual browser and live-stack review still pending |

### Baseline measurement retained for comparison

Task: binary normal-versus-attack classification on the official UNSW-NB15
test file, **82,332 records**. The official training file provides training and
validation partitions. Dataset hashes and confusion matrices are in the report.

| Metric | Recorded Random Forest test result |
|---|---:|
| Accuracy | 89.7889% (89.79% rounded) |
| Macro F1 | 89.46% |
| Attack recall | 97.65% |
| False-positive rate | 19.85% |
| ROC-AUC | 98.43% |

Confusion matrix `[[TN, FP], [FN, TP]]`:
`[[29657, 7343], [1064, 44268]]`.
Correct classifications: **73,925 / 82,332**.
Validation accuracy **95.48%** is a separate measurement and must not replace
test accuracy. An individual API attack probability is not model accuracy.
Access to promoted metadata was denied during the current audit, so this check
did not independently establish the currently deployed model's hash.

## 2026-10-01: Publication goal and related-work review

**Decision:** Aim for a strong submission to a reputable peer-reviewed venue,
with an explicit contribution, reproducible experiments, and honest limitations.
Acceptance and superiority over existing work are goals, not guaranteed results.

Closely related work found through publisher and preprint searches:

- [ML-driven adaptive PQC selection in cloud microservices, 2026](https://jidmis.org/index.php/jidmis/article/view/3224): its risk forecasts service-performance/SLA conditions; our prototype uses network attack probability and application constraints.
- [Policy-governed PQC migration for legacy microservices, 2026](https://arxiv.org/abs/2609.14286): focuses on sidecar migration and rollback; our implemented flow selects and executes protection for individual application requests.

**Interpretation:** The broad combination of AI, adaptive policies,
microservices, and PQC already exists. No exact duplicate was established in
this search, but absence of a found duplicate is not proof of uniqueness.
Attack-risk- and sensitivity-aware selection with measured execution overhead
is a candidate contribution requiring comparison and ablation evidence.

The following reported IDS figures were verified against primary publications:

| Source | UNSW-NB15 accuracy reported | Difference from our rounded baseline |
|---|---:|---:|
| [BLOEO feature selection, 2024](https://www.nature.com/articles/s41598-024-67488-7) | 97.60% | 7.81 percentage points above ours |
| [Self-attention explainable IDS, 2025](https://pmc.ncbi.nlm.nih.gov/articles/PMC12618664/) | 97.90% | 8.11 points above ours |
| [SAGEConv-GNN + Transformer, 2026](https://www.mdpi.com/2079-9292/15/8/1737) | 98.41% | 8.62 points above ours |

These differences are arithmetic comparisons of reported numbers. Dataset
partitions, label tasks, preprocessing and sample sizes may differ. They do
not establish a controlled ranking of the methods or overall system security.
Our project has not demonstrated higher accuracy than these papers.

## 2026-10-01: Iterative improvement plan

**Accepted method:** Freeze the study -> validate data -> manage features inside
training folds -> analyse validation errors -> bounded model optimization ->
validation-only threshold/calibration tuning -> repeated checks -> freeze the
recipe -> final evaluation -> controlled integration and rollback evidence.

**Priority:** Reduce false alarms without a substantial loss in attack recall.
Report accuracy, macro F1, recall, FPR, latency and variation together. Retain
unsuccessful experiments and explain trade-offs. Never alter labels or select
settings using the official test metrics.

**Planned candidates:** tuned Random Forest, Extra Trees, and a CPU-feasible
gradient boosting model. These are proposals; no new candidate has been trained
or measured during this discussion.

**Next implementation requirement:** Introduce a validation-only optimization
runner with a separate final-evaluation step. The current baseline runner
evaluates fitted models on the test file and must not be reused as an iterative
test-driven tuning loop. Prior test results are already known; disclose reuse
and add independent generalization evidence where possible.

**Deferred work:** Controlled bot/request-flood tests, final hosting feasibility,
and comparable publication experiments. Cryptographic mode changes alone do
not demonstrate protection against request floods.

## 2026-10-01: Repeated confirmation and frozen XGBoost evaluation

- Status: measured; rejected for promotion.
- Repeated validation: seeds 42, 123 and 2026 all passed calibration gates.
  Selected thresholds were 0.575, 0.575 and 0.585; median frozen threshold was
  0.575. Candidate macro-F1 was 0.9521, 0.9538 and 0.9509 respectively.
- Frozen official test: accuracy 0.8917, macro-F1 0.8879, attack recall 0.9768,
  ROC-AUC 0.9847 and FPR 0.2125 (TN 29,137; FP 7,863; FN 1,052; TP 44,280).
- Historical RF comparison: accuracy 0.8979, macro-F1 0.8946, attack recall
  0.9765, ROC-AUC 0.9843 and FPR 0.1985. XGBoost did not improve the balanced
  deployment objective and was not promoted.
- Evidence: `ml/artifacts/xgboost-repeated-seed-confirmation-v1.json` and
  `ml/artifacts/xgboost-frozen-final-evaluation-v1.json`. The evaluated model is
  retained locally under `ml/models/evaluated/`; the promoted RF is unchanged.
- Limitation: the official test file has historical project exposure. Do not
  use this outcome for further tuning or call it wholly unseen. Future model
  optimization must remain training/validation-only and use separate external
  evidence for a new generalization claim.

## Template for each future entry

## 2026-10-01: Validation-only optimization runner prepared

- Status: implemented; not executed; no new model training or measurement.
- Parent evidence: historical RF validation results in
  `ml/artifacts/baseline-results.json`; baseline files were not changed.
- Change: added `ml/training/validation_sweep.py` with four bounded RF
  configurations, fixed stratified seed-42 split, and predeclared comparison
  gates. Runner reads only the official training CSV and writes a separate
  dated validation artifact if successfully run.
- Guardrails: official test CSV is not loaded, scored, or used for selection;
  no candidate is promoted by this runner.
- Verification: Python syntax compilation and `git diff --check` passed.
  Actual execution was blocked because Windows denied launching the configured
  Python 3.14 interpreter; available Python 3.12 is incompatible with the
  environment's CPython 3.14 NumPy binaries. Therefore there are no new metrics.
- Next: restore a working compatible Python environment, run the validation
  comparison, retain all outcomes, and implement a separately frozen final
  evaluation step before any promotion.

## 2026-10-01: First validation sweep attempt

- Status: trained and measured on validation; report serialization failed, so
  the machine-readable artifact was not written. Results below are transcribed
  from the user's PowerShell output and should be replaced/confirmed by a clean
  successful rerun.
- Dataset/split: official UNSW-NB15 training CSV only; seed 42; 140,272 fit
  rows and 35,069 validation rows; held-out test CSV was not loaded.
- Candidates (validation macro-F1 / attack recall / FPR / accuracy / fit sec):
  RF reference 0.948402 / 0.959571 / 0.055446 / 0.954775 / 47.5;
  shallower RF 0.938771 / 0.944614 / 0.051518 / 0.945850 / 23.9;
  deeper leaf-4 RF 0.947088 / 0.957183 / 0.054196 / 0.953549 / 41.4;
  unweighted RF 0.951975 / 0.981189 / 0.088929 / 0.958796 / 36.7.
- Interpretation: the unweighted RF had the best macro-F1 and recall, but its
  FPR exceeded the predeclared maximum of 0.065446; it is not eligible. The
  other candidates did not exceed baseline macro-F1. No model is promoted.
- Failure and repair: JSON serialization rejected NumPy's boolean type for the
  gate flag after all fits completed. The flag is now converted to a native
  Python boolean. The corrected script passed syntax validation, but this
  session could not relaunch the local Python executable; rerun from the user's
  normal PowerShell to save the artifact and confirm the transcribed metrics.

## 2026-10-01: Strict-results audit and next XGBoost sweep

- Status: prior artifacts verified; next experiment implemented but not yet run.
- Verified strict official-test results: balanced RF accuracy 0.8979 remains
  stronger than unweighted RF 0.8661, XGBoost 0.8565, and XGBoost without TTL
  features 0.8532. The combined random-split result of 0.9539 is a protocol
  demonstration, not an official held-out test result or promoted model.
- Change: added `ml/training/validation_xgboost_sweep.py` with four bounded,
  CPU-feasible candidates, two worker threads, a fixed seed-42 validation split,
  dataset hashing, full validation metrics, and predeclared eligibility gates.
- Guardrail: the new runner opens only the official training CSV. It neither
  loads the official test CSV nor promotes a model. An eligible model is saved
  only as a validation candidate for subsequent repeated-seed confirmation.
- Execution status: pending on AWS or another permitted Python environment.
  Do not disable endpoint protection or firewall controls to run it.

## 2026-10-01: Threshold-calibration experiment prepared

- Status: implemented and measured; validation candidate only.
- Motivation: `xgb_depth8_regularized` reached validation accuracy 0.9593,
  macro-F1 0.9528 and attack recall 0.9770, but its FPR of 0.0783 exceeded the
  predeclared 0.0604 ceiling. It was not promoted or evaluated on official test.
- Method: split only the official training CSV into 70% fit, 15% calibration
  and 15% untouched validation partitions. Select the threshold on calibration
  under fixed FPR and attack-recall constraints, then evaluate it once on the
  untouched validation partition.
- Comparison: train the balanced Random Forest reference on the identical fit
  rows and require the calibrated candidate to beat its validation macro-F1.
- Measured calibration selection: threshold 0.575, accuracy 0.9591,
  macro-F1 0.9530, attack recall 0.9678 and FPR 0.0595.
- Untouched validation result at threshold 0.575: accuracy 0.9583,
  macro-F1 0.9521, attack recall 0.9667, ROC-AUC 0.9939 and FPR 0.0598
  (TN 7,898; FP 502; FN 596; TP 17,306).
- Same-split RF reference: accuracy 0.9550, macro-F1 0.9486, attack recall
  0.9604 and FPR 0.0564. The candidate improves accuracy, macro-F1 and recall
  while adding about 0.33 percentage points FPR, remaining below the fixed
  6.04% ceiling.
- Runtime: XGBoost fit 10.7 seconds; Random Forest reference 33.9 seconds.
- Evidence: `ml/artifacts/xgboost-threshold-calibration-v1.json`; local
  candidate bundle `ml/models/candidates/xgboost-threshold-calibration-v1.joblib`.
- Guardrail: official test CSV remains unopened; passing creates only a local
  validation-candidate bundle containing the fitted pipeline and threshold.

- Date/time and run/change ID:
- Question or hypothesis:
- Status: proposed / implemented / measured / reproduced / rejected:
- Previous baseline and parent run:
- What changed and why:
- Dataset/source, license, hashes, split and feature schema:
- Model/preprocessing/threshold settings, seeds and code revision:
- Test command or reproducible procedure and environment:
- Measured results, repeat variability and evidence artifact paths:
- Failures, negative results, resource cost and limitations:
- Interpretation and claim supported:
- Next action and reason to keep/reject/promote:

For architecture or UI changes, mark model/dataset fields not applicable.
Keep raw data, credentials, tokens and protected payloads out of this log.
Link safe reports and versioned configurations. Record a commit or model hash
only after it has actually been verified.
