import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import reducers from 'store/reducers';

import { environments } from 'config/constants';

const middleware = [thunk];
if (process.env.NODE_ENV !== environments.PRODUCTION) {
  middleware.push(createLogger());
}

const store = createStore(
  reducers,
  {},
  applyMiddleware(...middleware),
);

export default store;
