# Microsoft Graph Explorer V4

[![Build Status](https://dev.azure.com/japhethobalak/japhethobalak/_apis/build/status/microsoftgraph.microsoft-graph-explorer-v2?branchName=dev)](https://dev.azure.com/japhethobalak/japhethobalak/_build/latest?definitionId=4&branchName=dev)

The [Microsoft Graph Explorer V4](https://developer.microsoft.com/graph/graph-explorer) lets developers quickly navigate and test API endpoints.

The Graph Explorer is written in [TypeScript](https://www.typescriptlang.org/) and powered by:

- [React](https://reactjs.org/)
- [Office Fabric](https://dev.office.com/fabric)

## Running the explorer locally

- `npm install` to install project dependencies. `npm` is installed by default with [Node.js](https://nodejs.org/).
- `npm start` starts the TypeScript compiler in watch mode and the local server. It should open your browser automatically with the Graph Explorer at [http://localhost:3000/](http://localhost:3000).

### Enabling authentication with your own credentials

- Sign in to your Microsoft account (or Create one) at the [Microsoft Azure Portal](https://ms.portal.azure.com/).
- Find the Azure service named App registrations. If you haven't used this service before, you might need to search for it in the search bar.
- In the App registrations page, click `+ New registration`. You will be redirected to a form in the Microsoft Azure portal where you Register an application. Fill out the form and set the Redirect URI to a `Single-page application (SPA)` with `http://localhost:3000`. You can also set it from authentication tab in the app you have just created.
- Create a `.env` file at the root of the project/repo and add the following keys. - REACT_APP_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx - REACT_APP_INSTRUMENTATION_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Where `REACT_APP_CLIENT_ID` is the `Application (client) ID` from the Azure portal and `REACT_APP_INSTRUMENTATION_KEY` is the `Object ID` from the portal.

## Other commands

- `npm test` to run tests from the command line for scenarios like parsing metadata and functional explorer tests.
- `npm run lint` linting your files

## Getting Help & Guides
### Where To Get Support
If you encounter any MS Graph related issues, refer to the following discussion forums:
* [Microsoft Graph - Microsoft Q&A](https://learn.microsoft.com/en-us/answers/tags/161/ms-graph)
* [Microsoft Graph - Stack Overflow](https://stackoverflow.com/questions/tagged/msgraph)

If there is no similar issue, submit the issue on [Microsoft Q&A](https://learn.microsoft.com/en-us/answers/questions/ask/?displayLabel=Microsoft%20Graph) with the tag "Microsoft Graph" or ask questions on [Stack Overflow](https://stackoverflow.com/questions/ask?tags=msgraph).

For more information, have a look at the [Microsoft Graph Docs](https://learn.microsoft.com/en-us/graph/overview) and [Microsoft Graph REST API Docs](https://learn.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0).

### Building Apps
To build applications using graph components, check out:
* [Microsoft Graph Toolkit Docs](https://learn.microsoft.com/en-us/graph/toolkit/overview)
* [Microsoft Graph SDKs Docs](https://learn.microsoft.com/en-us/graph/sdks/sdks-overview)

### Graph Samples
Go to [Microsoft Graph Quick Start](https://developer.microsoft.com/en-us/graph/quick-start) to build sample apps that call the Micrososft Graph API. These samples can also be found on [Github](https://github.com/orgs/microsoftgraph/repositories?q=sample&type=all&language=&sort=).

Here are two examples to get you started:
* [Using the Microsoft Graph .NET SDK](https://github.com/microsoftgraph/msgraph-sample-aspnet-core)
* [Using the Microsoft Graph JavaScript SDK](https://github.com/microsoftgraph/msgraph-sample-javascriptspa)

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

## Known issues

- You cannot remove permissions by using the Graph Explorer UI. You will need to [remove the application consent](http://shawntabrizi.com/aad/revoking-consent-azure-active-directory-applications/) and then re-consent to remove permissions. I know, this is far from a good experience.

## Additional resources

- [Microsoft Graph website](https://graph.microsoft.io)
- [Office Dev Center](http://dev.office.com/)
- [Graph Explorer releases](https://github.com/microsoftgraph/microsoft-graph-explorer/releases)

## Copyright

Copyright (c) 2017 Microsoft. All rights reserved.
