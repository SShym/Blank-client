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

const API = axios.create({ 
    baseURL: 'http://localhost:5000/'
    // baseURL: 'https://sqmr.onrender.com/'
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

export function commentCreate({socket, page, comment, photo, photoSize, name, avatar, setTextComment, setEditText, setPhoto}, timeCreate, id){ 
    const date = String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0');
    return async dispatch => {
        dispatch({ type: SET_DISABLED_TRUE })
        API.post(`/comments/`, { 
            comment, 
            photo: photo.file || photo.photoBase64,
            photoSize,
            name, avatar, 
            changed: false, 
            timeCreate: date, 
            id 
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            dispatch(commentsLoad(socket, page)) 
            setPhoto({ photoBase64: '', file: null });
            setTextComment('');
            setEditText('');
            dispatch({ type: SET_DISABLED_FALSE })
            dispatch(errorOff());
        }).catch(res => {
            dispatch(errorOn(res.response.data.error));
            dispatch({ type: SET_DISABLED_FALSE })
        })
    }
}

export const changeSettings = (formData) => async (dispatch) => {
    try {
        dispatch({ type: SET_DISABLED_TRUE });
        await API.put('/change-settings', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            dispatch({ type: AUTH, data: {
                result: res.data.user,
                token: res.data.token
            }});
            dispatch({ type: SET_CHANGES_TRUE });
            dispatch({ type: SET_DISABLED_FALSE });
        })
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
      dispatch({ type: SET_DISABLED_FALSE });
    }
};

export function commentUpdate({photo, photoSize, name, avatar, setTextComment, setEditText, setPhoto, setEditPhoto, setEditMode}, comment, id){
    const date = String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0');
    return async dispatch => {
        dispatch({ type: SET_DISABLED_TRUE })
        await API.put(`/comments/${id}`, { 
            name, 
            avatar, 
            comment, 
            photo: (!photo || photo?.photoBase64?.length === 0) ? '' : photo.file,
            photoSize: photoSize,
            changed: true, 
            timeChanged: date 
        }, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then((res) => {
            dispatch({
                type: COMMENT_UPDATE,
                data: {
                    name,
                    avatar,
                    creator: res.data.creator, 
                    comment, 
                    id, 
                    photo: photo.photoBase64 || '', 
                    photoSize: photoSize,
                    changed: true, 
                    timeChanged: date
                } 
            });
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

export function commentDelete(socket, comment, id, setEditMode, setModal, page, navigate){ 
    return async dispatch => {
        dispatch({ type: SET_DISABLED_TRUE });
        await API.get(`/comments/${page}`).then((res) => {
            API.delete(`/comments/${id}`).then((res) => {
                dispatch({ type: COMMENT_DELETE, data: { comment, id} });
                setEditMode(false);
                setModal(false);
            }).then(() => {
                if(page > 1 && res.data.data.length === 1){
                    dispatch(commentsLoad(socket, (Number(page) - 1))) 
                    navigate(`?page=${Number(page) - 1}`);
                } else {
                    dispatch(commentsLoad(socket, page))
                }
            }).finally(() => { 
                dispatch({ type: SET_DISABLED_FALSE });
            }).catch(res => {
                dispatch(errorOn(res.response.data.error));
            })
        }) 
    }
}

export function commentsLoad(socket, page){
    return async dispatch => {
        try{
            dispatch(loaderOn());
            await API.get(`/comments/${page}`).then((res) => {
                console.log(res)
                socket.on('comments', (messages) => { 
                    dispatch({ type: COMMENTS_LOAD, data: messages });
                    dispatch(errorOff());
                    dispatch(loaderOff());
                    dispatch({type: SET_CHANGES_FALSE});
                })
                socket.emit('comment:get', page);
            })
        } catch(err){
            dispatch(errorOn(`${err.response.status} ${err.response.statusText}`));
            dispatch(loaderOff());
        }
    }
}

export const signin = (formData, navigate) => async (dispatch) => {
    try {
      dispatch({ type: SET_DISABLED_TRUE })
      await API.post('/login', formData).then(res => {
        dispatch({ type: AUTH, data: res.data });
        dispatch({ type: SET_DISABLED_FALSE });
        dispatch(errorOff());
        navigate('/comments?page=1');
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

export const googleAuth = (formData, navigate) => async (dispatch) => {
    try {
      dispatch({ type: SET_DISABLED_TRUE })
      await API.post('/googleAuth', formData).then(() => {
        dispatch({ type: AUTH, data: formData });
        navigate('/comments?page=1');
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

export const deleteSchema = (formData, navigate) => async (dispatch) => {
    try {
        await API.post(`/delete/${formData.id}`, formData).then((res) => {
            dispatch({type: LOGOUT});
            navigate('/comments');
        })
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
    }
};

export const loadAuthData = ({ data }, setLoading) => async (dispatch) => {
    try {
        await API.post(`/account`, data).then((res) => {
            dispatch({
                type: SET_AUTHDATA,
                data: res.data
            });
            setLoading(false);
        })
    } catch (error) {
      dispatch(errorOn(error.response.data.message));
    }
}

export const getUserProfile = (id) => async (dispatch) => {
    try {
        await API.post(`/profile`, id).then((res) => {
            dispatch({ type: SET_PROFILE, data: res.data });
        })
    } catch (error) {
        dispatch(errorOn(error.response.data.message));
        console.log(error)
    }
}
