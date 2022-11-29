import { 
    LOADER_DISPLAY_ON, 
    LOADER_DISPLAY_OFF, 
    ERROR_DISPLAY_ON, 
    ERROR_DISPLAY_OFF,
    SET_DISABLED_TRUE,
    SET_DISABLED_FALSE,
} from './actions';


const initialState = {
    loading: false,
    error: null,
    disabled: false
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

        default:
            return state;

    }
}