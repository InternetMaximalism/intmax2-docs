# INTMAX2 Docs

## Installation

Install project dependencies using npm:

```bash
npm install
```

> This command installs all required packages listed in `package.json`.

## Local Development

Start the local development server:

```bash
npm run start
```

> This will launch a development server and automatically open the documentation site in your default browser.
> Any changes you make to the source files will be reflected in real time — no need to manually restart the server.

## Build

Generate the production-ready static site:

```bash
npm run build
```

> This command builds the documentation site into the `build/` directory.
> The output can be deployed to any static hosting service, such as Vercel, Netlify, GitHub Pages, or your own server.

## Deployment

When changes are merged to the `main` branch, the site is automatically deployed to:

**https://docs.network.intmax.io/**

## Code Quality & Linting

Run ESLint to check code quality and style:

```bash
# Run ESLint to check code quality and style (no auto-fix)
npm run lint

# Run ESLint and automatically fix fixable issues
npm run lint:fix

# Run code formatter to unify style
npm run format
```
