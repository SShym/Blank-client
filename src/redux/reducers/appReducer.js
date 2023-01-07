import { 
    ERROR_DISPLAY_ON, 
    ERROR_DISPLAY_OFF,
} from '../actions';

const initialState = {
    error: null,
}

export const appReducer = (state = initialState, action) => {
    switch (action.type) {
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
        default:
            return state;

    }
}