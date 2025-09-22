---
sidebar_position: 6
description: Guide for developers to generate ideas, plan, and build projects using AI and the INTMAX network. Includes prompts for idea generation, validation, planning, market analysis, presentation preparation, and feedback.
---

# Vibe Coding for General Prompt

## Welcome Message

Welcome to VibeCoding for INTMAX Client SDK! 🎉

This guide helps you **turn your ideas into reality** by combining **AI** and the **INTMAX Network**. It’s designed to help you quickly generate ideas, validate them, and build a prototype or full application. Instead of getting stuck on setup or planning, you’ll be able to focus on **building and iterating fast**.

By following this guide, you’ll be able to:

- Generate and refine project ideas
- Plan your development process
- Create a minimal working prototype
- Prepare clear presentations and demos
- Receive structured feedback for improvement

## Flow Overview

After following this flow, you can move on to the **VibeCoding for Coding Prompt**.

[Vibe Coding for Coding Prompt](./vibe-coding-for-coding-prompt.md)

This will help you quickly scaffold a **Starter Template** (e.g., Vite + TypeScript, Next.js, or Node.js) so you can focus on **actual development**, not setup work.

> **Guidance:**
>
> - Check the provided Starter Prompt.
> - Generate a minimal working dApp template using `intmax2-client-sdk`.
> - Start coding right away and iterate.

```
Documentation
|
v
Welcome Message
|
v
Common / Useful Prompts
|
├── Expansion Prompt (Idea Generation)
|         |
|         v
|    Idea Validation Prompt
|
├── Planning Prompt
|
├── Market & Use Case Prompt
|
├── Presentation Prep Prompt
|
v
Feedback Prompt
```

## Common / Useful Prompts

### **Expansion Prompt (Idea Generation)**

```
You are an expert blockchain developer and product strategist.

1. Explain the key features and advantages of the INTMAX Network in clear, beginner-friendly language.

   * Use the official documentation ([https://docs.network.intmax.io/](https://docs.network.intmax.io/), [https://docs.network.intmax.io/developers-hub](https://docs.network.intmax.io/developers-hub), [https://intmax.io/](https://intmax.io/)) as reference sources.
   * Cover these aspects:

     * Stateless Layer-2 architecture (zk-Rollup + Plasma hybrid)
     * Ultra-low on-chain data usage (\~5 bytes per transaction)
     * Scalability and near-instant finality
     * Built-in privacy (zero-knowledge proofs, privacy mining, anonymity guarantees)
     * Client-side storage and wallet interoperability (Client SDK, Wallet SDK)
     * Privacy mining incentive mechanism with ITX tokens
2. Suggest 5 types of applications or dApps that would be a good fit to build on INTMAX Network.

   * Prioritize apps that highlight its unique strengths like scalability, privacy, micro/bulk transfers, and cross-chain UX.
   * For each idea:

     * Describe what the app does
     * Explain why INTMAX is especially well-suited for it
     * Identify the type of users who would benefit the most

Make the response structured, practical, and inspiring so developers can quickly understand and pick an idea to build.
```

---

### **Idea Validation Prompt**

```
Here is my project idea: \[describe your idea briefly].

Please evaluate:

1. Technical feasibility.
2. Uniqueness compared to similar existing products.
3. Potential impact and user value.
4. Simple improvements to make the idea stronger.
```

---

### **Planning Prompt**

```
I want to plan the development process for my project.

Please create a step-by-step plan with milestones, including:

* Initial setup and environment configuration
* Core feature development
* Testing and debugging
* Final polishing and documentation
```

---

### **Market & Use Case Prompt**

```
I want to understand possible real-world applications of my project idea.
Describe 3 concrete use cases for: \[your project idea].

For each use case:

* Who would benefit (target users)
* Why this problem matters
* How INTMAX + AI makes it better
```

---

### **Presentation Prep Prompt**

```
I need to prepare a short presentation to introduce my project.

Please draft a presentation outline with this flow:

1. Problem (why this matters)
2. Solution (our AI + INTMAX approach)
3. Demo (what we will show)
4. Future potential (what comes next)

Keep it simple, clear, and focused on the core message.
```

---

### **Feedback Prompt**

```
Imagine you are a mentor or reviewer.
Here is my project: \[describe idea].

Please give feedback from the perspective of:

* Innovation
* Practicality
* User experience
* Future potential
```

---

## References

- **INTMAX Official Docs:** [https://docs.network.intmax.io/](https://docs.network.intmax.io/)
- **Developers Hub:** [https://docs.network.intmax.io/developers-hub](https://docs.network.intmax.io/developers-hub)
- **Website:** [https://intmax.io/](https://intmax.io/)
