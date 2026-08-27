# React + Vite Project Setup

Quick reference for spinning up a new React project with Vite, npm, and ESLint. In terminal, CD into the project folder then:

## 1. Create the project

**Preferred method** — creates the project, installs dependencies, and starts the dev server in one flow:

```bash
npx create-vite@latest
```

- "Project name:" → `.` to use the current folder (make sure you're already inside an empty folder you've named for the project)
- "Package name:" → defaults to the folder name, fine to accept
- "Select a framework:" → **React**
- "Select a variant:" → **JavaScript**
- "Which linter to use?" → **ESLint** (industry standard, matches most tutorials)
- "Install with npm and start now?" → **Yes** — this installs dependencies AND immediately launches the dev server in one shot, no separate `npm install`/`npm run dev` needed afterward

**Alternative method** — same end result, more explicit/manual steps, closer to what some tutorials show on screen:

```bash
npm create vite@latest . -- --template react
```

- Use `.` to create the project in the current folder (make sure you're already inside an empty folder you've named for the project).
- Leave off the `.` if you want Vite to create a new folder for you instead — it'll prompt you for a project name.
- "Ok to proceed?" → type `y`
- "Which linter to use?" → **ESLint**
- Requires running `npm install` and `npm run dev` yourself afterward (see Section 2 and 3 below).

## 2. Install dependencies

**NPM**

```bash
npm install
```

This reads `package.json` and downloads everything the project needs into a `node_modules` folder. Not needed if you used the preferred "Install with npm and start now? Yes" flow above — that already handled it.

**Tailwind.css**

> **Note:** Tailwind is already installed and configured in the `_React-Base` template — a fresh clone of that template does not need this step repeated. Only follow this if starting a project from scratch (not from `_React-Base`).

```bash
npm install tailwindcss @tailwindcss/vite
```
Current (v4) setup — no `tailwind.config.js`, no `postcss`, no `autoprefixer` needed:
1. Add the plugin to `vite.config.js`:
   ```javascript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     plugins: [
       react(),
       tailwindcss(),
     ],
   })
   ```
