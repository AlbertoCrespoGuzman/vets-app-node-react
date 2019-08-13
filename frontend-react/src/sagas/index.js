import { takeLatest } from 'redux-saga/effects'
import getUsers from './usersSagas'
import getProfile from './profileSagas'
import getAdminExams from './adminExamsSagas'
import getExams from './examsSagas'
import axios from 'axios'

function *index(){
    
    yield takeLatest('LOAD_USERS_REQUEST', getUsers, axios)
    yield takeLatest('LOAD_PROFILE_REQUEST', getProfile, axios)
    yield takeLatest('LOAD_ADMIN_EXAMS_REQUEST', getAdminExams, axios)
    yield takeLatest('LOAD_EXAMS_REQUEST', getExams, axios)
}

export default index