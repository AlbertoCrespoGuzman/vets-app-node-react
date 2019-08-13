import { put } from 'redux-saga/effects'
import  { loadExamsSuccess } from './../actions/actions'

function *getExams(axios, actions){
    
    const dados = yield axios.get('/api/files/')
        console.log(dados.data)
        yield put(loadExamsSuccess(dados.data))
    
}
export default getExams