# VUNA Calculator

[![CI/CD](https://github.com/MamzaJibrin/VUNA-Calc-striped/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/MamzaJibrin/VUNA-Calc-striped/actions/workflows/ci-cd.yml)
[![PR Check](https://github.com/MamzaJibrin/VUNA-Calc-striped/actions/workflows/pr-check.yml/badge.svg)](https://github.com/MamzaJibrin/VUNA-Calc-striped/actions/workflows/pr-check.yml)

A web calculator built by set 2025/26 Software Engineering students.

## Pipeline

| Stage | Tool | Trigger |
|-------|------|---------|
| Lint | ESLint + Stylelint | Every push & PR |
| Security Audit | npm audit | Every push & PR |
| Test | QUnit + Playwright | Every push & PR |
| Docker Build | Docker BuildKit | Every push to main |
| FTP Deploy | SamKirkland/FTP-Deploy-Action | Every push to main |

## Development

```bash
npm install
npm run lint
npm test
```

Open `index.html` (landing page) or `calculator.html` (the calculator) in a browser, or run `npx serve .` to start a local server.

## Testing

Open `tests/index.html` in a browser, or run:

```bash
npm test
```
