# Backend API

## Code Quality Tools

This project uses several tools to maintain code quality and consistency:

### ESLint

ESLint is used to enforce code style and quality standards.

- Run `npm run lint` to check for linting issues
- Run `npm run lint:fix` to automatically fix linting issues where possible

### Prettier

Prettier is used for consistent code formatting.

- Run `npm run format` to format all code according to the project's style guidelines

### Husky & Git Hooks

Husky is used to set up Git hooks that run before commits and ensure code quality.

- **pre-commit**: Runs lint-staged to check and fix issues in staged files
- **commit-msg**: Validates commit messages based on conventional commit format

### Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <description>
```

Common types include:

- feat: A new feature
- fix: A bug fix
- docs: Documentation changes
- style: Changes that do not affect code behavior (formatting, etc.)
- refactor: Code changes that neither fix a bug nor add a feature
- test: Adding or updating tests
- chore: Changes to the build process, dependencies, etc.

## Getting Started

1. Install dependencies:

```
npm install
```

2. Start the development server:

```
npm run dev
```
