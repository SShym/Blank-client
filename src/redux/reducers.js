import { combineReducers } from "redux";

import { commentReducer } from './reducers/commentReducer';
import { appReducer } from './reducers/appReducer';
import { authReducer } from "./reducers/authReducer";
import { profileReducer } from './reducers/profileReducer'

export const reducers = combineReducers({
    commentReducer,
    appReducer,
    authReducer,
    profileReducer,
})