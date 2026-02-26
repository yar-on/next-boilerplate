---
description: Add translation keys to both en.json and he.json locale files
---

# Add Translation Key

Add one or more translation keys to the project's locale files (`src/locales/en.json` and `src/locales/he.json`).

## Request

$ARGUMENTS

## Instructions

### 1. Parse the request

Expected formats:
- `<namespace>.<key> "<english>" "<hebrew>"` — full form
- `<namespace>.<key> "<english>"` — English only (ask user for Hebrew)
- `<namespace> <key> <en> <he>` — space-separated

If the request is ambiguous or Hebrew is missing, ask the user before proceeding.

### 2. Read both locale files

Always read the current content of both files before editing:
- `src/locales/en.json`
- `src/locales/he.json`

### 3. Add the key

- Navigate to the correct namespace (create it if it doesn't exist)
- Add the key maintaining **alphabetical ordering** within the namespace
- Use **2-space indentation** and standard JSON formatting
- For nested keys (e.g., `auth.login.title`), create the full nesting structure

### 4. Validate

After editing, verify:
- Both files are valid JSON
- The key exists in both `en.json` and `he.json`
- No duplicate keys were created

### 5. Report

Show the user:
- The full key path added (e.g., `auth.login.title`)
- The English value
- The Hebrew value
- Usage example for both Server and Client components

## Usage Examples

```
/add-translation common.save "Save" "שמור"
/add-translation auth.login.title "Sign In" "התחבר"
/add-translation errors.required "This field is required" "שדה זה חובה"
/add-translation navigation.home "Home" "דף הבית"
```

## Output Example

After adding `common.save`:

```tsx
// Server Component
const t = await getTranslations('common');
t('save') // → "Save" (en) / "שמור" (he)

// Client Component
const t = useTranslations('common');
t('save') // → "Save" (en) / "שמור" (he)
```

## Rules

- ALWAYS update both locale files — never one without the other
- Hebrew text is RTL — trust user-provided values, don't translate yourself
- Follow the existing key structure and naming patterns in the files
- Use camelCase for key names (e.g., `loginTitle`, not `login-title`)
- If a namespace doesn't exist in either file, create it in both
