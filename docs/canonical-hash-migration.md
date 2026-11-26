# Canonical hash migration: protocol 0.4

Protocol 0.4 uses codec-format-interface 2.x and peernet 2.x together. Serialized
hashes contain `codec → digest byte length → digest`, with canonical unsigned
varints. The decoder does not support length-first hashes or padded varints.
The digest algorithm is unchanged; content-address strings change.

## Repository artifacts

`scripts/migrate-genesis-hashes.js` re-addresses the four existing public native
contract messages in dependency order, updating constructor links between them.
It preserves the owner, allocations, supply parameters, contract source and fees.
It is not `create-genesis`: it never opens a wallet, creates an identity, reads
credentials, resets stores, starts a node or changes a live deployment.

After building messages, check that committed artifacts are self-consistent:

```sh
node scripts/migrate-genesis-hashes.js
```

The explicit `--write` option updates only the two generated repository JSON
artifacts. Review their diff and run the complete build, core tests, local E2E and
browser checks before publishing. Never migrate only the address prefix: a changed
native-token hash also changes dependent contract messages and their hashes.

## Coordinated deployment, not an in-place ledger upgrade

1. Publish codec-format-interface 2.0.0 and peernet 2.0.0 first.
