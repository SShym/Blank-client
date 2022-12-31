import '../SingleComment/SingleComment.css';
import deleteSvg from '../../png/trash.svg';
import editSvg from '../../png/edit.svg';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentDelete, SET_IMAGE_LOAD_TRUE } from "../../redux/actions";
import { gapi } from 'gapi-script';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../styles/Layout';
import { CommentsPage } from '../styles/homestyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';
import Modal from '../Modal/Modal';
import Backdrop from '@mui/material/Backdrop';

export default function SingleComment({socket, page, comments, photoSize, setId, setEditText, setEditMode, setEditPhoto, setPhoto, disabled, loading }){
    document.body.className = localStorage.getItem('theme');
    const [commentText, setCommentText] = useState(comments.comment);
    const [openBackDrop, setOpenBackDrop] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [modal, setModal] = useState(false);
    const [fullScreenPhoto, setFullScreenPhoto] = useState('');
    
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const imageLoad = useSelector(state => state.appReducer.imageLoad);
    const matches = useMediaQuery('(min-width: 460px)');
    const mobileMatches = useMediaQuery('(min-width: 576px)');

    useEffect(() => {
        gapi.load('client:auth2', ()=>{
          gapi.client.init({
            clientId: '733992931171-gjd9utoojt376cq1b0l9ut8prvikebbn.apps.googleusercontent.com',
            scope: 'email',
          });
        });
    
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    useEffect(() => {
        comments.comment && setCommentText(comments.comment);
    }, [comments.comment])

    const handleInput = (e) => setCommentText(e.target.value);

    const handleClose = () => setOpenBackDrop(false);
    
    const handleDelete = (e) => {
        if(!disabled || !loading) {
            e.preventDefault();
            dispatch(commentDelete(socket, commentText, comments.id, setEditMode, setModal, page, navigate));
        }
    }

    const redirectToProfile = () => navigate(`/profile/${comments.creator}`);
    
    return (
        <Layout>
            <CommentsPage photoSize={photoSize}>
                <div className='single-comment-wrap'>
                    <Backdrop transitionDuration={350}
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={openBackDrop}
                        onClick={handleClose}
                    >
                        <img style={{maxHeight:'70%', maxWidth:'70%'}} src={fullScreenPhoto} alt="" />
                        <div className='single-comment-block-black'></div>
                    </Backdrop>
                    <div style={{ cursor:'pointer' }} className="single-comment-avatar" onClick={redirectToProfile}>
                        <div>
                            {!comments.avatar 
                                ? <div className='single-comment-without-profileImg'>{comments.name.charAt(0)}</div>  
                                : <img className='single-comment-profile-img' src={comments.avatar} alt="" />
                            }
                        </div>
                        <div className='single-comment-block'></div>
                    </div>
                    <form className='single-comment'>
                        <div className='single-comment-block-BtnAndText'>
                            <div className='single-comment-text'>
                                <div className='single-comment-message' onChange={handleInput}>{commentText}</div>
                                {comments.changed && <div className="single-comment-changed-status-true">изменено в {comments.timeChanged}</div>}
                                {!comments.changed && <div className="single-comment-time-create">{comments.timeCreate}</div>}
                                <input type='submit' hidden />
                            </div>
                            { (user?.result?.googleId === comments?.creator || user?.result?._id === comments?.creator) && user != null &&
                            <div className='single-comment-buttons'>
                                <div onClick={() => {
                                    if(!disabled && user != null && !loading ){
                                        setModal(true);
                                    }
                                }} className='single-comment-delete'>
                                    <img className='svgDelete' src={deleteSvg} alt="" />
                                </div>
                                <div onClick={() => {
                                    if(!disabled && user != null && !loading){
                                        setEditText(commentText);
                                        setId(comments.id);
                                        setEditMode(true);
                                        setEditPhoto({
                                            photoBase64: comments.photo ? comments.photo : ''
                                        });
                                        setPhoto('');
                                    }
                                }} className='single-comment-edit'>
                                    <img className='svgEdit' src={editSvg} alt="" />
                                </div>
                            </div>
                            }
                        </div>
                        { comments.photo &&
                            <div className='single-comment-img'>
                                <img style={{
                                        display: imageLoad ? "block" : "none",
                                        
                                        height: `${
                                            mobileMatches ? photoSize?.height*2.4 
                                            : matches ? photoSize?.height*2
                                            : photoSize?.height*1.2
                                        }px`,
                                        
                                        width: `${
                                            mobileMatches ? photoSize?.width*2.4 
                                            : matches ? photoSize?.width*2
                                            : photoSize?.width*1.2
                                        }px`,
                                    }} 
                                    onLoad={() => dispatch({ type: SET_IMAGE_LOAD_TRUE })} 
                                    src={comments.photo} 
                                    alt="" 
                                />
                                <div style={{cursor:'pointer'}} onClick={() => {
                                    if(matches){
                                        setFullScreenPhoto(comments.photo);
                                        setOpenBackDrop(true);
                                    }
                                }} className='single-comment-block-photo'></div>
                                <div className='skeleton' style={{
                                    display: imageLoad ? "none" : "block",

                                    height: `${
                                        mobileMatches ? photoSize?.height*2.4 
                                        : matches ? photoSize?.height*2
                                        : photoSize?.height*1.2
                                    }px`,
                                        
                                    width: `${
                                        mobileMatches ? photoSize?.width*2.4 
                                        : matches ? photoSize?.width*2
                                        : photoSize?.width*1.2
                                    }px`,
                                }}>
                                </div>
                            </div>
                        }
                        <Modal 
                            modal={modal} 
                            setModal={setModal} 
                            matches={matches}
                            disabled={disabled}
                            handleDelete={handleDelete}
                        />
                    </form>
                </div>
            </CommentsPage>
        </Layout>
    )
}