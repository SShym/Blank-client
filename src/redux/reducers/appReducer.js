import { 
    LOADER_DISPLAY_ON, 
    LOADER_DISPLAY_OFF, 
    ERROR_DISPLAY_ON, 
    ERROR_DISPLAY_OFF,
    SET_DISABLED_TRUE,
    SET_DISABLED_FALSE,
    SET_CHANGES_TRUE,
    SET_CHANGES_FALSE,
    SET_IMAGE_LOAD_FALSE,
    SET_IMAGE_LOAD_TRUE,
} from '../actions';


const initialState = {
    loading: false,
    error: null,
    disabled: false,
    changes: false,
    imageLoad: false,
    roomId: null
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOADER_DISPLAY_ON: 
            return { 
                ...state, 
                loading: true
            };
        case LOADER_DISPLAY_OFF: 
            return { 
                ...state, 
                loading: false
            };
        case ERROR_DISPLAY_ON: 
            return {
                ...state,
                error: action.text
            }
        case ERROR_DISPLAY_OFF: 
            return {
                ...state,
                error: null
            }
        case SET_DISABLED_TRUE:
            return{
                ...state,
                disabled: true
            }
        case SET_DISABLED_FALSE:
            return{
                ...state,
                disabled: false
            }
        case SET_CHANGES_TRUE: 
            return {
                ...state,
                changes: true
            }
        case SET_CHANGES_FALSE: 
            return {
                ...state,
                changes: false
            }
        case SET_IMAGE_LOAD_FALSE:
            return{
                ...state,
                imageLoad: false
            }
        case SET_IMAGE_LOAD_TRUE:
            return{
                ...state,
                imageLoad: true
            }

        default:
            return state;

    }
}