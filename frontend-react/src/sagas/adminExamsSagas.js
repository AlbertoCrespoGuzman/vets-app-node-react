import { put } from 'redux-saga/effects'
import  { loadAdminExamsSuccess } from './../actions/actions'
import dotenv from 'dotenv'
dotenv.config()

function *getAdminExams(axios){

    const dados = yield axios.get(process.env.REACT_APP_API_HOST + '/api/files/')
        console.log(dados.data)
        yield put(loadAdminExamsSuccess(dados.data))
    
}
export default getAdminExams
