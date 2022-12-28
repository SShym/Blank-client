import './SinglePrivateComment.css';
import { useDispatch, useSelector } from "react-redux";
import deleteSvg from '../../png/trash.svg';
import editSvg from '../../png/edit.svg';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from "react";

const SinglePrivateComment = ({ comments }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    
    const dispatch = useDispatch();
    
    const imageLoad = useSelector(state => state.appReducer.imageLoad);
    const matches = useMediaQuery('(min-width: 460px)');
    const mobileMatches = useMediaQuery('(min-width: 576px)');

    return(
        <div>
            <div className='single-comment-wrap creator'>                    
                    {comments.creator === (user.result._id ? user.result._id : user.result.googleId) 
                     ?  <div className='rightBlock'>
                        <form className='single-comment right'>
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
                                    <img style={{maxWidth:'400px'}} src={comments.photo} alt="" />
                                </div>
                            }
                        </form> 
                        </div>
                     :  <form className='single-comment left'>
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
                                    <img style={{maxWidth:'400px'}} src={comments.photo} alt="" />
                                </div>
                            }
                        </form>
                    }
                </div>
        </div>
    )
}

export default SinglePrivateComment;