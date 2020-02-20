# Microsoft Graph Explorer V4
[![Build Status](https://dev.azure.com/japhethobalak/japhethobalak/_apis/build/status/microsoftgraph.microsoft-graph-explorer-v2?branchName=dev)](https://dev.azure.com/japhethobalak/japhethobalak/_build/latest?definitionId=4&branchName=dev)

The [Microsoft Graph Explorer V4](https://developer.microsoft.com/graph/graph-explorer) lets developers quickly navigate and test API endpoints.

The Graph Explorer is written in [TypeScript](https://www.typescriptlang.org/) and powered by:
* [React](https://reactjs.org/)
* [Office Fabric](https://dev.office.com/fabric)


## Running the explorer locally

* `npm install` to install project dependencies. `npm` is installed by default with [Node.js](https://nodejs.org/).
* `npm start` starts the TypeScript compiler in watch mode and the local server. It should open your browser automatically with the Graph Explorer at [http://localhost:3000/](http://localhost:3000).

#### Enabling authentication with your own credentials
* Signing to your Microsoft account or Create one if you don't have.
* In the Dashboard, click `Add an app in the Azure portal`. You will be redirected to Microsoft Azure portal where you Register an application.
    Set Redirect URI to `http://localhost:3000`.You can also set it from authentication tab in the app you have just created.
* Create `.env` file in the root of the project and add the following keys.
    - REACT_APP_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    - REACT_APP_INSTRUMENTATION_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
Where `REACT_APP_CLIENT_ID` is the `Application (client) ID` from the Azure portal and `REACT_APP_INSTRUMENTATION_KEY` is the `Object ID` from the portal.

## Other commands
* `npm test` to run tests from the command line for scenarios like parsing metadata and functional explorer tests.
* `npm run lint` linting your files

## Contributing
Please see the [contributing guidelines](CONTRIBUTING.md).

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## Known issues
* You cannot remove permissions by using the Graph Explorer UI. You will need to [remove the application consent](http://shawntabrizi.com/aad/revoking-consent-azure-active-directory-applications/) and then re-consent to remove permissions. I know, this is far from a good experience.

## Additional resources
* [Microsoft Graph website](https://graph.microsoft.io)
* [Office Dev Center](http://dev.office.com/)
* [Graph Explorer releases](https://github.com/microsoftgraph/microsoft-graph-explorer/releases)

## Copyright
Copyright (c) 2017 Microsoft. All rights reserved.
