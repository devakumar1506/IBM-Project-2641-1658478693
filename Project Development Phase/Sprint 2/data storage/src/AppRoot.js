import React from 'react';
import { Provider } from 'react-redux';
import AppContainer from 'containers/AppContainer';

import store from 'store/store';

const AppRoot = () => (
  <Provider store={store}>
    <AppContainer />
  </Provider>
);

export default AppRoot;
