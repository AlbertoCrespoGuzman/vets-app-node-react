import { combineReducers } from 'redux';
import errorReducer from './errorReducer';
import authReducer from './authReducer';
import usersReducer from './usersReducer'
import profileReducer from './profileReducer'

export default combineReducers({
    errors: errorReducer,
    auth: authReducer,
    users: usersReducer,
    profile: profileReducer
    
});