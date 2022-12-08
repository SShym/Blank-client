import '../Comments/Comments.css';
import { gapi } from 'gapi-script';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as ImageSvg } from '../../png/image.svg';
import { commentCreate, commentUpdate } from "../../redux/actions";
import { CommentsBackground, FormComments } from '../styles/homestyles';
import closeSvg from '../../png/close.svg';
import loader from '../../png/loaderGear.svg';
import Layout from '../styles/Layout';
import SingleComment from "../SingleComment/SingleComment";
import Pagination from '../Pagination';

export default function Comments({ setTrackLocation, page }){
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
    const error = useSelector(state => state.appReducer.error);

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
                setPhoto,
                page
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
                                <form style={{position:'relative'}} onSubmit={handleUpdate}>
                                    <input disabled={disabled || user == null || error} type="text" value={editText} className={editPhoto || photo ? 'comments-item-create-input-border0' : 'comments-item-create-input'} onChange={(e) => setEditText(e.target.value)}/>
                                    <input disabled={disabled || user == null || error} name="file" id="file" className='comments-item-select-img' type="file" multiple onChange={handleOnChange} />
                                    { (disabled || loading) &&
                                        <img className='comments-item-loader' src={loader} alt="" />
                                    } 
                                    <label for="file">
                                        <ImageSvg className='comments-item-select-img-svg' />
                                    </label>
                                    <div className={!editPhoto ? `none` : 'comments-item-img-preview-wrap'}>
                                        <img className='comments-item-img-preview' src={editPhoto} alt="" />
                                        {!disabled && 
                                            <div onClick={() => setEditPhoto('')} className='comments-item-close-svg'>×</div>
                                        }
                                    </div>
                                    <input type="submit" hidden/>
                                </form>
                            </FormComments> :
                            <FormComments>
                                <form style={{position:'relative'}} onSubmit={handleSubmit}>
                                    <input disabled={disabled || loading || user == null || error} value={textComment} className={editPhoto || photo ? 'comments-item-create-input-border0' : 'comments-item-create-input'} placeholder={!disabled ? 'Сообщение' : 'загрузка'} onChange={handleChange} type="text" />
                                    <input disabled={disabled || loading || user == null || error} name="file" id="file" className='comments-item-select-img' type="file" multiple onChange={handleOnChange} />
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
                        <div className={!photo ? `none` : 'comments-item-img-preview-wrap'}>            
                            <img className='comments-item-img-preview' src={photo} alt="" />
                            {!disabled && 
                                <div onClick={() => setPhoto('')} className='comments-item-close-svg'>×</div>
                            }
                        </div>   
                    </div>
                    <div className='comments-block'>
                        {!!comments.length && comments.map(res => {
                            return(
                                <div>
                                    <SingleComment 
                                        page={page}
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
                    <div>
                        <Pagination 
                            setEditPhoto={setEditPhoto} 
                            setEditMode={setEditMode} 
                            setEditText={setEditText}
                            disabled={disabled} 
                            loading={loading} 
                            page={page} 
                        />
                    </div>
                </div>
            </CommentsBackground>
        </Layout>
    )
}