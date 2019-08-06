import { takeLatest } from 'redux-saga/effects'
import getUsers from './usersSagas'
import axios from 'axios'

function *index(){
    
    yield takeLatest('LOAD_USERS_REQUEST', getUsers, axios)
}

export default index