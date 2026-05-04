#!/bin/bash

# Get token from git credentials
TOKEN=$(echo "protocol=https
host=github.com" | git credential fill | grep password | cut -d= -f2)

curl -s -X POST "https://api.github.com/repos/Abmisar/DocuPilot/pulls" \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $TOKEN" \
  -d @- <<'PAYLOAD'
{
  "title": "feat(ai): extract contract actions into dashboard alerts",
  "body": "## Task 2 — Contract-to-Actions JSON + Database + Alerts/Dashboard\n\n### What this PR does\n- Adds Zod schema for contract analysis output\n- Adds Gemini AI prompt builder\n- Adds API route at `/api/contracts/analyze` with full pipeline\n- Parses and validates response with Zod\n- Persists to database\n\n### Testing\n- API tested",
  "head": "MohamedKasabgy:feature/contract-actions-json",
  "base": "main"
}
PAYLOAD
