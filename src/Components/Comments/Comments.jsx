import '../Comments/Comments.css';
import { gapi } from 'gapi-script';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as ImageSvg } from '../../png/image.svg';
import { commentCreate, commentUpdate } from "../../redux/actions";
import { CommentsBackground, FormComments } from '../styles/homestyles';
import closeSvg from '../../png/close.svg';
import loader from '../../png/loader.gif';
import Layout from '../styles/Layout';
import SingleComment from "../SingleComment/SingleComment";

export default function Comments({ setTrackLocation }){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [id, setId] = useState('');
    const [textComment, setTextComment] = useState('');
    const [editText, setEditText] = useState('');
    const [photo, setPhoto] = useState('');
    const [editPhoto, setEditPhoto] = useState('');
    const [editMode, setEditMode] = useState(false);

    const dispatch = useDispatch();
    const location = useLocation();
    
    const comments = useSelector(state => state.commentReducer.comments);
    const disabled = useSelector(state => state.appReducer.disabled);
    const loading = useSelector(state => state.appReducer.loading);

    useEffect(() => {
      gapi.load('client:auth2', ()=>{
        gapi.client.init({
          clientId: '733992931171-gjd9utoojt376cq1b0l9ut8prvikebbn.apps.googleusercontent.com',
          scope: 'email',
        });
      });
  
      setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    const handleChange = (e) => setTextComment(e.target.value)

    // eslint-disable-next-line
    useEffect(() => setTrackLocation(location.pathname), []);

    const handleSubmit = (e) => {
        if(textComment.length >= 1){
            e.preventDefault();
            dispatch(commentCreate({
                comment: textComment, 
                photo: photo, 
                name: user?.result?.name,
                avatar: user?.result.avatar ? user?.result.avatar : user?.result.imageUrl,
                setTextComment,
                setEditText,
                setPhoto
            }));
        } else {
            e.preventDefault();
        }
    }

    const handleUpdate = (e) => {
        if(editText.length >= 1){
            e.preventDefault();
            dispatch(commentUpdate({ 
                name: user?.result?.name, 
                avatar: user?.result.avatar ? user?.result.avatar : user?.result.imageUrl,
                setTextComment,
                setEditText,
                setPhoto,
                setEditPhoto,
                setEditMode
            }, editText, id, editPhoto.length > 0 ? editPhoto : photo));
        } else {
            e.preventDefault();
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
            if(editPhoto.length > 0){
                setEditPhoto(reader.result)
            } else if(editPhoto.length <= 0 && !photo) {
                setPhoto(reader.result)
            } else if(photo){
                setPhoto(reader.result)
            }
        }
    }

    return(
        <Layout>
            <CommentsBackground>
                <div>
                    <div>
                        {editMode ?
                            <FormComments>
                                <form onSubmit={handleUpdate}>
                                    <input disabled={disabled || user == null} type="text" value={editText} className={editPhoto || photo ? 'comments-item-create-input-border0' : 'comments-item-create-input'} onChange={(e) => setEditText(e.target.value)}/>
                                    <input disabled={disabled || user == null} name="file" id="file" className='comments-item-select-img' type="file" multiple onChange={handleOnChange} />
                                    { disabled &&
                                        <img className='comments-item-disabled' src={loader} alt="" />
                                    }
                                    <label for="file">
                                        <ImageSvg className='comments-item-select-img-svg' />
                                    </label>
                                    <div className={!editPhoto ? `none` : 'comments-item-img-preview-wrap'}>
                                        <img className='comments-item-img-preview' src={editPhoto} alt="" />
                                        {!disabled && 
                                            <img onClick={()=>setEditPhoto('')} className='comments-item-close-svg' src={closeSvg} alt="" />
                                        }
                                    </div>
                                    <input type="submit" hidden/>
                                </form>
                            </FormComments> :
                            <FormComments>
                                <form onSubmit={handleSubmit}>
                                    <input disabled={disabled || loading || user == null} value={textComment} className={editPhoto || photo ? 'comments-item-create-input-border0' : 'comments-item-create-input'} placeholder={!disabled ? 'Сообщение' : 'загрузка'} onChange={handleChange} type="text" />
                                    <input disabled={disabled || loading || user == null} name="file" id="file" className='comments-item-select-img' type="file" multiple onChange={handleOnChange} />
                                    { disabled &&
                                        <img className='comments-item-disabled' src={loader} alt="" />
                                    } 
                                    <label for="file">
                                        <ImageSvg className='comments-item-select-img-svg' />
                                    </label>
                                    <input type="submit" hidden />
                                </form>
                            </FormComments>
                        }
                        <div className={!photo ? `none` : 'comments-item-img-preview-wrap'}>            
                            <img className='comments-item-img-preview' src={photo} alt="" />
                            {!disabled && 
                                <img onClick={()=>setPhoto('')} className='comments-item-close-svg' src={closeSvg} alt="" />
                            }
                        </div>   
                    </div>
                    <div>
                        {!!comments.length && comments.map(res => {
                            return(
                                <div>
                                    <SingleComment 
                                        disabled={disabled}
                                        comments={res} 
                                        setId={setId} 
                                        setEditText={setEditText} 
                                        setEditMode={setEditMode}
                                        setPhoto={setPhoto}
                                        setEditPhoto={setEditPhoto}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CommentsBackground>
        </Layout>
    )
}