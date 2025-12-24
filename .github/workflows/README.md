# CI/CD Workflows

This directory contains GitHub Actions workflows for continuous integration and deployment.

## Workflows

### 1. `ci.yml` - Main CI Pipeline
Runs on pushes and PRs to `main` and `develop` branches:
- **Linting**: Runs ESLint on affected projects
- **Testing**: Runs unit tests with code coverage
- **Building**: Builds all affected projects in production mode
- **E2E Tests**: Runs end-to-end tests after successful builds

### 2. `pr.yml` - Pull Request Checks
Runs on all pull requests:
- **Affected Projects**: Shows which projects are affected by changes
- **Lint**: Lints affected projects
- **Test**: Tests affected projects
- **Build**: Builds affected projects

### 3. `cd.yml` - Continuous Deployment
Runs on pushes to `main` branch and version tags (`v*`):
- **Build**: Builds frontend and backend applications
- **Artifacts**: Uploads build artifacts for deployment
- **Deploy**: Ready for deployment steps (configure based on your hosting platform)

## Setup

### Nx Cloud (Optional but Recommended)

1. Sign up at [nx.app](https://nx.app)
2. Get your access token from Nx Cloud dashboard
3. Add it as a GitHub secret:
   - Go to your repository → Settings → Secrets and variables → Actions
   - Add a new secret: `NX_CLOUD_ACCESS_TOKEN`
   - Paste your Nx Cloud access token

### Required Secrets

- `NX_CLOUD_ACCESS_TOKEN` (optional): For Nx Cloud caching and distributed task execution

### Deployment Configuration

To enable deployment, uncomment and configure the deployment steps in `cd.yml` based on your hosting platform:

#### Frontend Deployment Examples:
- **Vercel**: Use `vercel-action`
- **Netlify**: Use `netlify-cli` or `netlify-action`
- **AWS S3/CloudFront**: Use `aws-cli` or `aws-actions`

#### Backend Deployment Examples:
- **Railway**: Use `railway-cli`
- **Render**: Use `render-cli`
- **Fly.io**: Use `flyctl`
- **Docker**: Build and push Docker images

## Workflow Features

- ✅ **Nx Affected**: Only runs on changed projects
- ✅ **Parallel Execution**: Runs tasks in parallel for faster CI
- ✅ **Caching**: Uses Nx Cloud and npm caching
- ✅ **Code Coverage**: Collects test coverage
- ✅ **Artifact Storage**: Stores build artifacts for deployment
- ✅ **Matrix Strategy**: Can be extended for multiple Node versions

## Customization

### Adding More Jobs

You can add additional jobs to any workflow:

```yaml
  custom-job:
    name: Custom Job
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run custom command
        run: npx nx run-many --target=custom-target --all
```

### Environment Variables

Add environment-specific variables:

```yaml
env:
  CUSTOM_VAR: ${{ secrets.CUSTOM_SECRET }}
```

### Matrix Builds

Test against multiple Node versions:

```yaml
strategy:
  matrix:
    node-version: [18, 20, 22]
```

