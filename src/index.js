import React from 'react';
import ReactDOM from 'react-dom';
import './index.module.scss';

import { createStore, applyMiddleware, compose } from 'redux'; /* Создает хранилище Redux, в котором хранится дерево состояний приложения. Должен быть только одно хранилище. */
import { Provider } from 'react-redux'; /* Компонент делает Redux доступным для всех вложенных компонентов, которым необходим доступ к хранилищу Redux. */
import reduxThunk from 'redux-thunk';
import reducer from './Store/reducer'; 

import App from './Components/App/app';

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;
/* Любые экшены, отправленные в экземпляр стора, будут проходить через loggerMiddleware и crashReporter: */

/* const loggerMiddleware = store => next => action => { 
  console.log('dispatching', action);
  const result = next(action);
  console.log("next state", store.getState());
  return result;
}
const crashReporter = store => next => action => {
  try {
    return next(action);
  } catch (err) {
    console.error("Caught an exception!", err);
    console.log("next state", store.getState());
    throw err;
  }
} */

const store = createStore(reducer, composeEnhancers(applyMiddleware(reduxThunk/* , loggerMiddleware, crashReporter */))); /* создаем дерево состояний и откроем доступ всему приложению */

ReactDOM.render(
  <Provider store={store}> {/* Доступ к store будет иметь все приложение. Кроме того он будет обновлять приложение при обновлении store. */}
    <App />
  </Provider>,
  document.getElementById('root') 
);