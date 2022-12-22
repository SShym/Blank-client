import { 
    AUTH,
    LOGOUT,
    SET_AUTHDATA,
    SET_PROFILE,
    SET_USERS_ONLINE
} from './actions';


const initialState = {
    authData: null,
    profile: null,
    usersOnline: []
}

export const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case AUTH: 
            localStorage.setItem('profile', JSON.stringify({ ...action?.data }));
            return { 
                ...state, 
                authData: action.data, 
                loading: false, 
                errors: null 
            };
        
        case LOGOUT: 
            localStorage.removeItem('profile');
            return { 
                ...state, 
                authData: null, 
                loading: false, 
                errors: null 
            };
        case SET_AUTHDATA:
            return {
                ...state,
                authData: action.data, 
            };
        case SET_PROFILE:
            return {
                ...state,
                profile: action.data
            }
        case SET_USERS_ONLINE:
            return {
                ...state,
                usersOnline: action.data
            }
        
        default:
            return state;
    }
}