# testUtils
General nodejs application testing utilities

## Repo configuration

The workflow requires the `NODE_VERSION` and `NPM_VERSION` repository variables. Set them to supported Node.js 24 and npm 12 releases.

```bash
gh auth login
gh variable set NODE_VERSION -b "24.21.0"
gh variable set NPM_VERSION -b "12.1.0"
```

## Verified package release

The reviewed 0.0.12 release uses `scripts/publish-approved-release.mjs`. It refuses an existing registry version, runs package preparation, publishes the exact tarball without changing tags in Git, and verifies registry integrity plus downloaded ESM/CommonJS consumer checks. The guarded main-branch job runs only for a commit beginning `Release testutils 0.0.12` after the build passes. The manual reviewed-version workflow uses the same checks.
