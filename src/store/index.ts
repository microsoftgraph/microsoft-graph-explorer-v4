import { applyMiddleware, compose, createStore, Store } from 'redux';
import { createLogger } from 'redux-logger';
import thunkMiddleware from 'redux-thunk';

import reducers from '../app/services/reducers';

const loggerMiddleware = createLogger({
    level: 'info',
    collapsed: true,
});

export const store =  (initialState: object): Store => {
    return createStore(
        reducers,
        initialState,
        applyMiddleware(thunkMiddleware, loggerMiddleware),
        );
};
