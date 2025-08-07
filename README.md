# INTMAX2 Documentation Guide

## Installation

Install project dependencies using npm:

```bash
npm install
```

> This command installs all required packages listed in `package.json`.

---

## Local Development

Start the local development server:

```bash
npm run start
```

> This will launch a development server and automatically open the documentation site in your default browser.
> Any changes you make to the source files will be reflected in real time — no need to manually restart the server.

---

## Build

Generate the production-ready static site:

```bash
npm run build
```

> This command builds the documentation site into the `build/` directory.
> The output can be deployed to any static hosting service, such as Vercel, Netlify, GitHub Pages, or your own server.
