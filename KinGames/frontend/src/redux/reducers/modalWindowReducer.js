export const HIDE_MODAL_WINDOW = 'HIDE_MODAL_WINDOW'
export const SHOW_MODAL_WINDOW = 'SHOW_MODAL_WINDOW'

let initialState = {
    active: false,
    modalWindowContent: null,
    width: null,
    height: null
}

export let hideModalWindow = (dispatch) => {
    dispatch({type: HIDE_MODAL_WINDOW})
}

export let showModalWindow = (content, width=null, height=null) => (dispatch) => {
    dispatch({
        type: SHOW_MODAL_WINDOW,
        content,
        width,
        height
    })
}


export let modalWindowReducer = (state=initialState, action) => {
    switch (action.type){
        case HIDE_MODAL_WINDOW:
            return {
                ...state,
                active: false,
                modalWindowContent: null,
            }
        case SHOW_MODAL_WINDOW:
            return {
                ...state,
                active: true,
                modalWindowContent: action.content,
                width: action.width,
                height: action.height
            }
        default:
            return{
                ...state
            }
    }
}