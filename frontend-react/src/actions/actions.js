
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
export const loadExamsRequest = () => {
    return {
        type : 'LOAD_EXAMS_REQUEST'
    }
}
export const loadExamsSuccess = (data) => {
    return {
        type : 'LOAD_EXAMS_SUCCESS',
        data
    }   
}
export const loadChatDialogRequest = (file_id) => {
    return {
        type : 'LOAD_CHATDIALOG_REQUEST',
        file_id
    }
}
export const loadChatDialogSuccess = (data, file_id) => {
    return {
        type : 'LOAD_CHATDIALOG_SUCCESS',
        data,
        file_id
    }   
}