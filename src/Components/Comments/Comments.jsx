import '../Comments/Comments.css';
import { gapi } from 'gapi-script';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import profile from '../../png/user.svg'
import { ReactComponent as ImageSvg } from '../../png/image.svg';
import { commentCreate, commentUpdate, getUsersOnline, getAllUsers } from "../../redux/actions";
import { CommentsBackground, FormComments } from '../styles/homestyles';
import loader from '../../png/loaderGear.svg';
import Layout from '../styles/Layout';
import SingleComment from "../SingleComment/SingleComment";
import { useRef } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Backdrop from '@mui/material/Backdrop';
import Avatar from '@mui/material/Avatar';

export default function Comments({ socket, setTrackLocation }){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [id, setId] = useState('');
    const [textComment, setTextComment] = useState('');
    const [editText, setEditText] = useState('');
    const [photo, setPhoto] = useState({ photoBase64: '', file: null });
    const [photoSize, setPhotoSize] = useState({width: '', height: ''});
    const [editPhoto, setEditPhoto] = useState({ photoBase64: '', file: null });
    const [editMode, setEditMode] = useState(false);
    const [open, setOpen] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const commentsRef = useRef(null);
    const matches = useMediaQuery('(max-width: 576px)');

    const usersOnline = useSelector(state => state.profileReducer.usersOnline);
    const comments = useSelector(state => state.commentReducer.comments);
    const allProfiles = useSelector(state => state.profileReducer.allProfiles);
    const disabled = useSelector(state => state.appReducer.disabled);
    const loading = useSelector(state => state.appReducer.loading);
    const error = useSelector(state => state.appReducer.error);

    useEffect(() => {
        setTimeout(() => {
            commentsRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 0);
    }, [comments])

    useEffect(() => {
      gapi.load('client:auth2', ()=>{
        gapi.client.init({
          clientId: '733992931171-gjd9utoojt376cq1b0l9ut8prvikebbn.apps.googleusercontent.com',
          scope: 'email',
        });
      });
  
      setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const handleChange = (e) => (!disabled && !loading) && setTextComment(e.target.value);

    useEffect(() => {
        setTrackLocation(location.pathname);
        dispatch(getUsersOnline(user, socket));
    }, []);  // eslint-disable-line

    const handleSubmit = (e) => {
        e.preventDefault();
        if(textComment.length >= 1 && !disabled && !loading){
            const date = String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0');

            const formData = {
                comment: textComment, 
                photo: photo.file || photo.photoBase64, 
                photoSize,
                name: user.result.name,
                avatar: user.result.avatar,
                timeCreate: date,
                changed: false, 
            }
            
            dispatch(commentCreate(formData, {
                setTextComment,
                setEditText,
                setPhoto,
                socket,
                comments
            }));
        }
    }

    const handleUpdate = (e) => {
        e.preventDefault();
        if(editText.length >= 1){
            const date = String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0');

            const formData = {
                comment: editText,
                photo: (!(editPhoto.photoBase64.length > 0 ? editPhoto : photo) || (editPhoto.photoBase64.length > 0 ? editPhoto : photo)?.photoBase64?.length === 0) ? '' : (editPhoto.photoBase64.length > 0 ? editPhoto : photo).file,
                photoSize,
                name: user.result.name, 
                avatar: user.result.avatarl,
                changed: true, 
                timeChanged: date
            }

            dispatch(commentUpdate(formData, { 
                id,
                socket,
                setTextComment,
                setEditText,
                setPhoto,
                setEditPhoto,
                setEditMode,
            }));
        }
    }

    const handleOnChange = (e) => {
        const file = e.target.files[0];
        setFileToBase(file);
    }

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            if(editPhoto.photoBase64.length > 0){
                setEditPhoto({
                    photoBase64: reader.result,
                    file: file
                })
            } else if(editPhoto.photoBase64.length <= 0 && !photo.photoBase64) {
                setPhoto({
                    photoBase64: reader.result,
                    file: file
                })
            } else if(photo.photoBase64){
                setPhoto({
                    photoBase64: reader.result,
                    file: file
                })
            }
        }
    }

    const onImgLoad = (e) => {
        setPhotoSize({
            width: e.target.offsetWidth,
            height: e.target.offsetHeight
        });
    }

    return(
        <Layout>
            <CommentsBackground>
                <div className='comments-wrap'>
                    <div>
                        {editMode ?
                            <FormComments>
                                <form style={{position:'relative'}} onSubmit={handleUpdate}>
                                    <input disabled={disabled || user == null || error} type="text" value={editText} className={editPhoto || photo ? 'comments-item-create-input-border0' : 'comments-item-create-input'} onChange={(e) => setEditText(e.target.value)}/>
                                    <input onClick={(e) => e.currentTarget.value = null} disabled={disabled || user == null || error} name="file" id="file" className='comments-item-select-img' type="file" accept="image/png, image/gif, image/jpeg" onChange={handleOnChange} />
                                    { (disabled || loading) &&
                                        <img className='comments-item-loader' src={loader} alt="" />
                                    } 
                                    <label for="file">
                                        <ImageSvg className='comments-item-select-img-svg' />
                                    </label>
                                    <div className={!editPhoto.photoBase64 ? `none` : 'comments-item-img-preview-wrap'}>
                                        <div style={{ position:'relative', display:'flex' }}>         
                                            <img onLoad={onImgLoad} className='comments-item-img-preview' src={editPhoto.photoBase64} alt="" />
                                            <div className='comments-block-black'></div>
                                        </div>
                                        {!disabled && 
                                            <div onClick={() => setEditPhoto({photoBase64: ''})} className='comments-item-close-svg'>×</div>
                                        }
                                    </div>
                                    <input type="submit" hidden/>
                                </form>
                            </FormComments> :
                            <FormComments>
                                <form style={{position:'relative'}} onSubmit={handleSubmit}>
                                    <input autoFocus disabled={user == null} value={textComment} className={editPhoto || photo ? 'comments-item-create-input-border0' : 'comments-item-create-input'} placeholder={!disabled || !loading ? 'Message' : 'Loading...'} onChange={handleChange} type="text" />
                                    <input onClick={(e) => e.currentTarget.value = null} disabled={disabled || loading || user == null || error} name="file" id="file" className='comments-item-select-img' type="file" accept="image/png, image/gif, image/jpeg" onChange={handleOnChange} />
                                    { (disabled || loading) &&
                                        <img className='comments-item-loader' src={loader} alt="" />
                                    } 
                                    <label for="file">
                                        <ImageSvg className='comments-item-select-img-svg' />
                                    </label>
                                    <input type="submit" hidden />
                                </form>
                            </FormComments>
                        }
                        <div className={!photo.photoBase64 ? `none` : 'comments-item-img-preview-wrap'}>  
                            <div style={{ position:'relative', display:'flex' }}>         
                                <img onLoad={onImgLoad} className='comments-item-img-preview' src={photo.photoBase64} alt="" />
                                <div className='comments-block-black'></div>
                            </div> 
                            {!disabled && 
                                <div onClick={() => setPhoto('')} className='comments-item-close-svg'>×</div>
                            }
                        </div>   
                    </div>
                    <div className='comments-block'>
                        {comments.map(res => {
                            return(
                                <SingleComment 
                                    socket={socket}
                                    disabled={disabled}
                                    loading={loading}
                                    comments={res}
                                    photoSize={res.photoSize} 
                                    setId={setId} 
                                    setEditText={setEditText} 
                                    setEditMode={setEditMode}
                                    setPhoto={setPhoto}
                                    setEditPhoto={setEditPhoto}
                                />
                            )
                        })}
                            <div ref={commentsRef} />
                    </div>
                </div>
                <div className='profilesIcon' onClick={() => {
                    setOpen(!open);
                    dispatch(getAllUsers());
                }}>
                    {!matches && <div className='all-profiles-text'>users</div>}
                    <img src={profile} alt="" />
                </div>
                <Backdrop
                    sx={{
                        display:'flex',
                        alignItems:'center',
                        justifyContent:'center',
                        color: '#fff', 
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                        overflowY:'auto',
                    }}
                    open={open}
                    onClick={() => setOpen(false)}
                >
                    <div style={{ margin: 'auto' }}>
                        {(allProfiles?.length === 0 || allProfiles?.every(profile => profile?.id === (user?.result.googleId ? user?.result.googleId : user?.result._id))) &&
                            <div>
                                There are no other registered users
                            </div>
                        }
                        {allProfiles?.map(profile => profile?.id !== (user?.result.googleId ? user?.result.googleId : user?.result._id) && 
                            <div style={{
                                    display:'flex', 
                                    alignItems:'center', 
                                    background:'rgb(0,0,0,0.5)', 
                                    borderRadius:'20px',
                                    margin:'10px'
                                }}>
                                <div style={{display:'flex', flexBasis:'80%',  alignItems:'center', margin:'10px'}}>
                                    <div style={{
                                        position:'relative', 
                                        display:'flex', 
                                        alignItems:'center',
                                        justifyContent:'center'
                                    }}>
                                        <Avatar 
                                            onClick={() => navigate(`/profile/${profile.id}`)} 
                                            src={profile.avatar} 
                                            sx={{ width: 50, height: 50, cursor:'pointer' }} 
                                        />
                                        {usersOnline.map(user => user.userId === profile.id 
                                            ? <div style={{
                                                position:'absolute',
                                                right:'-2px',
                                                bottom:'0',
                                                borderRadius:'50%',
                                                background:'green',
                                                width:'12px',
                                                height:'12px',
                                                zIndex:'999',
                                            }}></div>
                                            : <div style={{
                                                position:'absolute',
                                                right:'-2px',
                                                bottom:'0',
                                                borderRadius:'50%',
                                                background:'rgb(190, 0, 0)',
                                                width:'12px',
                                                height:'12px',
                                                zIndex:'111',
                                            }}></div>
                                        )}
                                        {usersOnline.length === 0 &&
                                            <div style={{
                                                position:'absolute',
                                                right:'0',
                                                bottom:'0',
                                                borderRadius:'50%',
                                                background:'rgb(190, 0, 0)',
                                                width:'12px',
                                                height:'12px',
                                                zIndex:'999',
                                            }}></div>
                                        }
                                    </div>
                                    <div style={{ 
                                        marginLeft:'8px', 
                                        fontSize:'20px',
                                        userSelect:'none',
                                    }}> {profile.name.slice(0, 10) + '...'}
                                    </div>
                                </div>
                                <div onClick={() => {
                                    if(user){
                                        navigate(`/direct/${profile.id}`)
                                    } else {
                                        navigate(`/auth`)
                                    }
                                }}>
                                    <div style={{
                                        border:'1px solid gray', 
                                        margin:'0px 15px', 
                                        whiteSpace:'nowrap', 
                                        flexBasis:'20%', 
                                        padding:'5px 10px', 
                                        borderRadius:'12px',
                                        cursor:'pointer',
                                        userSelect:'none',
                                        color: 'rgb(217, 217, 217)',
                                    }}>
                                        Send message
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Backdrop>
            </CommentsBackground>
        </Layout>
    )
}