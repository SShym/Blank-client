import './SinglePrivateComment.css';
import { useDispatch, useSelector } from "react-redux";
import { SET_IMAGE_LOAD_TRUE } from '../../redux/actions';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from "react";
import { SingleCom } from '../styles/homestyles';
import Backdrop from '@mui/material/Backdrop';

const SinglePrivateComment = ({ comments, photoSize }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [fullScreenPhoto, setFullScreenPhoto] = useState('');
    const [openBackDrop, setOpenBackDrop] = useState(false);

    const dispatch = useDispatch();
    
    const imageLoad = useSelector(state => state.appReducer.imageLoad);
    const matches = useMediaQuery('(min-width: 460px)');
    const mobileMatches = useMediaQuery('(min-width: 576px)');

    const handleClose = () => setOpenBackDrop(false);

    return(
        <SingleCom>
            <div className='single-comment-wrap creator'>                    
                    {comments.creator === (user.result.googleId ? user.result.googleId : user.result._id) 
                     ?  <div className='rightBlock'>
                        <form className='single-comment right'>
                                <Backdrop transitionDuration={350}
                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                    open={openBackDrop}
                                    onClick={handleClose}
                                >
                                    <img style={{maxHeight:'70%', maxWidth:'70%'}} src={fullScreenPhoto} alt="" />
                                    <div className='single-private-comment-block'></div>
                                </Backdrop>
                                <div className='single-comment-block-BtnAndText'>
                                    <div className='single-comment-text'>
                                        <div className='single-comment-message'>{comments.comment}</div>
                                        {comments.changed && <div className="single-comment-changed-status-true">изменено в {comments.timeChanged}</div>}
                                        {!comments.changed && <div className="single-comment-time-create">{comments.timeCreate}</div>}
                                        <input type='submit' hidden />
                                    </div>
                                </div>
                            { comments.photo &&
                            <div className='single-comment-img'>
                                <div style={{ position:'relative' }}>
                                    <img style={{
                                            display: imageLoad ? "block" : "none",
                                            
                                            height: `${
                                                mobileMatches ? photoSize?.height*0.7
                                                : matches ? photoSize?.height*0.6
                                                : photoSize?.height*0.5
                                            }px`,
                                            
                                            width: `${
                                                mobileMatches ? photoSize?.width*0.7 
                                                : matches ? photoSize?.width*0.6
                                                : photoSize?.width*0.5
                                            }px`,
                                        }}
                                        onLoad={() => dispatch({ type: SET_IMAGE_LOAD_TRUE })} 
                                        src={comments.photo} 
                                        alt="" 
                                    />
                                    <div className='single-private-comment-block' onClick={() => {
                                        if(matches){
                                            setFullScreenPhoto(comments.photo);
                                            setOpenBackDrop(true);
                                        }
                                    }}>
                                    </div>
                                </div>
                                <div className='skeleton' style={{
                                    display: imageLoad ? "none" : "block",

                                    height: `${
                                        mobileMatches ? photoSize?.height*0.7
                                        : matches ? photoSize?.height*0.6
                                        : photoSize?.height*0.5
                                    }px`,
                                    
                                    width: `${
                                        mobileMatches ? photoSize?.width*0.7 
                                        : matches ? photoSize?.width*0.6
                                        : photoSize?.width*0.5
                                    }px`,
                                }}>
                                </div>
                            </div>
                        }
                        </form> 
                        </div>
                     :  <form className='single-comment left'>
                            <div className='single-comment-block-BtnAndText'>
                                <Backdrop transitionDuration={350}
                                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                                    open={openBackDrop}
                                    onClick={handleClose}
                                >
                                    <img style={{maxHeight:'70%', maxWidth:'70%'}} src={fullScreenPhoto} alt="" />
                                    <div className='single-private-comment-block'></div>
                                </Backdrop>  
                                <div className='single-comment-text'>
                                    <div className='single-comment-message'>{comments.comment}</div>
                                    {comments.changed && <div className="single-comment-changed-status-true">изменено в {comments.timeChanged}</div>}
                                    {!comments.changed && <div className="single-comment-time-create">{comments.timeCreate}</div>}
                                    <input type='submit' hidden />
                                </div>
                            </div>
                            { comments.photo &&
                            <div className='single-comment-img'>
                                <div style={{ position:'relative' }}>
                                    <img style={{
                                            display: imageLoad ? "block" : "none",
                                            
                                            height: `${
                                                mobileMatches ? photoSize?.height*0.7
                                                : matches ? photoSize?.height*0.6
                                                : photoSize?.height*0.5
                                            }px`,
                                            
                                            width: `${
                                                mobileMatches ? photoSize?.width*0.7 
                                                : matches ? photoSize?.width*0.6
                                                : photoSize?.width*0.5
                                            }px`,
                                        }}
                                        onLoad={() => dispatch({ type: SET_IMAGE_LOAD_TRUE })} 
                                        src={comments.photo} 
                                        alt="" 
                                    />
                                    <div className='single-private-comment-block' onClick={() => {
                                        if(matches){
                                            setFullScreenPhoto(comments.photo);
                                            setOpenBackDrop(true);
                                        }
                                    }}>
                                    </div>
                                </div>
                                <div className='skeleton' style={{
                                    display: imageLoad ? "none" : "block",

                                    height: `${
                                        mobileMatches ? photoSize?.height*0.7
                                        : matches ? photoSize?.height*0.6
                                        : photoSize?.height*0.5
                                    }px`,
                                    
                                    width: `${
                                        mobileMatches ? photoSize?.width*0.7 
                                        : matches ? photoSize?.width*0.6
                                        : photoSize?.width*0.5
                                    }px`,
                                }}>
                                </div>
                            </div>
                        }
                        </form>
                    }
                </div>
        </SingleCom>
    )
}

export default SinglePrivateComment;