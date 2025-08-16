# How to Contribute

> _We scale Ethereum without sacrificing privacy. You can help._

Thank you for your interest in improving **intmax2-docs**, the zero-knowledge roll-up function service developed by the Internet Maximalism community. Whether you spot a typo, design a new feature, or help triage issues, your contribution makes the project stronger. This guide explains how to participate effectively and respectfully.

---

## Why read these guidelines?

Following the steps below shows respect for the maintainers’ time and helps us review your work quickly. In return, we will do our best to respond promptly, give constructive feedback, and merge high-quality changes.

---

## What kinds of contributions are welcome?

- **Code** — Rust/TypeScript/Go changes that improve functionality, performance, or security of the function services.
- **Documentation** — Tutorials, API references, FAQs, diagrams, or translations.
- **Testing & QA** — Bug reports, reproducible test cases, and adding automated tests.
- **Dev UX** — Build scripts, Dockerfiles, CI/CD, developer tools.
- **Community support** — Answering questions on Discord, writing blog posts, or recording demo videos.

---

## Contributions we are _not_ looking for

- **End-user support requests** — Please open a ticket at [intmaxhelp.zendesk.com](https://intmaxhelp.zendesk.com/hc/en-gb/requests/new) instead of the GitHub issue tracker.
- **Exchange listing questions / price talk** — Off-topic for this repository.
- **Security disclosures in public issues** — See the security section below.

---

## Ground rules

- Be respectful, inclusive, and patient — read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).
- Discuss large changes in an issue _before_ starting work.
- All code must pass format and test checks.
- Write tests for all new modules and functions.
- Keep PRs focused: one feature or bug-fix per pull request.
- Never commit secrets, private keys, or user data.

---

## Your first contribution

Newcomers are welcome! Look for issues labeled **`good first issue`** or **`help wanted`**:
[https://github.com/InternetMaximalism/intmax2-docs/issues?q=is%3Aopen+label%3A%22good+first+issue%22](https://github.com/InternetMaximalism/intmax2-docs/issues?q=is%3Aopen+label%3A%22good+first+issue%22)

If you’re unsure, ask in **#dev-general** on our [Discord](https://discord.gg/TGMctchPR6).

For a gentle introduction, consider improving docs or adding small tests.

---

## Getting started (Workflow)

1. **Fork** the repo: [https://github.com/InternetMaximalism/intmax2-docs](https://github.com/InternetMaximalism/intmax2-docs) and clone your fork.

2. **Create a branch**:

   ```bash
   git checkout -b feat/short-description
   ```

3. **Set up the environment**
   Copy `.env.example` files to `.env` and edit as needed:

   ```bash
   cp .env.example .env
   # Edit .env to match your local configuration
   ```

4. **Install dependencies**:

   ```bash
   npm install
   ```

5. **Run the format** to ensure your environment is healthy:

   ```bash
   npm run lint
   ```

6. **Commit** using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/):
   - `feat: add deposit-function handler`
   - `fix(api): handle zero-gas meta-tx edge-case`

7. **Push** and **open a Pull Request** against `main`.

8. Complete the PR checklist; a maintainer will review within **5 business days**.

---

### Obvious fixes

Typo or whitespace fixes that don’t change functionality can be submitted without opening an issue first.

---

## Bug reports

If something isn’t working:

1. Search existing issues first.
2. Open a **new issue** with the template and include:
   - Commit hash / Docker image tag
   - OS and architecture (e.g. Ubuntu 22.04 x86-64)
   - Steps to reproduce (commands, transaction hashes, etc.)
   - Expected vs. actual behavior
   - Logs / screenshots when possible

---

### Security vulnerabilities

Do **not** open a public issue. Email **[support@intmax.io](mailto:support@intmax.io)** with details and we will coordinate a responsible disclosure.

---

## Feature requests & improvements

Open an issue describing:

- **What problem** you are solving and who benefits
- **Proposed solution** (API sketch, UX flow, or pseudocode)
- **Alternatives** you considered

A maintainer will discuss scope and alignment with the project roadmap before anyone starts coding.

---

## Code review process

- At least **two approvals** from core maintainers are required.
- CI must be green before merging.
- The PR author (or a maintainer) should **squash-merge** once reviews pass.
- Inactive PRs with no activity for **30 days** may be closed — feel free to reopen when ready.

---

## Community & support

- **Discord**: [https://discord.gg/TGMctchPR6](https://discord.gg/TGMctchPR6) (`#dev-general`)
- **GitHub Discussions**: [https://github.com/InternetMaximalism/intmax2-docs/discussions](https://github.com/InternetMaximalism/intmax2-docs/discussions)
- **Support portal (private)**: [intmaxhelp.zendesk.com](https://intmaxhelp.zendesk.com/hc/en-gb/requests/new)

---

## Coding, commit, and label conventions

| Area         | Convention                                                                                |
| ------------ | ----------------------------------------------------------------------------------------- |
| TypeScript   | `npm run lint`                                                                            |
| Commits      | **Conventional Commits** (`feat:`, `fix:`, `chore:` …)                                    |
| Issue labels | `bug`, `enhancement`, `good first issue`, `help wanted`, `security`, `docs`, `discussion` |

---

### Thanks

intmax2-docs exists because of contributors like **you**. We appreciate your time and effort to make private, scalable blockchain infrastructure a reality.
