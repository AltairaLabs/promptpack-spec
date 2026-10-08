"""Python: jsonschema Draft 2020-12 (what promptpack-python uses).

Also compiles every pattern with Python's re, and validates *.yaml fixtures
through PyYAML — a YAML 1.1 parser, so it catches keys like `on` that it reads
as booleans (the v1.8.0 `independent_of.on` trap).
"""
import glob
import json
import os
import re
import sys

import yaml
from jsonschema import Draft202012Validator

schema = json.load(open(sys.argv[1]))
Draft202012Validator.check_schema(schema)


def patterns(node):
    if isinstance(node, dict):
        for k, v in node.items():
            if k == "pattern" and isinstance(v, str):
                yield v
            if k == "patternProperties" and isinstance(v, dict):
                yield from v
            yield from patterns(v)
    elif isinstance(node, list):
        for v in node:
            yield from patterns(v)


for p in patterns(schema):
    re.compile(p)

validator = Draft202012Validator(schema)
ok = True
files = sorted(glob.glob(os.path.join(sys.argv[2], "*.json")) + glob.glob(os.path.join(sys.argv[2], "*.yaml")))
for f in files:
    name = os.path.basename(f)
    with open(f) as fh:
        doc = yaml.safe_load(fh) if f.endswith(".yaml") else json.load(fh)
    errs = list(validator.iter_errors(doc))
    good = (not errs) == name.startswith("valid")
    ok &= good
    detail = "" if good else " " + "; ".join(e.message[:160] for e in errs[:2])
    print(("PASS" if good else "FAIL"), "python-jsonschema", name + detail)
sys.exit(0 if ok else 1)
