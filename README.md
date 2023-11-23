# Meta-DAO Frontend

![License MIT](https://img.shields.io/badge/License-MIT-blue.svg)

The most popular frontend for the Meta-DAO. 

## npm scripts

### Localnet setup

1. `git clone https://github.com/metaDAOproject/meta-dao`
2. `cd meta-dao`
3. `yarn`
4. `anchor localnet`

See Meta-DAO's repo for more details.

### Build and dev scripts

- `dev` – start dev server
- `build` – bundle application for production
- `analyze` – analyzes application bundle with [@next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

### Testing scripts

- `typecheck` – checks TypeScript types
- `lint` – runs ESLint
- `prettier:check` – checks files with Prettier
- `jest` – runs jest tests
- `jest:watch` – starts jest watch
- `test` – runs `jest`, `prettier:check`, `lint` and `typecheck` scripts

### Other scripts

- `storybook` – starts storybook dev server
- `storybook:build` – build production storybook bundle to `storybook-static`
- `prettier:write` – formats all files with Prettier
