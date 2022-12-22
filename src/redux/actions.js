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
export const SET_AUTHDATA = 'SET_AUTHDATA';
export const LOGOUT = 'LOGOUT';
export const SET_CHANGES_TRUE = 'SET_CHANGES_TRUE';
export const SET_CHANGES_FALSE = 'SET_CHANGES_FALSE';
export const SET_IMAGE_LOAD_FALSE = 'SET_IMAGE_LOAD_FALSE';
export const SET_IMAGE_LOAD_TRUE = 'SET_IMAGE_LOAD_TRUE';
export const SET_PROFILE = 'SET_PROFILE';
export const SET_USERS_ONLINE = 'SET_USERS_ONLINE';

const API = axios.create({ 
    // baseURL: 'http://localhost:5000/'
    baseURL: 'https://sqmr.onrender.com/'
});

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }

  return req;
});

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
        dispatch({ type: ERROR_DISPLAY_ON, text });
        setTimeout(() => {
            dispatch({ type: ERROR_DISPLAY_OFF })      
        }, 3000);
    }
}

export function errorOff(){
    return{
        type: ERROR_DISPLAY_OFF,
    }
}

export function commentCreate(formData, {socket, setTextComment, setEditText, setPhoto}){ 
    return async dispatch => {
        dispatch({ type: SET_DISABLED_TRUE })
        API.post(`/comments/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            dispatch(commentsLoad(socket));
            setPhoto({ photoBase64: '', file: null });
            setTextComment('');
            setEditText('');
            dispatch({ type: SET_DISABLED_FALSE });
            dispatch(errorOff());
        }).catch(res => {
            dispatch(errorOn(res.response.data.error));
            dispatch({ type: SET_DISABLED_FALSE })
        })
    }
}

export function commentUpdate(formData, {id, socket, setTextComment, setEditText, setPhoto, setEditPhoto, setEditMode}){
    return async dispatch => {
        dispatch({ type: SET_DISABLED_TRUE })
        await API.put(`/comments/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            dispatch(commentsLoad(socket))
            setTextComment('');
            setEditText('');
            setPhoto({ photoBase64: '', file: null });
            setEditPhoto({ photoBase64: '', file: null });
            setEditMode(false);
            dispatch({ type: SET_DISABLED_FALSE })
        }).catch(res => {
            dispatch(errorOn(res.response.data.error));
            dispatch({ type: SET_DISABLED_FALSE })
        })
    }
}

export const changeSettings = (formData, socket) => async (dispatch) => {
    try {
        dispatch({ type: SET_DISABLED_TRUE });
        await API.put('/change-settings', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            dispatch(commentsLoad(socket));
            socket.emit('profile:get', formData.id);
            socket.on('profile', (profile) => { 
                dispatch({ type: AUTH, data: {
                    result: profile,
                    token: formData.token
                }});
            })
            dispatch({ type: SET_CHANGES_TRUE });
            dispatch({ type: SET_DISABLED_FALSE });
        })
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
      dispatch({ type: SET_DISABLED_FALSE });
    }
};

export const loadAuthData = ({ socket, data }, setLoading) => async (dispatch) => {
    try {
        await API.post(`/account`, data).then((res) => {
            setLoading && setLoading(false);
            socket.emit('profile:get', data.id);
            socket.on('profile', (profile) => { 
                dispatch({
                    type: SET_AUTHDATA,
                    data: {
                        result: profile,
                        token: data.token
                    }
                });
            })
        })
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
    }
}

export function commentDelete(socket, comment, id, setEditMode, setModal, navigate){ 
    return async dispatch => {
        dispatch({ type: SET_DISABLED_TRUE });
            API.delete(`/comments/${id}`).then(() => {
                dispatch({ type: COMMENT_DELETE, data: { comment, id} });
                setEditMode(false);
                setModal(false);
            }).then(() => {
                dispatch(commentsLoad(socket));
            }).finally(() => { 
                dispatch({ type: SET_DISABLED_FALSE });
            }).catch(res => {
                dispatch(errorOn(res.response.data.error));
            })
    }
}

