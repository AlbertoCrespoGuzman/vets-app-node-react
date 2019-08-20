import { takeLatest } from 'redux-saga/effects'
import getUsers from './usersSagas'
import getProfile from './profileSagas'
import getExams from './examsSagas'
import getAdminExams from './adminExamsSagas'
import getChatDialog from './chatDialogSagas'

import axios from 'axios'

function *index(){
    
    yield takeLatest('LOAD_USERS_REQUEST', getUsers, axios)
    yield takeLatest('LOAD_PROFILE_REQUEST', getProfile, axios)
    yield takeLatest('LOAD_ADMIN_EXAMS_REQUEST', getAdminExams, axios)
    yield takeLatest('LOAD_EXAMS_REQUEST', getExams, axios)
    yield takeLatest('LOAD_CHATDIALOG_REQUEST', getChatDialog, axios)
}

export default index