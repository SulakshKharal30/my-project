# ChatOps Deployment Bot

## Quickstart (local dev)

1. Copy `.env.example` to `.env` and fill in secrets (Slack signing secret, Slack bot token, GitHub PAT, MONGODB_URI).
2. Run mongo + bot with docker-compose:
3. Seed the DB:
4. Expose local server for Slack/GitHub webhooks (ngrok) and set Slack app URLs / GitHub webhook to the public URL.

## Endpoints
- POST /slack/commands
- POST /slack/actions
- POST /github/webhook

## Notes
- Slack request signature is verified.
- GitHub webhook signature is verified.
- All deployments create an immutable audit entry and a deploymentRun record.
