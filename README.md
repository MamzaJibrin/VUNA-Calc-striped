# VUNA Calculator

[![CI](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/ci.yml)
[![Deploy](https://github.com/<OWNER>/<REPO>/actions/workflows/deploy.yml/badge.svg)](https://github.com/<OWNER>/<REPO>/actions/workflows/deploy.yml)

A web calculator built by set 2025/26 Software Engineering students.

## Pipeline

| Stage | Tool | Trigger |
|-------|------|---------|
| Lint | ESLint + Stylelint | Every push & PR |
| Test | QUnit + Playwright | Every push & PR |
| Deploy | GitHub Pages | Push to `main` |

## Development

```bash
npm install
npm run lint
npm test
```

Open `index.html` in a browser or run `npx serve .` to start a local server.

## Testing

Open `tests/index.html` in a browser, or run:

```bash
npm test
```

> Replace `<OWNER>/<REPO>` in badge URLs with your GitHub repository path.
