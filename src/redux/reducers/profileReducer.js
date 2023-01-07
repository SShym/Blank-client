import { 
    SET_PROFILE,
    SET_USERS_ONLINE,
    SET_ALL_PROFILES
} from '../actions';

const initialState = {
    profile: null,
    allProfiles: [],
    usersOnline: []
}

export const profileReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_PROFILE:
            return {
                ...state,
                profile: action.data
            }
        case SET_ALL_PROFILES: 
            return {
                ...state,
                allProfiles: action.data
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