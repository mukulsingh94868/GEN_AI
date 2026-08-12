# GEN_AI

A MERN + Vite starter focused on generative AI features and interview workflows.

## Summary

This repository contains a frontend application built with Vite and React that demonstrates authentication, interview features, and a simple structure for adding generative-AI integrations.

## Features

- Authentication (login / register) with error toasts on invalid credentials
- AI interview report generation (job description + resume / self description)
- Interview strategy pages with match scoring and recent report history
- Live AI mock interviews (voice-driven) with per-answer evaluation
- **Mock interview history** — view all past mock interview sessions as cards, and open any session to review the full AI report (overall/category scores, readiness, strengths & weaknesses, recommendations) plus a question-by-question answer review
- Organized feature folders for easy extension

## Tech stack

- Frontend: React + Vite
- Styling: SCSS
- Deployment: Vercel (config included)

## Project structure

- `src/` — application source
  - `features/auth/` — auth pages, components, hooks, services
  - `features/interview/` — interview pages, services, styles
  - `features/mock/` — mock interview setup, live session, report & history pages

### Key routes

- `/` — Home (interview strategy generation)
- `/login`, `/register` — Authentication
- `/mock-interview` — Configure and start a new mock interview
- `/mock-interview/:mockInterviewId` — Live mock interview session / report
- `/mock-interviews` — All mock interview sessions as cards
- `/mock-interviews/:mockInterviewId` — Full mock interview report detail

Top-level files: `package.json`, `vite.config.js`, `vercel.json`.

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

## Contributing

Feel free to open issues or pull requests. Add meaningful commit messages and keep changes focused.

## License

Add a license file if you intend to make this project public.

## Contact

Maintainer: see repository owner.

# GEN_AI
