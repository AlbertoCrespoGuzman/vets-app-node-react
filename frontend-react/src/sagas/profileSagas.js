import { put } from 'redux-saga/effects'
import  { loadProfileSuccess } from './../actions/actions'
import dotenv from 'dotenv'
dotenv.config()

function *getProfile(axios, actions){
    console.log('profileSagas')    
    const dados = yield axios.get(process.env.REACT_APP_API_HOST + '/api/users/me')
        console.log('eeeee', dados.data)
        yield put(loadProfileSuccess(dados.data))
    
}
export default getProfile