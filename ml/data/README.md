# UNSW-NB15 Data Acquisition

Use only the official UNSW-NB15 source linked from:

<https://research.unsw.edu.au/projects/unsw-nb15-dataset>

The university page documents academic-use permission, required citations,
features, attack families, and the official predefined split. Download these
exact files and place them locally as follows:

```text
ml/data/raw/unsw-nb15/
|-- UNSW_NB15_training-set.csv
`-- UNSW_NB15_testing-set.csv
```

Expected counts from the official page:

- training: 175,341 rows
- testing: 82,332 rows

Do not rename training as testing, merge the files before evaluation, or upload
the dataset to Git. Run `validate_unsw_nb15.py` immediately after download; its
SHA-256 output becomes the provenance record for the exact files used.
