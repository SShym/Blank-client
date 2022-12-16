import '../SingleComment/SingleComment.css'
import 'react-pure-modal/dist/react-pure-modal.min.css';
import deleteSvg from '../../png/trash.svg'
import editSvg from '../../png/edit.svg'
import PureModal from 'react-pure-modal';
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { commentDelete, SET_IMAGE_LOAD_TRUE } from "../../redux/actions";
import { gapi } from 'gapi-script';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../styles/Layout';
import { CommentsPage } from '../styles/homestyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';

export default function SingleComment({page, comments, photoSize, setId, setEditText, setEditMode, setEditPhoto, setPhoto, disabled, loading }){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [modal, setModal] = useState(false);
    const [commentText, setCommentText] = useState('');
    
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

    document.body.className = localStorage.getItem('theme');

    useEffect(()=> {
        comments.comment && setCommentText(comments.comment);
    }, [comments.comment])

    const handleInput = (e) => setCommentText(e.target.value);
    
    const handleDelete = (e) => {
        if(!disabled || !loading) {
            e.preventDefault();
            dispatch(commentDelete(commentText, comments.id, setEditMode, setModal, page, navigate));
        }
    }

    const redirectToProfile = () => navigate(`/profile/${comments.id}`);

    return (
        <Layout>
            <CommentsPage>
                <div className='single-comment-wrap'>
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
                                    onLoad={() => dispatch({type: SET_IMAGE_LOAD_TRUE})} 
                                    src={comments.photo} 
                                    alt="" 
                                />
                                <div className='single-comment-block-photo'></div>
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
                        <PureModal 
                            header={
                                <div style={{textAlign:'center'}}>
                                    Сonfirmation
                                </div>
                            }
                            footer={
                                <div >
                                    { matches ?
                                        <div style={{ display:'flex', justifyContent:'space-around', textAlign:'center' }}>
                                            <Button disabled={disabled} style={{fontFamily:'sans-serif', fontSize:'13px' }} onClick={()=>setModal(false)} variant="outlined">
                                                cancel
                                            </Button>   
                                            {disabled ?
                                                <Button style={{fontFamily:'sans-serif', fontSize:'12px' }} onClick={handleDelete} variant="outlined">
                                                    <CircularProgress sx={{ display:'flex', flexDirection:'column', justifyContent:'center', mr: 1}} size={15} />
                                                    delete
                                                </Button> 
                                                :
                                                <Button style={{fontFamily:'sans-serif', fontSize:'13px' }} onClick={handleDelete} variant="outlined">
                                                    delete
                                                </Button>   
                                            }
                                        </div>
                                    :
                                        <div style={{display:'flex', justifyContent:'space-around', textAlign:'center'}}>
                                            <Button disabled={disabled} style={{fontFamily:'sans-serif', fontSize:'10px' }} onClick={()=>setModal(false)} variant="outlined">
                                                cancel
                                            </Button>   
                                            {disabled ?
                                                <Button style={{fontFamily:'sans-serif', fontSize:'10px' }} onClick={handleDelete} variant="outlined">
                                                    <CircularProgress sx={{ display:'flex', flexDirection:'column', justifyContent:'center', mr: 1}} size={15} />
                                                    delete
                                                </Button> 
                                                :
                                                <Button style={{fontFamily:'sans-serif', fontSize:'10px' }} onClick={handleDelete} variant="outlined">
                                                    delete
                                                </Button>   
                                            }
                                        </div>
                                    }
                                </div>
                            }
                            width={ matches ? '415px' : '300px' }
                            isOpen={modal} 
                            onClose={() => {
                                if(!disabled){
                                    setModal(false);
                                    return true;
                                }
                            }}
                            >
                            { matches ?
                                <div style={{ textAlign:'center', fontFamily:'Georgia', letterSpacing:'0.3px', padding:'5px 0px' }}>Delete the message?</div>
                                : <div style={{ textAlign:'center', fontSize:'14px', fontFamily:'Georgia', letterSpacing:'0.3px', padding:'5px 0px' }}>Delete the message?</div>
                            }
                        </PureModal>
                    </form>
                </div>
            </CommentsPage>
        </Layout>
    )
}