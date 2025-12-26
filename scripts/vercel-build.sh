#!/bin/bash
set -e

npm ci
npx nx build backend --configuration=production
npx nx build frontend --configuration=production
mkdir -p dist/libs/be/user-service/src/lib/database
cp -r libs/be/user-service/src/lib/database/migrations dist/libs/be/user-service/src/lib/database/

