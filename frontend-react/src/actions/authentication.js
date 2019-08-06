import axios from 'axios';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
import setAuthToken from '../setAuthToken';
import jwt_decode from 'jwt-decode';

export const registerUser = (user, history) => dispatch => {
    
    if(localStorage.getItem('jwtToken')){
        axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
        console.log(axios.defaults.headers.common['Authorization'])
        axios.post('/api/users/register', user)
                .then(res => history.push('/users?registrationSucessfull=true'))
                .catch(err => {
                    console.log(JSON.stringify(err.response))
                    dispatch({
                        type: GET_ERRORS,
                        payload: err.response.data
                    });
                });
    }else{
        history.push('/login')
    }
    
}

export const loginUser = (user) => dispatch => {
    
    axios.post('/api/users/login', user)
            .then(res => {
                console.log('res', res.data)
                const { token } = res.data;
                localStorage.setItem('jwtToken', token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                dispatch(setCurrentUser(decoded));
            })
            .catch((err) => {
                if(err && err.response){
                    dispatch({
                        type: GET_ERRORS,
                        payload: err.response.data
                    })
                }else{
                    console.log(err)
                }
                
            });
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    history.push('/login');
}