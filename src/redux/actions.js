import axios from 'axios';
export const COMMENT_UPDATE = 'COMMENT_UPDATE';
export const COMMENT_DELETE = 'COMMENT_DELETE';
export const COMMENTS_LOAD = 'COMMENTS_LOAD';
export const COMMENTS_LOAD_DIRECT = 'COMMENTS_LOAD_DIRECT';
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
export const SET_ALL_PROFILES = 'SET_ALL_PROFILES';
export const SET_USERS_ONLINE = 'SET_USERS_ONLINE';

const API = axios.create({ 
    // baseURL: 'http://localhost:5000'
    baseURL: 'https://sqmr.onrender.com'
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

export function commentCreate(formData, {socket, setTextComment, setEditText, setPhoto}){ 
    return async dispatch => {
        dispatch({ type: SET_DISABLED_TRUE });
        setTextComment('');
        API.post(`/comments/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            dispatch(commentsLoad(socket));
            setPhoto({ photoBase64: '', file: null });
            setEditText('');
            dispatch({ type: SET_DISABLED_FALSE });
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
        socket && socket.emit('login', res.data.result._id ? res.data.result._id : res.data.result.googleId );
        dispatch({ type: AUTH, data: res.data });
        dispatch({ type: SET_DISABLED_FALSE });
        navigate('/comments?page=1');
      });
    } catch (error) {
        dispatch(errorOn(error.response.data.message));
        dispatch({ type: SET_DISABLED_FALSE });
    }
};

export const signup = (formData, setVerifyStatus) => async (dispatch) => {
    try {
      dispatch({ type: SET_DISABLED_TRUE })
      await API.post('/register', formData).then(() => {
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
        dispatch({ type: AUTH, data: res.data });
        navigate('/comments');
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
                            passwordVerify: res.data.user.password,
                        }, navigate));
                    }, 3000);
                };
            }
        })
    } catch (error) {
        setValidUrl('error');
    }
};

export const deleteSchema = (formData, user, navigate, socket) => async (dispatch) => {
    try {
        await API.post(`/delete/${formData.id}`, formData).then((res) => {
            socket.emit('disconnectById', { id: user.result.googleId ? user.result.googleId : user.result._id });
            dispatch({type: LOGOUT});
            dispatch(commentsLoad(socket));
            navigate('/comments');
        })
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
    }
};

export const getUserProfile = (id, setValidProfile, setTimer) => async (dispatch) => {
    try {
        await API.get(`/profile/${id}`).then((res) => {
            dispatch({ type: SET_PROFILE, data: res.data });
        }).finally(() => {
            setValidProfile && setValidProfile(true);
        })
    } catch (error) {
        dispatch(errorOn(error.response.data.message));
    }
}

export const getAllUsers = () => async (dispatch) => {
    try {
        await API.get('/all-profiles').then((res) => {
            dispatch({ type: SET_ALL_PROFILES, data: res.data });
        })
    } catch (error) {
        dispatch(errorOn(error.response.data.message));
    }
}

export const getUsersOnline = (user, socket) => async (dispatch) => {
    try {
        socket.on('countUsers', data => {
            dispatch({ type: SET_USERS_ONLINE, data })
        });

        if(user){
            if(user.result.googleId){
                socket.emit('login', { id: user.result.googleId })
            } else {
                socket.emit('login', { id: user.result._id })
            }
        }
    } catch (error) {
        dispatch(errorOn(error.response.data.message));
    }
}

//////////////////////////////// DIRECT ////////////////////////////////////

export function commentCreateDirect(formData, setComment, socket, room, setOpen){ 
    return async dispatch => {
        dispatch({ type: SET_DISABLED_TRUE });
        setComment({ commentText: '', photoFile: null });
        setOpen(false);
        API.post(`/commentsDirect/${room}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            socket.emit('add-direct-comment', res.data);
        }).finally(() => {
            dispatch({ type: SET_DISABLED_FALSE });
        }).catch(err => {
            dispatch(errorOn(err.response.data.error));
            dispatch({ type: SET_DISABLED_FALSE })
        })
    }
}

export function commentsLoadDirect(socket, room){
    return async dispatch => {
        try{
            dispatch(loaderOn());
            socket.emit("join-room", room);
            socket.on("direct-comments", (comments) => {
                dispatch({ type: COMMENTS_LOAD_DIRECT, data: comments });
                dispatch(loaderOff());
                dispatch({type: SET_CHANGES_FALSE});
            })
        } catch(err){
            dispatch(errorOn(`${err.response.status} ${err.response.statusText}`));
        }
    }
}

export const deleteDirectChat = (socket, room, setChatSettings) => async (dispatch) => {
    try {
        setChatSettings(false);
        dispatch({ type: SET_DISABLED_TRUE });
        await API.post(`delete-direct-chat/${room}`).then(() => {
            socket.emit('delete-direct-chat', room);
        }).finally(() => {
            dispatch({ type: SET_DISABLED_FALSE });        
        })
    } catch (error) {
        dispatch(errorOn(error.response.data.message));
    }
}
