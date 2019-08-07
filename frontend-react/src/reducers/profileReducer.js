const INITIAL_STATE = {
    data: [],
    isFetching: false,
    error:false
}

const profile = ( state = INITIAL_STATE, action) => {
    if(action.type === 'LOAD_PROFILE_REQUEST' ){
        return {
            isFetching: true,
            data: [],
            error: false
        }
    }
    if(action.type === 'LOAD_PROFILE_SUCCESS' ){
        return {
            isFetching: false,
            data: action.data,
            error: false,
        }
    }
    if(action.type === 'LOAD_PROFILE_ERROR' ){
        return {
            isFetching: false,
            data: [],
            error: true
        }
    }
    return state
}

export default profile