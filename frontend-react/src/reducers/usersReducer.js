const INITIAL_STATE = {
    data: [],
    isFetching: false,
    error:false
}

const users = ( state = INITIAL_STATE, action) => {
    if(action.type === 'LOAD_USERS_REQUEST' ){
        return {
            isFetching: true,
            data: [],
            error: false
        }
    }
    if(action.type === 'LOAD_USERS_SUCCESS' ){
        return {
            isFetching: false,
            data: action.data,
            error: false,
        }
    }
    if(action.type === 'LOAD_USERS_ERROR' ){
        return {
            isFetching: false,
            data: [],
            error: true
        }
    }
    return state
}

export default users