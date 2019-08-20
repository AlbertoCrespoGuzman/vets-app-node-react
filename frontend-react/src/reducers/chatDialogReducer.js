const INITIAL_STATE = {
    data: [],
    isFetching: false,
    error:false,
    file_id: null,
}

const chatDialog = ( state = INITIAL_STATE, action) => {
    if(action.type === 'LOAD_CHATDIALOG_REQUEST' ){
        return {
            isFetching: true,
            data: [],
            error: false,
            file_id: action.file_id
        }
    }
    if(action.type === 'LOAD_CHATDIALOG_SUCCESS' ){
        return {
            isFetching: false,
            data: action.data,
            error: false,
            file_id: action.file_id,
        }
    }
    if(action.type === 'LOAD_CHATDIALOG_ERROR' ){
        return {
            isFetching: false,
            data: [],
            error: true
        }
    }
    return state
}

export default chatDialog