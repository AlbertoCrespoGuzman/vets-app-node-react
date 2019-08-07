import { put } from 'redux-saga/effects'
import  { loadProfileSuccess } from './../actions/actions'

function *getProfile(axios, actions){
    console.log('profileSagas')    
    const dados = yield axios.get('/api/users/me')
        console.log('eeeee', dados.data)
        yield put(loadProfileSuccess(dados.data))
    
}
export default getProfile