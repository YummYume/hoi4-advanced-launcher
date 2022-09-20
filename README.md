# HOI4 Advanced Launcher
An advanced launcher for HOI4.

# Current progress
## Done
- Multi language support
- Support all OS (thanks to Electron)
- Working launcher with game parameters
- Logs

## In progress
- Launcher & game settings

## Todo
- Mod management
- Mod conflicts detection

# Requirements
- [Nodejs](https://nodejs.org/en/) >= 16.0 (16.14.0 recommended)
- [yarn](https://yarnpkg.com) >= 1.2 (1.22.15 recommended)

# How to run in dev
1. Run `yarn translations` to parse the `.yaml` translations
2. Run `yarn start` to start the app

# Commands
- `yarn start` : starts `yarn dev` and `yarn electron` with `concurrently`, which allows hot reload to work for anything browser related
- `yarn dev` : starts the vite server
- `yarn electron` : starts the electron app
- `yarn build` : builds the app
- `yarn dist` : runs `yarn translations`, then builds the app with `yarn build` and then builds the electron app using the `renderer` folder
- `yarn translations` : parses the `.yaml` translations in the `src/translation_parser/translations` folder to `.json` translations in the `src/renderer/src/translations` folder, can also be used with arguments to only parse certain files (example : `yarn translations en fr` will only parse `en.yaml` and `fr.yaml` if they exist)
- `yarn check` : check files using the `.tsconfig.json` file

# Good to know
- 100% open source and free to use. Anyone can contribute by making a pull request.
- This project uses [Electron](https://www.electronjs.org) to manage the app and [❤️Svelte❤️](https://svelte.dev) + [Vite](https://vitejs.dev) + [Typescript](https://www.typescriptlang.org) to manage the client side.
- The formater used for js is [prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) (using the `.prettierrc` config file).
- Typescript is enabled everywhere except in `.js` files (only `.ts`).
- Translations are written in `.yaml` (for a better dev experience) and then parsed into `.json` files used by the [i18n Svelte module](https://github.com/kaisermann/svelte-i18n) using the `yarn translations` command.
- As suggested by the [i18n Svelte module](https://github.com/kaisermann/svelte-i18n), installing [i18n-ally](https://github.com/lokalise/i18n-ally) for your IDE is highly recommended.
- Once built, the project is nothing more than html, css and js, all bundled and managed by [Electron](https://www.electronjs.org), which is why all dependencies can be installed as dev only.
- The UI library used is [Svelte Material UI](https://sveltematerialui.com). Css is written directly in modules most of the time, except for a few global configs in the `global.css` file. Try not to use SASS for this project if possible (would be overkill).
- When you want to add a new [Svelte Material UI](https://sveltematerialui.com) component, make sure to only install the said component (and not the whole library).
- Notifications are managed by [Svelte Toast](https://github.com/zerodevx/svelte-toast) and dialogs by [Svelte Dialogs](https://github.com/bibizio/svelte-dialogs). Do not use Material UI for those.
- When adding a new dependency, always add it as a dev dependency (unless used by `index.js` or `preload.js`) and ensure the library is actively **maintained** and is **needed** (we do not want to use unnecessary libraries). Other than that, every additional library is welcomed.
- This project is not using Docker on purpose. It generally offers a poor developer experience with Electron and is not required because of the so few requirements.
