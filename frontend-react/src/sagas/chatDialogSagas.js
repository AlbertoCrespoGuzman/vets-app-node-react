import { put } from 'redux-saga/effects'
import  { loadChatDialogSuccess } from './../actions/actions'
import dotenv from 'dotenv'
dotenv.config()

function *getChatDialog(axios, actions){
        const dados = yield axios.get(process.env.REACT_APP_API_HOST + '/api/comments/file/' + actions.file_id)
        
        yield put(loadChatDialogSuccess(dados.data, actions.file_id))
    
}
export default getChatDialog