2. Add one import line to `src/index.css` (replacing whatever's currently at the top):
   ```css
   @import "tailwindcss";
   ```

Older tutorials (including some in the Learning Stack below) may show a different install process using `postcss`, `autoprefixer`, and `npx tailwindcss init -p` — that's the Tailwind v3 method and is no longer needed. If a tutorial's steps don't match what's here, check tailwindcss.com/docs/installation for the current process rather than following outdated on-screen steps.

**React Router**

```bash
npm i react-router-dom
```
Enables multi-page navigation in a single-page app — define routes/pages in one place (commonly `App.jsx`) using `createBrowserRouter` and `<Route>`, wrap layouts around groups of pages, and navigate without a full page reload.

**JSON Server**

```bash
npm i -D json-server
```
Creates a mock/fake REST API from a local JSON file, for practicing full CRUD (Create, Read, Update, Delete) during development. **Local development only — not for production/live apps.** Add a script to `package.json` to launch it on its own port, separate from the Vite dev server:
```json
"scripts": {
  "server": "json-server src/jobs.json --port 8000"
}
```
Run with `npm run server` in a **second terminal**, alongside `npm run dev` running in the first — both need to stay running at the same time for fetch calls to reach it.

**Interactive/UI Extras**

Small packages that add polish and user feedback — not core to a project, but useful drop-ins.

- **react-icons** — `npm i react-icons` — access to icon sets like Font Awesome and Material Icons as importable React components, instead of loading icon fonts manually.
- **react-spinners** — `npm i react-spinners` — loading spinner components, used while data is being fetched, before content renders. Import from the package's top level, not a deep subpath (see Troubleshooting below):
  ```javascript
  import { ClipLoader } from 'react-spinners';
  ```
- **react-toastify** — `npm i react-toastify` — toast/notification popups for user feedback (e.g. success/error messages).
- **lucide-react** — `npm i lucide-react` — general-purpose UI icon library (arrows, menus, checkmarks, etc.), an alternative to react-icons. Note: most brand/social logos (GitHub, LinkedIn, etc.) were removed from Lucide in v1 — use react-icons' `Fa` (Font Awesome) or `Si` (Simple Icons) sets for those instead.

**shadcn/ui & Radix UI**

> **What each one is:** Radix UI ships unstyled, fully accessible component primitives (dropdowns, dialogs, tooltips, etc.) — it handles behavior, keyboard navigation, and focus management, but no visual styling. shadcn/ui is a CLI that generates pre-built components using Radix primitives wired up with Tailwind CSS classes, and copies them directly into your project as editable source files — it is not an npm package you import from `node_modules`. Installing a shadcn component pulls in its underlying Radix primitive automatically; a separate Radix install is only needed when building a fully custom component without shadcn's default styling.

1. **Path alias setup** (required before running the CLI)

   Create `jsconfig.json` at the project root:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```

   Add the matching alias to `vite.config.js` (uses `import.meta.dirname`, not `__dirname` — see Troubleshooting below for why):
   ```javascript
   import path from 'path'
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import tailwindcss from '@tailwindcss/vite'

   export default defineConfig({
     plugins: [react(), tailwindcss()],
     resolve: {
       alias: {
         '@': path.resolve(import.meta.dirname, './src'),
       },
     },
   })
   ```

2. **Initialize shadcn/ui**
   ```bash
   npx shadcn@latest init
   ```
   - Prompts to configure `components.json`. Since this project has no `tsconfig.json`, the CLI treats it as a JavaScript project and generates `.jsx` component files instead of `.tsx`.
   - Asks for a style, base color, and whether to use CSS variables for theming — any choice here is fine and can be changed later.
   - Asks for an icon library — choose **lucide-react**, since it's already part of this stack (see Interactive/UI Extras above).

3. **Add components as needed**
   ```bash
   npx shadcn@latest add button
   npx shadcn@latest add dialog
   npx shadcn@latest add dropdown-menu
   ```
   - Each command drops a real, editable component file into `src/components/ui/` — not a package import. Open and edit these directly like any other component in the project.
   - Installing a component automatically installs its underlying Radix package as a dependency (e.g. `add dialog` installs `@radix-ui/react-dialog` behind the scenes) — no separate Radix install step needed for this path.

4. **Use a component**
   ```jsx
   import { Button } from "@/components/ui/button"

   function App() {
     return <Button variant="default">Click me</Button>
   }
   ```

**Using raw Radix without shadcn** — for a fully custom component block (styled entirely by hand, no shadcn defaults), install the specific Radix primitive package directly instead of going through the CLI:
```bash
npm i @radix-ui/react-dialog
```
Radix ships one package per primitive (`@radix-ui/react-tooltip`, `@radix-ui/react-dropdown-menu`, etc.) rather than one bundled package — install only what's actually used.

## 3. Start the dev server

```bash
npm run dev
```

- Opens a local server, usually at `http://localhost:5173/`
- Auto-refreshes the browser any time you save a file
- Press `Ctrl + C` in the terminal to stop it when you're done
- Not needed if you used the preferred "Install with npm and start now? Yes" flow in Section 1 — the server is already running at that point.

**Building for production**

```bash
npm run build
```
Compiles/bundles the whole project into a `dist` folder — the optimized, production-ready version of the app. This is the version that actually gets deployed, not the raw source files.

```bash
npm run preview
```
Serves that `dist` folder locally, so you can test the production build in a browser before actually deploying it anywhere. Run this after `npm run build`, once development is done and before shipping.

## 4. Project structure — what matters early on

```
project-folder/
├── _reference/           ← personal reference assets, kept together and out of the way, outside src/ so Vite never bundles it
│   ├── react-snippets.jsx  ← common React code patterns for reuse
│   ├── tailwind-snippets.md ← Tailwind class-to-CSS cheatsheet + recipes
│   └── _component-blocks/  ← fully built, ready-to-drop-in components (e.g. a responsive Tailwind nav), each with setup/dependency notes so it can be wired into a new project quickly
├── SETUP.md              ← this file — keep a copy at the root of each new project
├── index.html            ← the single HTML page the whole app lives inside
├── package.json          ← lists installed packages + npm scripts
├── jsconfig.json         ← path alias config ("@/*" → "./src/*"), required by shadcn/ui
├── components.json       ← shadcn/ui config — style, base color, aliases, icon library (created by `shadcn init`)
├── src/
│   ├── main.jsx          ← entry point, renders <App /> into the page
│   ├── App.jsx           ← main component, edit this first
│   ├── assets/           ← images imported and rendered in the UI (logos, hero images, project screenshots)
│   ├── components/
│   │   └── ui/            ← shadcn-generated components (button.jsx, dialog.jsx, etc.) — editable source files, not node_modules imports
│   └── lib/
│       └── utils.js       ← shadcn's `cn()` helper for merging Tailwind classes conditionally (auto-created by `shadcn init`)
├── public/
│   └── downloads/         ← files meant to be directly downloaded, not rendered (resume PDF, project source zips)
├── dist/                 ← production build output (from npm run build) — don't edit by hand, don't commit unless deploying from it directly
└── node_modules/         ← installed packages (don't touch, don't commit to git)
```

**`src/assets/` vs `public/` — which one to use:**
- **`src/assets/`** — for anything **imported into a component and rendered as part of the UI** (an `<img>` tag, a logo used as an SVG component, project screenshots shown in cards). Vite processes, optimizes, and hashes these — they have to be brought in with `import`.
- **`public/`** — for files that need a **fixed, direct URL**, with zero processing and often no import at all. Use this for a resume PDF, project source `.zip` downloads, a favicon — anything linked to or downloaded, never displayed as an image in the page itself. Reference these as a plain string path (e.g. `"/downloads/resume.pdf"`), paired with the `download` attribute on an `<a>` tag:
  ```jsx
  <a href="/downloads/resume.pdf" download="Adrian-Velazquez-Resume.pdf">Download CV</a>
  ```

## 5. Git setup for a new project

```bash
git init
git add .
git commit -m "initial commit"
```

Then connect to GitHub the same way as the portfolio repo — create the repo on GitHub first, then:

```bash
git remote add origin https://github.com/YOUR-ACCOUNT/repo-name.git
git branch -M main
git push -u origin main
```

## 6. Editor - Visual Studio Code: Dependencies

**Core**
- ESLint — plugs the linter into VS Code, shows warnings directly in the editor
- Prettier – Code formatter — auto-formats code on save

**React-specific**
- ES7+ React/Redux/React-Native snippets — type `rafce` + tab to auto-generate a component
- Simple React Snippets — lighter alternative to the one above

**Tailwind**
- Tailwind CSS IntelliSense — autocompletes class names, shows a preview of what each class does

**Quality of life**
- Auto Rename Tag — renaming an opening tag auto-renames its matching closing tag
- Path Intellisense — autocompletes file paths inside import statements
- Console Ninja — shows console.log output and runtime values directly inline in the editor, next to the line that produced them, instead of only in the browser/terminal console
- Multiple Case Preserve — preserves variable naming case (camelCase, snake_case, etc.) when using find-and-replace or rename operations

**Browser extension (not VS Code, but same setup ritual)**
- React Developer Tools — already listed under Resources below

## 7. Troubleshooting

**"GET http://localhost:8000/jobs net::ERR_CONNECTION_REFUSED" / "Failed to fetch"**
- Cause: forgot to start json-server. It runs as a separate process from the Vite dev server.
- Fix: open a second terminal tab/window and run `npm run server` while `npm run dev` keeps running in the first. Both need to stay running at the same time.

**"Error: Element type is invalid: expected a string...but got: object. Check the render method of `Spinner`"** (react-spinners)
- Cause: importing from a deep subpath (`import ClipLoader from 'react-spinners/ClipLoader'`) can fail to bundle correctly in Vite, even though it looks syntactically correct.
- Fix: import the named export from the package's top level instead: `import { ClipLoader } from 'react-spinners'`.

**json-server pagination silently returns all records instead of limiting them**
- Cause: the `_limit` query param is deprecated in json-server v1 and gets silently ignored — no error, it just returns everything.
- Fix: use `_page=1&_per_page=3` together instead of `_limit=3`.
- Also note: adding pagination params changes the response shape. Instead of a plain array, you get back a wrapped object: `{ first, prev, next, last, pages, items, data: [...] }`. Extract `.data` from the response when pagination params are used — non-paginated requests still return a plain array as before.

**"npm WARN npm does not support Node.js..." followed by "npm ERR! cb.apply is not a function" on any install command**
- Cause: an old, broken global npm install (leftover from a legacy permissions workaround, living outside the normal Node install path) silently overrides the correct npm that should load automatically with the current Node version. This is a machine-level PATH/environment issue, not a project or package problem — it can resurface in any future project on the same machine if not fixed at the system level.
- Fix: install `nvm` (Node Version Manager) fresh, then run:
  ```bash
  nvm install --lts
  nvm use --lts
  nvm alias default node
  ```
  The last command matters most — a fresh terminal won't auto-select a Node version otherwise, letting the old broken npm win by default every time.
  If nvm warns about an incompatible `.npmrc` prefix/globalconfig setting left over from the old setup, also run:
  ```bash
  nvm use --delete-prefix [version] --silent
  ```

**"npm error code EALLOWSCRIPTS" / "--allow-scripts is not allowed in project-scoped installs"** on `npx create-vite` or other fresh installs
- Cause: a global `~/.npmrc` file has a leftover `allow-scripts=@anthropic-ai/claude-code` line (added automatically when Claude Code was installed). A known npm 11.x bug incorrectly forwards this global setting into fresh project-scoped installs, causing a false failure — this has nothing to do with the actual project being created.
- Fix:
  ```bash
  npm config delete allow-scripts
  ```
  Then retry the install. This is a one-time, machine-level fix — it won't need repeating unless something re-adds the line later.

**"npm warn allow-scripts 1 package has install scripts not yet covered by allowScripts" (e.g. fsevents@2.3.3)**
- This is routine, not an error. `fsevents` is a small Mac-only helper package (used by Vite's dev server to detect file changes efficiently via a macOS-native file-watching feature) that has an install script. Recent npm versions pause and require explicit approval before running any package's install script, as a security precaution.
- Fix: run `npm approve-scripts fsevents@2.3.3` (or whichever package is flagged) — safe to approve for well-known, widely-used packages like fsevents.
- Note: fsevents does nothing on Windows/Linux, Mac-only.

**"__dirname is not defined in ES module scope"** in `vite.config.js`
- Cause: Vite config files run as ES Modules, and `__dirname` is a CommonJS-only global — it doesn't exist in ESM, even though a lot of older tutorials and blog posts still show it.
- Fix: use `import.meta.dirname` instead — built into modern Node, no import or polyfill required, drop-in replacement for `__dirname`. This is what's used in the shadcn/ui path alias setup above.

**shadcn CLI still asks about TypeScript, or errors about a missing `tsconfig.json`**
- Cause: some CLI versions expect a config file to exist before they can tell a JavaScript project from a TypeScript one. A missing `jsconfig.json` can trigger this even in an all-JavaScript project.
- Fix: make sure `jsconfig.json` exists at the project root (see shadcn/ui & Radix UI, Step 1 above) before running `npx shadcn@latest init`. If it still prompts to choose, answer **no** to TypeScript — the CLI will generate `.jsx` files and set `"tsx": false` in `components.json` automatically.

## Notes

**React**

- React is a JavaScript UI library / framework for building user interfaces
- Website UIs are looked at in terms of components
- React allows you to build dynamic and interactive websites and user interfaces (UI's)
- React uses components that can be used to build elements on a webpage
- Componenets can get props (arguments / attributes) passed in and can hold their own state
- Components can be classes or functions (functional components are the standard)
- Components output .jsx syntax which is an HTML-like syntax withing javascript
- Reserved words in .js are written in jsx syntax when coding in .jsx (class / className)
- State represents the data that a component manages internally
- State is typically used for data thats expected to change
- This can be: input data, fetched data, UI-related data (like if a modal is open / closed)
- There is a Global State, which relates to the app as a whole and not a single component (like data you fetch from a database)
- To define state in a functional component, you can use a hook
- React hooks are functions that enable functional components to use state and other features without writing a class for them
- React has a compiler that will convert your react code into regular javascript
- The compiler optimizes react code automatically so there no longer a need for memoization
- React Applications:
    - Single Page App (SPA): Load a single HTML file and javascript loads the entire UI including routes
    - Server-Side Rendered (SSR): Server sends fully rendered page to client where you can fetch data and load it as well (page renders on the server)
    - Static Site Generation (SSG): A meta-framework (like Gatsby) generates static HTML files at build time

**Vite**

- Vite is a front-end toolkit that can be used for all kinds of JS projects including React
- It is built on top of ESBuild, which is a JS bundler
- Most popular option to build a React SPA
- Offers fast development server with hot-reload

**shadcn/ui & Radix UI**

- Radix UI provides unstyled, accessible component primitives — the behavior/logic layer only, no visual styling
- shadcn/ui is not an npm package — it's a CLI that copies pre-built, Radix-based components directly into the project as editable source files
- Because components are copied in (not imported from `node_modules`), you fully own and can modify the code — there's no dependency to "upgrade," just re-run the add command or hand-edit the file
- Every shadcn component installs its own underlying Radix primitive package automatically as a dependency
- In a JavaScript project (no `tsconfig.json` present), shadcn generates components as `.jsx` instead of `.tsx`
- shadcn's utility function `cn()` (in `src/lib/utils.js`) merges Tailwind classes conditionally — handles cases where two classes would conflict (e.g. combining a default style with an override passed in as a prop)

## Resources List

- Shadcn/ui: https://ui.shadcn.com/
- Shadcn/ui — JavaScript (no TypeScript) guide: https://ui.shadcn.com/docs/javascript
- Shadcn/ui — Vite installation guide: https://ui.shadcn.com/docs/installation/vite
- Radix UI: https://www.radix-ui.com/
- Node.js: https://nodejs.org/en/download
- NPM: https://www.npmjs.com/
- React: https://react.dev/
- Vite: https://vite.dev/
- Tailwind: https://tailwindcss.com/ 
- Codepen: https://codepen.io/trending
- JSON Placeholder: https://jsonplaceholder.typicode.com/
- React Developer Tools (Browser Extension): https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en-US&utm_source=ext_sidebar
- React Icons: https://react-icons.github.io/react-icons/
- React Router: https://reactrouter.com/
- JSON Server: https://github.com/typicode/json-server
- react-spinners: https://www.davidhu.io/react-spinners/
- react-toastify: https://fkhadra.github.io/react-toastify/
- nvm (Node Version Manager): https://github.com/nvm-sh/nvm
- React Snippets File: _reference/react-snippets.jsx
- Tailwind Snippets File: _reference/tailwind-snippets.md

## Learning Stack

**Javascript**

1. All The JavaScript You Need To Know For React (28min): https://www.youtube.com/watch?v=m55PTVUrlnA&list=WL&index=101 - Complete
2. All The JavaScript You Need BEFORE React (6min 30sec): https://www.youtube.com/watch?v=bCkfU_wHPcY - Complete

**React**

1. React Tutorial For Beginners (2hours 13min): https://www.youtube.com/watch?v=xxRAA0v2lvM&list=WL&index=98&t=423s - Complete
2. React Crash Course (3hours 4min): https://www.youtube.com/watch?v=LDB4uaJ87e0 - Complete
3. React Full Course for free (4hours 43min): https://www.youtube.com/watch?v=CgkZ7MvWUAA
4. ALL React Hooks Explained in 12 Minutes (12min): https://www.youtube.com/watch?v=LOH1l-MP_9k&list=WL&index=110 - Complete
5. ReactJS Beginner Course 2025 | Become a React Pro in 1.5 Hours (1hour 20min): https://www.youtube.com/watch?v=3OqiKTyH4r0&list=WL&index=103 - Complete
6. Build 3 React Projects in 4 Hours | ReactJS Course For Beginners (4hours 13min): https://www.youtube.com/watch?v=r47C9c4qCqE&list=WL&index=111 - Pedro
7. Stop Copying Tutorials — Build a Real React App With Me (6hours): https://www.youtube.com/watch?v=M-iV9R3kLNA
8. How To Debug React Apps Like A Senior Developer (21min): https://www.youtube.com/watch?v=l8knG0BPr-o
9. Every React 19 Feature Explained in 8 Minutes (8min): https://www.youtube.com/watch?v=2NPIYnY3ilo - Complete
10. React Course for Beginners w/ Tailwind CSS [2025] (4hours 42min): https://www.youtube.com/watch?v=IJ85kCdqWao
11. ReactJS Full Course 2026 | Build and Deploy a Beginner Ecommerce Website using React (3hours 30min): https://www.youtube.com/watch?v=Wt3isV2irrA&t=5148s - Pedro
12. Build and Deploy a Fully Responsive Modern Website using ReactJS and Tailwind CSS (2hours 35min): https://www.youtube.com/watch?v=yS7B1W2SwaU - Continue
13. Build and Deploy a Modern Personal Portfolio with ReactJS and TailwindCSS (2hours 50min): https://www.youtube.com/watch?v=cIYdiRDFWQw&t=5252s - Complete
14. The Best React Helper Tool - React Dev Tools Tutorial (23min): https://www.youtube.com/watch?v=QbSXXXEGA70
15. React Crash Course (2025) – Beginner Friendly 🔥 (1hour 13min): https://www.youtube.com/watch?v=Vr7OySr-Kx8

**Tailwind**

1. Tailwind CSS v4 Full Course 2026 | Master Tailwind in One Hour (54min): https://www.youtube.com/watch?v=6biMWgD6_JY&list=WL&index=106&t=24s - Complete
2. Tailwind CSS in React Crash Course 2026 | Become a React Tailwind Pro in 1 Hour (54min): https://www.youtube.com/watch?v=bnfhmr1v028&t=1652s - Complete

**Animation (Motion / GSAP)**

1. Master Web Animations in 2 Hours | Build an Awwwards-Level Website (2hours 28min): https://www.youtube.com/watch?v=AW1yfBKRMKc&t=203s
2. React Animation Course with Motion - Become an Animations Pro in 1 Hour (1hour 4min): https://www.youtube.com/watch?v=9-fO_2xTpgY&list=WL&index=109
3. [REACT x GSAP Tutorial] Master Animations in React with the NEW useGSAP Hook (7min): https://www.youtube.com/watch?v=v2IIPTEr5m8
4. EASY React Animation with useGSAP() (13min): https://www.youtube.com/watch?v=l0aI8Ecumy8&list=WL&index=117
5. Build and Deploy an Awwwards Winning Website | React.js, Tailwind CSS, GSAP (2hours 40min): https://www.youtube.com/watch?v=zA9r5zTllx4&list=WL&index=115
6. React Portfolio Project: GSAP Scroll Animation & Modern Design (React & Tailwind CSS) (2hours): https://www.youtube.com/watch?v=It7XLIh_iw4&t=466s

**UI Libraries**

1. Shadcn UI? in 2026? (18min): https://www.youtube.com/watch?v=aF8j-RPBO4c
2. You're Using Shadcn/ui the WRONG Way (Here's How to Fix It) (16min): https://www.youtube.com/watch?v=jHzdo1Bm9Lk
3. Ultimate ShadCN Tutorial 2025 | React Next.js ShadCN Dashboard Project (2hours 42min): https://www.youtube.com/watch?v=SjsQdfvxjL8&t=58s
4. How To Build UI Component Library in React | Learn Shadcn/ui in 20 Minutes (20min): https://www.youtube.com/watch?v=H6GBwdGiOLM
5. How to Set Up ShadCN in React + Vite (Full Step-by-Step Guide) 🚀 (13min): https://www.youtube.com/watch?v=wQWO0-VbG4w