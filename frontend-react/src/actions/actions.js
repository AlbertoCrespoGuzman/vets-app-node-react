
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

export const loadProfileRequest = () => {
    return {
        type : 'LOAD_PROFILE_REQUEST'
    }
}
export const loadProfileSuccess = (data) => {
    return {
        type : 'LOAD_PROFILE_SUCCESS',
        data
    }   
}

export const loadAdminExamsRequest = () => {
    return {
        type : 'LOAD_ADMIN_EXAMS_REQUEST'
    }
}
export const loadAdminExamsSuccess = (data) => {
    return {
        type : 'LOAD_ADMIN_EXAMS_SUCCESS',
        data
    }   
}