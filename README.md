# Prompt Builder UI

A React-based web application designed to help users build and compose prompts by incorporating different types of context from your codebase. The tool specializes in loading and caching different types of context (directory trees, custom instructions, and relevant files) and allows you to compose prompts using specialized tags.

## Features

- **Directory Context**: Loads directory structures and generates file trees for providing codebase context
- **Custom Instructions**: Loads and caches specific files designated for custom instructions
- **Relevant Files**: Loads and caches various files marked as relevant for additional context
- **Smart Caching**: Maintains cached text from all three sources (directory trees, custom instructions, and relevant files)
- **Tag-based Composition**: Compose prompts using specialized tags that automatically inject the corresponding cached content
- **Token Counter**: Calculates token count based on the final composed prompt with all tags expanded

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
