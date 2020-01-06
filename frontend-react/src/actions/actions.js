
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

export const loadAdminExamsRequest = (numPage) => {
    return {
        type : 'LOAD_ADMIN_EXAMS_REQUEST',
        numPage
    }
}
export const loadAdminExamsSuccess = (data, pages, total) => {
    return {
        type : 'LOAD_ADMIN_EXAMS_SUCCESS',
        data,
        pages,
        total
    }   
}
export const loadExamsRequest = (numPage) => {
    return {
        type : 'LOAD_EXAMS_REQUEST',
        numPage
    }
}
export const loadExamsSuccess = (data, pages, total) => {
    return {
        type : 'LOAD_EXAMS_SUCCESS',
        data,
        pages,
        total
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