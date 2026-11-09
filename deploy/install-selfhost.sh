#!/bin/sh
set -eu

REPO=/home/aditya/Projects/VirtuaCarz
MONGO_BIN=/home/aditya/.cache/mongodb-binaries/mongod-x64-void-7.0.14

if [ "$(id -u)" -ne 0 ]; then
  echo "This script must be run via sudo." >&2
  exit 1
fi

cp -a /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak 2>/dev/null || true
install -o caddy -g caddy -m 0644 "$REPO/deploy/Caddyfile" /etc/caddy/Caddyfile

install -d -o aditya -g aditya -m 0755 /var/log/virtuacarz /var/log/virtuacarz-mongod

install -d -m 0755 /etc/sv/virtuacarz /etc/sv/virtuacarz/log
install -m 0755 "$REPO/deploy/runit/virtuacarz/run" /etc/sv/virtuacarz/run
install -m 0755 "$REPO/deploy/runit/virtuacarz/log/run" /etc/sv/virtuacarz/log/run
ln -sfn /etc/sv/virtuacarz /var/service/virtuacarz

install -d -m 0755 /etc/sv/virtuacarz-mongod /etc/sv/virtuacarz-mongod/log
install -m 0755 "$REPO/deploy/runit/virtuacarz-mongod/run" /etc/sv/virtuacarz-mongod/run
install -m 0755 "$REPO/deploy/runit/virtuacarz-mongod/log/run" /etc/sv/virtuacarz-mongod/log/run
ln -sfn /etc/sv/virtuacarz-mongod /var/service/virtuacarz-mongod

install -m 0755 "$MONGO_BIN" /usr/local/bin/mongod
install -d -o aditya -g aditya -m 0755 /home/aditya/.local/share/virtuacarz/mongodb
install -d -o aditya -g aditya -m 0755 /home/aditya/.local/share/virtuacarz/logs

sv down caddy >/dev/null 2>&1 || true
sv down virtuacarz >/dev/null 2>&1 || true
sv down virtuacarz-mongod >/dev/null 2>&1 || true

sv up virtuacarz-mongod
sleep 2
sv up virtuacarz
sv up virtuacarz/log
sv up virtuacarz-mongod/log
sv down caddy >/dev/null 2>&1 || true
sv up caddy

echo "VirtuaCarz self-hosted services installed/started."
sv status caddy
sv status virtuacarz
sv status virtuacarz/log
sv status virtuacarz-mongod
sv status virtuacarz-mongod/log
