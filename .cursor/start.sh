#!/usr/bin/env bash
# Per-boot runtime init: bring up PostgreSQL and ensure the app role/database exist.
# Idempotent: tolerates an already-running cluster and pre-existing role/db, then returns.
set -euo pipefail

PG_VER="$(ls /usr/lib/postgresql 2>/dev/null | sort -V | tail -n1)"
if [ -z "${PG_VER:-}" ]; then
  echo "PostgreSQL is not installed" >&2
  exit 1
fi

DB_NAME="workoutdb"
DB_USER="workout_user"
DB_PASS="strongpassword"

echo "==> Ensuring PostgreSQL ${PG_VER} cluster is running"
if ! sudo pg_ctlcluster "$PG_VER" main status >/dev/null 2>&1; then
  sudo pg_ctlcluster "$PG_VER" main start
fi

echo "==> Waiting for PostgreSQL to accept connections"
for _ in $(seq 1 30); do
  if sudo -u postgres pg_isready -q; then break; fi
  sleep 1
done
sudo -u postgres pg_isready

echo "==> Ensuring role '${DB_USER}' and database '${DB_NAME}' exist"
sudo -u postgres psql -v ON_ERROR_STOP=1 <<SQL
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '${DB_USER}') THEN
    CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
  END IF;
END
\$\$;
SQL

if ! sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname = '${DB_NAME}'" | grep -q 1; then
  sudo -u postgres createdb -O "$DB_USER" "$DB_NAME"
fi
sudo -u postgres psql -v ON_ERROR_STOP=1 -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"
sudo -u postgres psql -v ON_ERROR_STOP=1 -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO ${DB_USER};"

echo "==> start.sh complete: PostgreSQL ready on localhost:5432"
