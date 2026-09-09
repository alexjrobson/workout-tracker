#!/usr/bin/env bash
# Idempotent repository bootstrap: build the backend jar and install frontend deps.
# Runs after the source tree is checked out. Safe to run repeatedly.
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

export JAVA_HOME="${JAVA_HOME:-$(dirname "$(dirname "$(readlink -f "$(command -v java)")")")}"

echo "==> Building Spring Boot backend (skipping tests; they need a live database)"
chmod +x mvnw
./mvnw -q -DskipTests clean package

echo "==> Installing React frontend dependencies"
cd workout-tracker-frontend
npm install

echo "==> install.sh complete"
