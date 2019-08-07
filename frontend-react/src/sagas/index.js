import { takeLatest } from 'redux-saga/effects'
import getUsers from './usersSagas'
import getProfile from './profileSagas'
import axios from 'axios'

function *index(){
    
    yield takeLatest('LOAD_USERS_REQUEST', getUsers, axios)
    yield takeLatest('LOAD_PROFILE_REQUEST', getProfile, axios)
}

export default index