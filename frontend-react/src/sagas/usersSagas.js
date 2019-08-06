import { put } from 'redux-saga/effects'
import  { loadUsersSuccess } from './../actions/actions'

function *getUsers(axios, actions){
    console.log('usersSagas')    
    const dados = yield axios.get('/api/users/')
        
        yield put(loadUsersSuccess(dados.data))
    
}
export default getUsers