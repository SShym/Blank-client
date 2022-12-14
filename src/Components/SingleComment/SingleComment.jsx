import '../SingleComment/SingleComment.css'
import 'react-pure-modal/dist/react-pure-modal.min.css';
import deleteSvg from '../../png/trash.svg'
import editSvg from '../../png/edit.svg'
import PureModal from 'react-pure-modal';
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { commentDelete } from "../../redux/actions";
import { gapi } from 'gapi-script';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../styles/Layout';
import { CommentsPage } from '../styles/homestyles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

export default function SingleComment({page, comments, setId, setEditText, setEditMode, setEditPhoto, setPhoto, disabled, loading }){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [modal, setModal] = useState(false);
    const [commentText, setCommentText] = useState('');

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const matches = useMediaQuery('(min-width: 442px)');
    
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

    return (
        <Layout>
            <CommentsPage>
                <div className='single-comment-wrap'>
                    <div>
                        {!comments.avatar 
                            ? <div className='single-comment-without-profileImg'>{comments.name.charAt(0)}</div>  
                            : <img className='single-comment-profile-img' src={comments.avatar} alt="" />
                        }
                    </div>
                    <form className='single-comment'>
                        <div className='single-comment-block-BtnAndText'>
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
                            <div className='single-comment-text'>
                                <div onChange={handleInput}>{commentText}</div>
                                {comments.changed && <div className="single-comment-changed-status-true">изменено в {comments.timeChanged}</div>}
                                {!comments.changed && <div className="single-comment-time-create">{comments.timeCreate}</div>}
                                <input type='submit' hidden />
                            </div>
                        </div>
                        { comments.photo && 
                            <div className='single-comment-img'>
                                <img src={comments.photo} alt="" />
                            </div>
                        }
                        <PureModal 
                            header={
                                <div style={{textAlign:'center'}}>
                                    Сonfirmation
                                </div>
                            }
                            footer={
                                <div>
                                    { matches ?
                                        <div style={{display:'flex', justifyContent:'space-around', textAlign:'center'}}>
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
                            width={ matches ? '415px' : '325px' }
                            isOpen={modal} 
                            onClose={() => {
                                if(!disabled){
                                    setModal(false);
                                    return true;
                                }
                            }}
                            >
                            { matches ?
                                <div style={{ fontFamily:'Georgia', letterSpacing:'0.3px', padding:'5px 0px' }}>Are you sure you want to delete the message?</div>
                                : <div style={{ fontSize:'14px', fontFamily:'Georgia', letterSpacing:'0.3px', padding:'5px 0px' }}>Are you sure you want to delete the message?</div>
                            }
                        </PureModal>
                    </form>
                </div>
            </CommentsPage>
        </Layout>
    )
}