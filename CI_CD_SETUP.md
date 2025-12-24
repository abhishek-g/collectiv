# CI/CD Setup Guide

This project includes comprehensive CI/CD workflows using GitHub Actions and Nx.

## Quick Start

### Option 1: Simple CI (Recommended for Start)

The `ci-simple.yml` workflow works out of the box without any additional setup:

1. **Push your code** - The workflow will automatically run on pushes and PRs
2. **No secrets required** - Works immediately

### Option 2: Full CI with Nx Cloud (Recommended for Teams)

The `ci.yml` workflow uses Nx Cloud for better caching and distributed execution:

1. **Sign up for Nx Cloud** (free): https://nx.app
2. **Get your access token** from the Nx Cloud dashboard
3. **Add GitHub Secret**:
   - Go to: Repository → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NX_CLOUD_ACCESS_TOKEN`
   - Value: Your Nx Cloud access token
   - Click "Add secret"

## Workflows Overview

### 1. `ci-simple.yml` - Simple CI Pipeline
**Best for**: Getting started quickly, small teams

- ✅ Lints affected projects
- ✅ Tests affected projects with coverage
- ✅ Builds affected projects
- ✅ Runs E2E tests
- ✅ Uploads coverage to Codecov (optional)

**No setup required** - works immediately!

### 2. `ci.yml` - Full CI with Nx Cloud
**Best for**: Larger teams, faster builds, distributed execution

- ✅ All features from simple CI
- ✅ Nx Cloud caching (faster builds)
- ✅ Distributed task execution
- ✅ Better build insights

**Requires**: Nx Cloud access token

### 3. `pr.yml` - Pull Request Checks
**Best for**: Detailed PR feedback

- ✅ Shows affected projects
- ✅ Separate jobs for lint, test, build
- ✅ Better visibility in PR checks

### 4. `cd.yml` - Continuous Deployment
**Best for**: Automated deployments

- ✅ Builds production artifacts
- ✅ Uploads artifacts for deployment
- ✅ Ready for deployment configuration

## Workflow Features

### Nx Affected
All workflows use `nx affected` to only run on changed projects:
- Faster CI times
- Only tests what changed
- Parallel execution

### Caching
- **npm cache**: Automatic via setup-node action
- **Nx cache**: Built-in Nx caching
- **Nx Cloud cache**: Shared cache across runs (with Nx Cloud)

### Parallel Execution
- Lint: 3 parallel jobs
- Test: 3 parallel jobs
- Build: 3 parallel jobs
- E2E: 1 job (sequential for stability)

## Customization

### Change Node Version

Edit the `NODE_VERSION` in workflow files:

```yaml
env:
  NODE_VERSION: '20'  # Change to '18', '22', etc.
```

### Add More Jobs

Add custom jobs to any workflow:

```yaml
jobs:
  custom:
    name: Custom Job
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npx nx run-many --target=custom-target --all
```

### Configure Deployment

Edit `.github/workflows/cd.yml` and add deployment steps:

#### Example: Deploy to Vercel (Frontend)
```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    working-directory: ./dist/frontend
```

#### Example: Deploy to Railway (Backend)
```yaml
- name: Deploy to Railway
  uses: bervProject/railway-deploy@v1.0.0
  with:
    railway_token: ${{ secrets.RAILWAY_TOKEN }}
    service: backend
```

#### Example: Docker Deployment
```yaml
- name: Build and push Docker images
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: your-registry/backend:latest
```

## Monitoring

### GitHub Actions
- View runs: Repository → Actions tab
- Check logs: Click on any workflow run
- Debug failures: Check job logs

### Nx Cloud (if enabled)
- View runs: https://nx.app
- Build insights: See cache hits, task timing
- Distributed execution: See agent status

## Troubleshooting

### Workflow Not Running
- Check branch names match workflow triggers
- Verify workflow file is in `.github/workflows/`
- Check GitHub Actions is enabled for repository

### Build Failures
- Check Node version matches your local setup
- Verify all dependencies are in `package.json`
- Check for environment-specific issues

### Nx Cloud Issues
- Verify `NX_CLOUD_ACCESS_TOKEN` secret is set
- Check token hasn't expired
- Verify repository is connected to Nx Cloud

### E2E Test Failures
- Ensure Playwright browsers are installed
- Check that build artifacts are available
- Verify test environment matches local setup

## Best Practices

1. **Use Nx Affected**: Always use `nx affected` instead of `nx run-many --all`
2. **Parallel Execution**: Keep parallel jobs reasonable (3-5 max)
3. **Cache Everything**: Enable caching for faster builds
4. **Fail Fast**: Run lint before tests, tests before build
5. **Artifact Retention**: Keep artifacts for 7 days (adjust as needed)
6. **Security**: Never commit secrets, always use GitHub Secrets

## Next Steps

1. ✅ Choose a workflow (simple or full)
2. ✅ Set up Nx Cloud (optional but recommended)
3. ✅ Configure deployment (if needed)
4. ✅ Test workflows by pushing code
5. ✅ Monitor and optimize based on results

## Support

- **Nx Documentation**: https://nx.dev
- **GitHub Actions**: https://docs.github.com/en/actions
- **Nx Cloud**: https://nx.app/docs/nx-cloud

