# testUtils
General nodejs application testing utilities

## Repo configuration

The workflow requires the `NODE_VERSION` and `NPM_VERSION` repository variables. Set them to supported Node.js 24 and npm 12 releases.

```bash
gh auth login
gh variable set NODE_VERSION -b "24.21.0"
gh variable set NPM_VERSION -b "12.1.0"
```

## TypeScript compiler and lint tooling

Builds and package-consumer checks use TypeScript 7 through the `@typescript/native`
package alias. The `typescript` alias provides Microsoft's TypeScript 6 compatibility
API for typescript-eslint until it supports the native compiler API. This follows
[Microsoft's side-by-side setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0)
and keeps peer-dependency validation enabled. `tsc` runs TypeScript 7; `tsc6` is the
compatibility compiler.

## Verified package release

The reviewed 0.0.12 release uses `scripts/publish-approved-release.mjs`. It refuses an existing registry version, runs package preparation, publishes the exact tarball without changing tags in Git, and verifies registry integrity plus downloaded ESM/CommonJS consumer checks. The guarded main-branch job runs only for a commit beginning `Release testutils 0.0.12` after the build passes. The manual reviewed-version workflow uses the same checks.
