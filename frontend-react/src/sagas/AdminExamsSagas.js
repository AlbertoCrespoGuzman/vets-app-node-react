import { put } from 'redux-saga/effects'
import  { loadAdminExamsSuccess } from './../actions/actions'

function *getAdminExams(axios, actions){
    console.log('AdminExamsSagas')    
    const dados = yield axios.get('/api/files/')
        console.log(dados.data)
        yield put(loadAdminExamsSuccess(dados.data))
    
}
export default getAdminExams