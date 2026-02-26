---
name: i18n-check
description: Check locale files for parity — find keys missing in en.json or he.json and optionally fix them
---

# i18n Check

Audit `src/locales/en.json` and `src/locales/he.json` for parity issues.
Finds keys present in one file but missing from the other, and optionally adds the missing ones.

## Instructions

### 1. Read both locale files

Always read the current content of both files first:
- `src/locales/en.json`
- `src/locales/he.json`

### 2. Deep-compare keys

Recursively walk both JSON trees and collect:
- **Missing from `he.json`** — keys present in `en.json` but absent in Hebrew
- **Missing from `en.json`** — keys present in `he.json` but absent in English
- **Empty values** — keys that exist in both but have an empty string `""` in either file

Build a flat list of dot-notation paths for each category, e.g.:
```
common.save         → missing from he.json
auth.login.title    → missing from en.json
buttons.cancel      → empty in he.json
```

### 3. Report findings

Present a structured report:

```
## i18n Parity Report

### Missing from he.json (3 keys)
- common.save          (en: "Save")
- buttons.submit       (en: "Submit")
- auth.login.subtitle  (en: "Welcome back")

### Missing from en.json (1 key)
- common.loading_dots  (he: "טוען...")

### Empty values (2 keys)
- forms.errors.required   → empty in he.json
- navigation.back         → empty in en.json

### ✅ Status: OUT OF SYNC (6 issues)
```

If everything matches:
```
### ✅ Status: IN SYNC — all keys match in both locale files
```

### 4. Fix missing keys

If issues are found, choose the mode based on the user's request:

**Mode: report only** (default, no modifier in request)
→ Report issues and ask the user what they'd like to do.

**Mode: fix** (user says "fix" or "--fix")
→ Add `"TODO"` as a placeholder for any missing translations so the files stay in sync. Mark these clearly for the user to fill in later.

**Mode: interactive** (user provides translation values)
→ Ask the user for the Hebrew values for keys missing from `he.json`, or English values for keys missing from `en.json`, then add them to the correct file.

### 5. After fixing

If any keys were added:
- Verify both files are still valid JSON
- Re-run the comparison to confirm `IN SYNC`
- Show the user which keys still have `"TODO"` placeholders

## Rules

- NEVER add machine-translated Hebrew — always ask the user or use `"TODO"` placeholders
- ALWAYS update BOTH files when fixing — never one without the other
- ALWAYS maintain the same JSON structure (nesting, ordering) as the existing file
- Key names use camelCase — flag any that don't match this convention
- After any edit, verify both files are valid JSON before finishing
