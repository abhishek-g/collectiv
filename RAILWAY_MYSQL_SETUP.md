# Setting up Railway MySQL Database

This guide explains how to set up your Railway MySQL database with the same schema as your local database.

## Option 1: Automatic Migration (Recommended)

Migrations run automatically when your Vercel serverless function starts. Just configure the environment variables:

### Step 1: Get Railway MySQL Connection Details

1. Go to Railway Dashboard → Your MySQL Service
2. Click on the **Variables** tab
3. Copy these values:
   - `MYSQLHOST` (or `MYSQL_HOST`)
   - `MYSQLPORT` (usually `3306`)
   - `MYSQLUSER` (or `MYSQL_USER`)
   - `MYSQLPASSWORD` (or `MYSQL_PASSWORD`)
   - `MYSQLDATABASE` (or `MYSQL_DATABASE`)

### Step 2: Set Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables:

```
DB_HOST=<Railway MYSQLHOST>
DB_PORT=<Railway MYSQLPORT>
DB_USER=<Railway MYSQLUSER>
DB_PASSWORD=<Railway MYSQLPASSWORD>
DB_NAME=<Railway MYSQLDATABASE>
```

### Step 3: Deploy to Vercel

When you deploy to Vercel, the migrations will run automatically on the first API request. Check the Vercel function logs to see migration progress.

---

## Option 2: Manual Migration Script

If you want to run migrations manually, use the provided script:

### Using Railway CLI (Recommended)

```bash
# Install Railway CLI if you haven't
npm i -g @railway/cli

# Login to Railway
railway login

# Link to your project
railway link

# Run migrations
railway run --service mysql npx tsx scripts/migrate-railway.ts
```

### Using Environment Variables Locally

1. Create a `.env` file in the project root (or use Railway's connection string):

```env
DB_HOST=your-railway-host.railway.app
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your-password
DB_NAME=railway
```

2. Run the migration script:

```bash
# Install tsx if needed
npm install -g tsx

# Run migrations
npx tsx scripts/migrate-railway.ts
```

---

## Option 3: Direct MySQL Connection

You can also connect directly using MySQL client:

```bash
# Get connection string from Railway
railway connect mysql

# Or use mysql client directly
mysql -h <host> -P <port> -u <user> -p<password> <database> < apps/backend/src/services/user-service/database/migrations/001_create_users_table.sql
mysql -h <host> -P <port> -u <user> -p<password> <database> < apps/backend/src/services/user-service/database/migrations/002_create_sessions_table.sql
mysql -h <host> -P <port> -u <user> -p<password> <database> < apps/backend/src/services/user-service/database/migrations/003_create_communities_table.sql
mysql -h <host> -P <port> -u <user> -p<password> <database> < apps/backend/src/services/user-service/database/migrations/004_create_community_members_table.sql
```

---

## Migration Files

The following migrations will be applied in order:

1. `001_create_users_table.sql` - Creates users table
2. `002_create_sessions_table.sql` - Creates sessions table
3. `003_create_communities_table.sql` - Creates communities table
4. `004_create_community_members_table.sql` - Creates community_members table

---

## Troubleshooting

### Migrations already applied
If you see "Table already exists" errors, that's fine - the migrations are idempotent and will skip already-applied migrations.

### Connection issues
- Verify your Railway MySQL service is running
- Check that your IP is whitelisted (if Railway requires it)
- Verify environment variables are set correctly

### Migration errors
Check the Vercel function logs or Railway logs for detailed error messages. Common issues:
- Database doesn't exist (will be created automatically)
- Insufficient permissions
- Network connectivity issues

