const INITIAL_STATE = {
    data: [],
    isFetching: false,
    error:false
}

const adminExams = ( state = INITIAL_STATE, action) => {
    if(action.type === 'LOAD_ADMIN_EXAMS_REQUEST' ){
        return {
            isFetching: true,
            data: [],
            error: false
        }
    }
    if(action.type === 'LOAD_ADMIN_EXAMS_SUCCESS' ){
        return {
            isFetching: false,
            data: action.data,
            error: false,
        }
    }
    if(action.type === 'LOAD_ADMIN_EXAMS_ERROR' ){
        return {
            isFetching: false,
            data: [],
            error: true
        }
    }
    return state
}

export default adminExams