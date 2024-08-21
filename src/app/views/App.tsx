import { useState} from 'react';
import { AppContext } from './AppContext';
import Layout from './Layout';
import { webLightTheme } from '@fluentui/react-components';

const App: React.FunctionComponent = theme => {
  const [state, setState] = useState({ selectedVerb: 'GET',
    mobileScreen: false,
    hideDialog: true,
    sidebarTabSelection: 'sample-queries',
    theme: { key: 'light', fluentTheme: webLightTheme } });

  return (
    <AppContext.Provider value={{ state, setState }}>
      <Layout/>
    </AppContext.Provider>
  );
};

export default App;
