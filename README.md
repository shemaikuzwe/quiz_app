# Quiz App

A timed trivia quiz built with React 19, Vite, Tailwind CSS v4 and [shadcn/ui](https://ui.shadcn.com). Questions come from [The Trivia API](https://the-trivia-api.com).

## Requirements

- Node.js 24 (set via `NODE_VERSION` in `netlify.toml` and `engines` in `package.json`)

## Scripts

```bash
npm install
npm run dev      # start the dev server
npm run lint     # run ESLint
npm run build    # production build into dist/
```

## Adding UI components

shadcn/ui is configured in `components.json`. Add more components with:

```bash
npx shadcn@latest add <component>
```
