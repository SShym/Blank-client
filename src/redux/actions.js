import axios from 'axios';
export const COMMENT_CREATE = 'COMMENT_CREATE';
export const COMMENT_UPDATE = 'COMMENT_UPDATE';
export const COMMENT_DELETE = 'COMMENT_DELETE';
export const COMMENTS_LOAD = 'COMMENTS_LOAD';
export const LOADER_DISPLAY_ON = 'LOADER_DISPLAY_ON';
export const LOADER_DISPLAY_OFF = 'LOADER_DISPLAY_OFF';
export const ERROR_DISPLAY_ON = 'ERROR_DISPLAY_ON';
export const ERROR_DISPLAY_OFF = 'ERROR_DISPLAY_OFF';
export const ADD_PHOTO = 'ADD_PHOTO';
export const SET_DISABLED_TRUE = 'SET_DISABLED_TRUE';
export const SET_DISABLED_FALSE = 'SET_DISABLED_FALSE';
export const AUTH = 'AUTH';
export const LOGOUT = 'LOGOUT';

const API = axios.create({ 
    baseURL: 'https://vvv.herokuapp.com' 
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

export function commentCreate({comment, photo, name, avatar}, timeCreate, id){
    const date = String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0');
    return async dispatch => {
        dispatch({ type: SET_DISABLED_TRUE })
        API.post(`/products/`, { comment, photo, name, avatar, changed: false, timeCreate: date, id }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            dispatch({
                type: COMMENT_CREATE,
                data: {
                    name,
                    avatar,
                    comment, 
                    photo, 
                    changed: false, 
                    timeCreate: date, 
                    id: res.data._id,
                }
            })
            dispatch({ type: SET_DISABLED_FALSE })
            dispatch(errorOff());
        }).catch(res => {
            dispatch(errorOn(res.response.data.error));
            dispatch({ type: SET_DISABLED_FALSE })
        })
    }
}

export function commentUpdate({name, avatar}, comment, id, photo){
    const date = String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0');

    return async dispatch => {
        dispatch({ type: SET_DISABLED_TRUE })
        API.put(`/products/${id}`, { name, avatar, comment, photo, changed: true, timeChanged: date })
        .then((res) => {
            dispatch({
                type: COMMENT_UPDATE,
                data: {
                    name,
                    avatar, 
                    comment, 
                    id, 
                    photo, 
                    changed: true, 
                    timeChanged: date
                } 
            })
            dispatch({ type: SET_DISABLED_FALSE })
        }).catch(res => {
            dispatch(errorOn(res.response.data.error));
            dispatch({ type: SET_DISABLED_FALSE })
        })
    }
}

export function commentDelete(comment, id){ 
        return async dispatch => {
            API.delete(`/products/${id}`)
                .then((res) => dispatch({
                    type: COMMENT_DELETE,
                    data: { comment, id} 
                })).catch(res => {
                    dispatch(errorOn(res.response.data.error));
                    // dispatch({ type: SET_DISABLED_FALSE })
                })
        }
}

export function commentsLoad(data){
    return async dispatch => {
        try{
            dispatch(loaderOn());
            await API.get('/products').then((res) => {
                dispatch(errorOff());
                dispatch(loaderOff());
                dispatch({ 
                    type: COMMENTS_LOAD, 
                    data: res.data 
                })
            })
        } catch(err){
            dispatch(errorOn(`${err.response.status} ${err.response.statusText}`));
            dispatch(loaderOff());
        }
    }
}

export function loaderOn(){
    return{
        type: LOADER_DISPLAY_ON,
    }
}

export function loaderOff(){
    return{
        type: LOADER_DISPLAY_OFF,
    }
}

export function errorOn(text){
    return dispatch => {
        dispatch({
            type: ERROR_DISPLAY_ON,
            text
        })
    }
}

export function errorOff(){
    return{
        type: ERROR_DISPLAY_OFF,
    }
}

export const signin = (formData, navigate) => async (dispatch) => {
    try {
      const { data } = await API.post('/login', formData);
      dispatch({ type: AUTH, data });
      dispatch(errorOff());
      navigate('/');
    } catch (error) {
        dispatch(errorOn(error.response.data.message));
    }
  };
  
export const signup = (formData, navigate, setVerifyStatus) => async (dispatch) => {
    try {
      await API.post('/register', formData).then(() => {
        dispatch(errorOff());
        setVerifyStatus(true);
      })
    //   dispatch({ type: AUTH, data });
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
    }
};

export const verifyMail = (formData, setVerifyStatus) => async (dispatch) => {
    try {
        await API.post('/resend-verification', formData).then(() => {
            setVerifyStatus(true)
        });
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
    }
};

export const deleteSchema = (formData, navigate) => async (dispatch) => {
    try {
        await API.post(`/delete/${formData.id}`, formData).then((res) => {
            dispatch({type: LOGOUT});
            navigate('/');
        })
    //   dispatch({ type: AUTH, data });
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
    }
};