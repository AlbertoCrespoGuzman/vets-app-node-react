import { takeLatest } from 'redux-saga/effects'
import getUsers from './usersSagas'
import getProfile from './profileSagas'
import getAdminExams from './adminExamsSagas'
import axios from 'axios'

function *index(){
    
    yield takeLatest('LOAD_USERS_REQUEST', getUsers, axios)
    yield takeLatest('LOAD_PROFILE_REQUEST', getProfile, axios)
    yield takeLatest('LOAD_ADMIN_EXAMS_REQUEST', getAdminExams, axios)
}

export default index