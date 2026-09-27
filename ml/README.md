# Phase 3 ML Pipeline

This directory contains the reproducible research pipeline for UNSW-NB15.
Raw data, generated reports, MLflow state, and trained binaries are local
artifacts and are excluded from Git.

## 1. Create the local environment

From the repository root in PowerShell:

```powershell
py -m venv ml/.venv
ml/.venv/Scripts/Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r ml/requirements.txt
```

## 2. Obtain the official data

Follow `ml/data/README.md`. Put the two official files in `ml/data/raw/unsw-nb15/`.

## 3. Validate provenance and schema

```powershell
python ml/data/validate_unsw_nb15.py
```

The validator writes `ml/artifacts/dataset-validation.json`, including file
hashes, row counts, schema, missing values, duplicate counts, and label counts.

## 4. Train and evaluate

```powershell
python ml/training/train_baselines.py --model all
```

The script selects using validation macro F1, then evaluates each fitted model
on the official held-out test file. Results and confusion matrices are written
under `ml/artifacts/`. The same evidence is recorded by MLflow in the local
SQLite database `ml/mlflow.db`.

The first run can take several minutes. Use `--model logistic` for the lightest
sanity check.
