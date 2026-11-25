# Security and Preview deployment notes

## Credential exposure remediation

The previous `config/config.json` contained non-empty database credential fields for multiple environments. This PR removes that tracked configuration file and changes the Sequelize bootstrap to require credentials from environment variables only.

**Important:** deleting the file in this branch does not remove it from Git history, forks, caches, or existing clones. Treat every previously committed database credential as exposed:
1. Rotate/revoke the affected database passwords at the database provider.
2. Update the runtime environment with the new values through the deployment provider's secret manager.
3. Review Git history, forks, releases, CI artifacts, and local clones.
4. Rewrite Git history only as a separately approved maintenance operation; do not force-push as part of this PR.

## Runtime configuration

- Required: `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS`.
- Optional: `DB_PORT`; defaults to the driver default.
- `DB_DIALECT` defaults to `postgres`; only `postgres` and `mysql` are accepted because those are the database drivers declared by the current project.
- Copy `.env.example` to a local `.env`; the existing ignore rules exclude `.env`.

## Preview boundary

This repository is a persistent Node.js API using PostgreSQL/MongoDB/Redis and media-processing dependencies. It must run on a persistent Node/container host, not inside a Cloudflare Worker. A Cloudflare Worker may later provide a read-only edge gateway after the backend has its own isolated Preview environment and credentials have been rotated.

No database, media source, external provider, production environment, or DNS record is configured by this PR. No media stream is activated. Verify rights and provenance for every media source before any public catalog or playback integration.
