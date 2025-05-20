import { combineReducers } from 'redux';
import { routerReducer } from '../../redux/history';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    router: routerReducer,
    user: userReducer,
});

export default rootReducer;