import { put } from 'redux-saga/effects'
import  { loadAdminExamsSuccess } from './../actions/actions'
import dotenv from 'dotenv'
dotenv.config()

function *getAdminExams(axios, actions){

    const dados = yield axios.get(process.env.REACT_APP_API_HOST + '/api/files/pages/' + actions.numPage)
        console.log(dados.data)
        yield put(loadAdminExamsSuccess(dados.data.docs, dados.data.pages, dados.data.total))
    
}
export default getAdminExams
