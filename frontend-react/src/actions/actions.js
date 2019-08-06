
export const loadUsersRequest = () => {
    return {
        type : 'LOAD_USERS_REQUEST'
    }
}
export const loadUsersSuccess = (data) => {
    return {
        type : 'LOAD_USERS_SUCCESS',
        data
    }   
}