export function commentsLoad(socket){
    return async dispatch => {
        try{
            dispatch(loaderOn());
                socket.emit('comments:get');
                socket.on('comments', (messages) => {
                    dispatch({ type: COMMENTS_LOAD, data: messages });
                    dispatch(errorOff());
                    dispatch(loaderOff());
                    dispatch({type: SET_CHANGES_FALSE});
                })                
        } catch(err){
            dispatch(errorOn(`${err.response.status} ${err.response.statusText}`));
            dispatch(loaderOff());
        }
    }
}

export const signin = (formData, navigate, socket) => async (dispatch) => {
    try {
      dispatch({ type: SET_DISABLED_TRUE })
      await API.post('/login', formData).then(res => {
        socket.emit('login', { id: res.data.result._id });
        dispatch({ type: AUTH, data: res.data });
        dispatch({ type: SET_DISABLED_FALSE });
        dispatch(errorOff());
        navigate('/comments');
      });
    } catch (error) {
        dispatch(errorOn(error.response.data.message));
        dispatch({ type: SET_DISABLED_FALSE });
    }
  };
  
export const signup = (formData, navigate, setVerifyStatus) => async (dispatch) => {
    try {
      dispatch({ type: SET_DISABLED_TRUE })
      await API.post('/register', formData).then(() => {
        dispatch(errorOff());
        setVerifyStatus(true);
        dispatch({ type: SET_DISABLED_FALSE });
      })
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
      dispatch({ type: SET_DISABLED_FALSE });
    }
};

export const googleAuth = (formData, navigate, socket) => async (dispatch) => {
    try {
      dispatch({ type: SET_DISABLED_TRUE })
      await API.post('/googleAuth', formData).then((res) => {
        socket.emit('login', { id: res.data.result.googleId });
        dispatch({ type: AUTH, data: formData });
        navigate('/comments');
        dispatch(errorOff());
        dispatch({ type: SET_DISABLED_FALSE });
      })
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
      dispatch({ type: SET_DISABLED_FALSE });
    }
};

export const verifyMail = (formData, setVerifyStatus) => async (dispatch) => {
    try {
        await API.post('/resend-verification', formData).then(() => {
            setVerifyStatus(true);
        });
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
    }
};

export const verifyMailOnLoad = (formData, navigate, decode, setValidUrl) => async (dispatch) => {
    try {
        await API.get(`/${formData.id}/verify/${formData.token}`)
        .then((res) => {
            if (formData.token) {
                const decodedToken = decode(formData.token);
            
                if (decodedToken.exp * 1000 < new Date().getTime()) {
                    setValidUrl('Registration link timed out, please try again')
                } else {
                    setValidUrl('Email verified successfully')
                    setTimeout(() => {
                        dispatch(signin({
                            email: res.data.user.email,
                            password: res.data.user.password,
                        }, navigate));
                    }, 3000);
                };
            }
        })
    } catch (error) {
        setValidUrl('error');
    }
};

export const deleteSchema = (formData, navigate, socket) => async (dispatch) => {
    try {
        await API.post(`/delete/${formData.id}`, formData).then((res) => {
            dispatch({type: LOGOUT});
            dispatch(commentsLoad(socket));
            navigate('/comments');
        })
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
    }
};

export const getUserProfile = (id, setValidProfile) => async (dispatch) => {
    try {
        await API.post(`/profile`, id).then((res) => {
            if(res.data.message === `User doesn't exist`){
                setValidProfile('invalid');
            } else {
                setValidProfile('valid');
                dispatch({ type: SET_PROFILE, data: res.data });
            }
        })
    } catch (error) {
        dispatch(errorOn(error.response.data.message));
    }
}

export const getUsersOnline = (user, socket) => async (dispatch) => {
    try {
        socket.on('count', data => {
            dispatch({type: SET_USERS_ONLINE, data})
        });

        if(user){
            if(user.result._id){
                socket.emit('login', { id: user.result._id })
            } else if(user.result.googleId){
                socket.emit('login', { id: user.result.googleId })
            } else {
                socket.emit('login', { id: 'without' })
            }
        }
    } catch (error) {
        dispatch(errorOn(error.response.data.message));
    }
}
