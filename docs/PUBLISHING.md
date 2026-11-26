# Publishing changed packages

Package releases use npm's published `gitHead` as their source of truth. This
lets the repository determine which workspace packages changed since their last
actual npm publication.

When an older `gitHead` is no longer reachable after a squash merge, the tool
falls back to npm's immutable publication timestamp and compares the
publish-relevant package manifest fields separately. This also works in a fresh
CI checkout without relying on locally retained git objects.

## Prepare a release

Run:

```sh
npm run release:status
npm run release:prepare
```

`release:prepare` patch-bumps only changed public workspace packages and updates
`package-lock.json`. Review, commit, and merge those changes normally.

Use `npm run release:dry-run` to preview the detected packages and versions
without writing files.

Version-only changes and changelog edits do not cause another bump. Changes to
source, tests, build configuration, or package dependencies do.

