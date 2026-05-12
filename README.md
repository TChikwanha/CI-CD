# GitHub CI/CD Starter Project

This project is a small, dependency-free web app that demonstrates a practical GitHub workflow:

- Continuous Integration runs linting, tests, and a production build on pushes and pull requests.
- Continuous Deployment publishes the built app to GitHub Pages when changes land on `main`.
- The app itself shows the stages of a CI/CD pipeline so the repository doubles as a learning artifact.

## Project Structure

```text
.
├── .github/workflows/ci-cd.yml
├── scripts/
│   ├── build.mjs
│   ├── lint.mjs
│   └── serve.mjs
├── src/
│   ├── app.js
│   ├── index.html
│   └── styles.css
├── tests/app.test.js
├── package.json
└── README.md
```

## Run Locally

```bash
npm install
npm run ci
npm start
```

Then open `http://localhost:4173`.

## GitHub Setup

1. Create a new GitHub repository.
2. Push this project to the repository.
3. In GitHub, go to **Settings > Pages**.
4. Set **Source** to **GitHub Actions**.
5. Push to `main` to run the full CI/CD workflow.

## Workflow

The GitHub Actions workflow does three things:

1. Installs Node.js.
2. Runs the quality gate with `npm run ci`.
3. Deploys the `dist/` build artifact to GitHub Pages for pushes to `main`.

Pull requests only run the quality gate. Deployment is intentionally limited to `main`.
