import { combineReducers } from "redux";
import { commentReducer } from './commentReducer';
import { appReducer } from './appReducer';
import { authReducer } from "./authReducer";

export const reducers = combineReducers({
    commentReducer,
    appReducer,
    authReducer
})