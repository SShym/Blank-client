import '../Comments/Comments.css';
import { gapi } from 'gapi-script';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ReactComponent as ImageSvg } from '../../png/image.svg';
import { commentCreate, commentUpdate } from "../../redux/actions";
import { CommentsBackground, FormComments } from '../styles/homestyles';
import loader from '../../png/loaderGear.svg';
import Layout from '../styles/Layout';
import SingleComment from "../SingleComment/SingleComment";
import Pagination from '../Pagination';

export default function Comments({ setTrackLocation, page }){
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [id, setId] = useState('');
    const [textComment, setTextComment] = useState('');
    const [editText, setEditText] = useState('');
    const [photo, setPhoto] = useState({ photoBase64: '', file: null });
    const [editPhoto, setEditPhoto] = useState({ photoBase64: '', file: null });
    const [editMode, setEditMode] = useState(false);

    const dispatch = useDispatch();
    const location = useLocation();
    
    const comments = useSelector(state => state.commentReducer.comments);
    const disabled = useSelector(state => state.appReducer.disabled);
    const loading = useSelector(state => state.appReducer.loading);
    const error = useSelector(state => state.appReducer.error);
    const numberOfPages = useSelector((state) => state.commentReducer.numberOfPages);

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
                page,
                comments
            }));
        } else {
            e.preventDefault();
        }
    }

    const handleUpdate = (e) => {
        if(editText.length >= 1){
            e.preventDefault();
            dispatch(commentUpdate({ 
                photo: editPhoto.photoBase64.length > 0 ? editPhoto : photo,
                name: user?.result?.name, 
                avatar: user?.result.avatar ? user?.result.avatar : user?.result.imageUrl,
                setTextComment,
                setEditText,
                setPhoto,
                setEditPhoto,
                setEditMode,
            }, editText, id,
            ));
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

    return(
        <Layout>
            <CommentsBackground>
                <div className='comments-wrap'>
                    <div>
                        {editMode ?
                            <FormComments>
                                <form style={{position:'relative'}} onSubmit={handleUpdate}>
                                    <input disabled={disabled || user == null || error} type="text" value={editText} className={editPhoto || photo ? 'comments-item-create-input-border0' : 'comments-item-create-input'} onChange={(e) => setEditText(e.target.value)}/>
                                    <input disabled={disabled || user == null || error} name="file" id="file" className='comments-item-select-img' type="file" accept="image/png, image/gif, image/jpeg" onChange={handleOnChange} />
                                    { (disabled || loading) &&
                                        <img className='comments-item-loader' src={loader} alt="" />
                                    } 
                                    <label for="file">
                                        <ImageSvg className='comments-item-select-img-svg' />
                                    </label>
                                    <div className={!editPhoto.photoBase64 ? `none` : 'comments-item-img-preview-wrap'}>
                                        <img className='comments-item-img-preview' src={editPhoto.photoBase64} alt="" />
                                        {!disabled && 
                                            <div onClick={() => setEditPhoto({photoBase64: ''})} className='comments-item-close-svg'>×</div>
                                        }
                                    </div>
                                    <input type="submit" hidden/>
                                </form>
                            </FormComments> :
                            <FormComments>
                                <form style={{position:'relative'}} onSubmit={handleSubmit}>
                                    <input disabled={disabled || loading || user == null || error} value={textComment} className={editPhoto || photo ? 'comments-item-create-input-border0' : 'comments-item-create-input'} placeholder={!disabled || !loading ? 'Message' : 'Loading...'} onChange={handleChange} type="text" />
                                    <input disabled={disabled || loading || user == null || error} name="file" id="file" className='comments-item-select-img' type="file" accept="image/png, image/gif, image/jpeg" onChange={handleOnChange} />
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
                            <img className='comments-item-img-preview' src={photo.photoBase64} alt="" />
                            {!disabled && 
                                <div onClick={() => setPhoto('')} className='comments-item-close-svg'>×</div>
                            }
                        </div>   
                    </div>
                    <div className={(editPhoto?.photoBase64 || photo?.photoBase64) ? 'comments-block-editMode' : 'comments-block'}>
                        {!!comments.length && comments.map(res => {
                            return(
                                <div>
                                    <SingleComment 
                                        page={page}
                                        disabled={disabled}
                                        loading={loading}
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
                    {numberOfPages ?
                        <div className='pagination-block'>
                            <Pagination 
                                setEditPhoto={setEditPhoto} 
                                setEditMode={setEditMode} 
                                setEditText={setEditText}
                                disabled={disabled} 
                                loading={loading} 
                                page={page} 
                            />
                        </div>
                        : ''
                    }
                </div>
            </CommentsBackground>
        </Layout>
    )
}