import { put } from 'redux-saga/effects'
import  { loadExamsSuccess } from './../actions/actions'
import dotenv from 'dotenv'
dotenv.config()

function *getExams(axios, actions){
    
    const dados = yield axios.get(process.env.REACT_APP_API_HOST + '/api/files//pages/' + actions.numPage)
        console.log(dados.data)
        yield put(loadExamsSuccess(dados.data.docs, dados.data.pages, dados.data.total))
    
}
export default getExams