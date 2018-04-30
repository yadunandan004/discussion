import { createStore,applyMiddleware,combineReducers} from 'redux';
import  topicReducer  from './reducers/topics';
import userReducer from './reducers/users';
import logger from 'redux-logger';
import thunk from 'redux-thunk';


export default createStore(combineReducers({topicReducer:topicReducer,userReducer:userReducer}) ,applyMiddleware(logger,thunk));

