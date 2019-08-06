import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import  createSagaMiddleware from 'redux-saga' 
import indexSaga from './sagas/index'

const inititalState = {};

const sagaMiddleware = createSagaMiddleware()


const store = createStore(
        rootReducer, 
        inititalState, 
        compose(applyMiddleware(thunk,sagaMiddleware), 
                window.__REDUX_DEVTOOLS_EXTENSION__&& window.__REDUX_DEVTOOLS_EXTENSION__()));

sagaMiddleware.run(indexSaga)

export default store;