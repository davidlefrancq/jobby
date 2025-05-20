#!/bin/bash
set -e

MARKER_FILE="/workflows/.initialized"

# Check if the marker file exists
if [ ! -f "$MARKER_FILE" ]; then
  for f in /workflows/*.json; do
    echo "🔵  Import $f"
    n8n import:workflow --input "$f"
  done

  touch "$MARKER_FILE"
  echo "🟢  Workflows initialisation finished!"
fi
