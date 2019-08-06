import { loadDataSuccess } from "../actions"
import { put } from  'redux-saga/effects'

import axios from 'axios'

function *postLogin(){
    const response = yield axios.post()
    yield put(loadDataSuccess(response))
}

export default postLogin