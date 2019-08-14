import { put } from 'redux-saga/effects'
import  { loadUsersSuccess } from './../actions/actions'
import dotenv from 'dotenv'
dotenv.config()

function *getUsers(axios, actions){
    console.log('usersSagas')    
    const dados = yield axios.get(process.env.REACT_APP_API_HOST + '/api/users/')
        console.log(dados.data)
        yield put(loadUsersSuccess(dados.data))
    
}
export default getUsers