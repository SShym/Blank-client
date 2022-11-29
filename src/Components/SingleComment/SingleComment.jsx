import '../SingleComment/SingleComment.css'
import 'react-pure-modal/dist/react-pure-modal.min.css';
import deleteSvg from '../../png/trash.svg'
import editSvg from '../../png/edit.svg'
import PureModal from 'react-pure-modal';
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { commentDelete } from "../../redux/actions";
import { gapi } from 'gapi-script';
import { useLocation } from 'react-router-dom';
import Layout from '../styles/Layout';
import { CommentsPage } from '../styles/homestyles';

export default function SingleComment({comments, setId, setEditText, setEditMode, setEditPhoto, setPhoto, disabled }){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [modal, setModal] = useState(false);
    const [commentText, setCommentText] = useState('');

    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        gapi.load('client:auth2', ()=>{
          gapi.client.init({
            clientId: '733992931171-gjd9utoojt376cq1b0l9ut8prvikebbn.apps.googleusercontent.com',
            scope: 'email',
          });
        });
    
        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);


    useEffect(()=> {
        comments.comment && setCommentText(comments.comment);
    }, [comments.comment])

    const handleInput = (e) => setCommentText(e.target.value);
    
    const handleDelete = (e) => {
        e.preventDefault();
        dispatch(commentDelete(commentText, comments.id));
        setModal(false);
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
                            { (user?.result?.googleId === comments?.creator || user?.result?._id === comments?.creator) &&
                            <div className='single-comment-buttons'>
                                <div onClick={() => {
                                    if(!disabled && user != null){
                                        setModal(true)
                                    }
                                }} className='single-comment-delete'>
                                    <img className='svgDelete' src={deleteSvg} alt="" />
                                </div>
                                <div onClick={() => {
                                    if(!disabled && user != null){
                                        setEditText(commentText);
                                        setId(comments.id);
                                        setEditMode(true);
                                        setEditPhoto(comments.photo);
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
                            header="Сonfirmation"
                            footer={
                                <div style={{display:'flex', justifyContent:'space-around'}}>
                                    <button style={{fontFamily:'sans-serif', borderRadius:'5px', padding:'2px 10px'}} onClick={()=>setModal(false)}>CANCEL</button>
                                    <button style={{fontFamily:'sans-serif', borderRadius:'5px', padding:'2px 10px'}} onClick={handleDelete}>DELETE</button>
                                </div>
                            }
                            width="415px"
                            isOpen={modal} 
                            onClose={() => {
                                setModal(false);
                                return true;
                            }}
                            >
                            <div>Are you sure you want to delete the message?</div>
                        </PureModal>
                    </form>
                </div>
            </CommentsPage>
        </Layout>
    )
}