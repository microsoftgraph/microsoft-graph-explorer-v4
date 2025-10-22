# Microsoft Graph Explorer V4

[![Build Status](https://dev.azure.com/japhethobalak/japhethobalak/_apis/build/status/microsoftgraph.microsoft-graph-explorer-v2?branchName=dev)](https://dev.azure.com/japhethobalak/japhethobalak/_build/latest?definitionId=4&branchName=dev)

The [Microsoft Graph Explorer V4](https://developer.microsoft.com/graph/graph-explorer) lets developers quickly navigate and test API endpoints.

The Graph Explorer is written in [TypeScript](https://www.typescriptlang.org/) and powered by:

- [React](https://reactjs.org/)
- [Office Fabric](https://dev.office.com/fabric)

## Running the explorer locally

Microsoft Graph Explorer is built and developed using node v18.

- `npm install` to install project dependencies. `npm` is installed by default with [Node.js](https://nodejs.org/). If you have issues with packages, try using Node version 18.20.0 locally when you try to run.
- `npm run build` to build the project.
- `npm start` starts the TypeScript compiler in watch mode and the local server. It should open your browser automatically with the Graph Explorer at [http://localhost:3000/](http://localhost:3000).



### Enabling authentication with your own credentials

- Sign in to your Microsoft account (or Create one) at the [Microsoft Azure Portal](https://ms.portal.azure.com/).
- Find the Azure service named App registrations. If you haven't used this service before, you might need to search for it in the search bar.
- In the App registrations page, click `+ New registration`. You will be redirected to a form in the Microsoft Azure portal where you Register an application. Fill out the form and set the Redirect URI to a `Single-page application (SPA)` with `http://localhost:3000`. You can also set it from authentication tab in the app you have just created.
- Create a `.env` file at the root of the project/repo and add the following keys. - REACT_APP_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx - REACT_APP_INSTRUMENTATION_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Where `REACT_APP_CLIENT_ID` is the `Application (client) ID` from the Azure portal and `REACT_APP_INSTRUMENTATION_KEY` is the `Object ID` from the portal.

## Other commands

- `npm test` to run tests from the command line for scenarios like parsing metadata and functional explorer tests.
- `npm run lint` linting your files.

## Getting Help & Guides

### Where To Get Support

Are you having any trouble with Micrososft Graph or would you like to request a Graph feature?

- Check the [Microsoft Graph - Microsoft Q&A](https://learn.microsoft.com/en-us/answers/tags/161/ms-graph) and [Microsoft Graph - Stack Overflow](https://stackoverflow.com/questions/tagged/msgraph) which provide solutions to commonly experienced issues and asked questions.

- If there is no similar issue, submit the issue on [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/ask/?displayLabel=Microsoft%20Graph) with the tag "Microsoft Graph" or ask questions on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=msgraph).

- For more information about Microsoft Graph, refer to the [Microsoft Graph Docs](https://learn.microsoft.com/en-us/graph/overview) and [Microsoft Graph REST API Docs](https://learn.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0).

Are you new to Graph Explorer or would like to raise a bug or request a feature?

- Use our [Graph Explorer Getting Started Docs](https://learn.microsoft.com/en-us/graph/graph-explorer/graph-explorer-overview) to get guidance on how to quickly use Graph Explorer.

- Use [https://github.com/microsoftgraph/microsoft-graph-explorer-v4/issues](https://github.com/microsoftgraph/microsoft-graph-explorer-v4/issues) to report Graph Explorer bugs and to suggest new features or enhancements (and ask Graph Explorer related questions).

### Building Apps & Accessing M365 Data

- To simplify your Microsoft Graph app-building experience, use our [Microsoft Graph SDKs](<(https://learn.microsoft.com/en-us/graph/sdks/sdks-overview)>) and [Microsoft Graph Toolkit (MGT)](<(https://learn.microsoft.com/en-us/graph/toolkit/overview)>) which provide fully functional and out-of-the-box web components.

- Refer to [Microsoft Graph Quick Start](https://developer.microsoft.com/en-us/graph/quick-start) to get a pre-initialized SDK sample application up and running in less 3 minutes using the language of your choice.

## Contributing

Please see the [contributing guidelines](CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## E2E playwright testing

- Playwright requires a running GE Url to run against.
- In your `.env` file, create add variables:
  - PLAYWRIGHT_TESTS_USERNAME='your demo tenant email address'
  - PLAYWRIGHT_TESTS_PASSWORD='password to the demo tenant account'
  - PLAYWRIGHT_TESTS_BASE_URL='url that you are running against' // http://localhost:3000 if testing locally
- Save your changes.
- On your terminal run the command `npx playwright install`
- On your terminal run the command `npx playwright install-deps`.
- Once the installation is complete run the command `npx playwright test ui`.
- Playwright commands can be extended using arguments described in the official documentation [Running tests](https://playwright.dev/docs/running-tests)

## Additional resources

- [Microsoft Graph website](https://graph.microsoft.io)
- [Office Dev Center](http://dev.office.com/)
- [Graph Explorer releases](https://github.com/microsoftgraph/microsoft-graph-explorer/releases)

## Copyright

Copyright (c) 2017 Microsoft. All rights reserved.
