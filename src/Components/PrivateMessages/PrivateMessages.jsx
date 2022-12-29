import './PrivateMessages.css';
import { ReactComponent as Emoji } from '../../png/emoji.svg';
import { ReactComponent as Voice } from '../../png/voice.svg';
import { ReactComponent as Clip } from '../../png/clip.svg';
import { ReactComponent as Image } from '../../png/image.svg';
import { ReactComponent as File } from '../../png/file.svg';
import { ReactComponent as FileMulticolor } from '../../png/filemulticolor.svg';
import { PrivateMessagesBackground, theme } from '../styles/homestyles';
import { commentCreateDirect, commentsLoadDirect, deleteDirectChat, getUserProfile, getUsersOnline } from '../../redux/actions';
import SinglePrivateComment from '../SinglePrivateComment/SinglePrivateComment';
import Layout from '../styles/Layout';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useEffect, useRef, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import LinearProgress from '@mui/material/LinearProgress';

const PrivateMessages = ({ socket }) => {   
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    
    const [open, setOpen] = useState(false);
    const [emojienable, SetEmojiEnable] = useState(false);
    const [fileuploadenable, setFileUploadEnable] = useState(false);
    const [chatSettings, setChatSettings] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState('');
    const [comment, setComment] = useState({ commentText: '', photoFile: null });
    const [photoSize, setPhotoSize] = useState({width: '', height: ''});

    const param = useParams();
    const dispatch = useDispatch();
    const commentsDirectRef = useRef(null);

    const profile = useSelector(state => state.authReducer.profile);
    const usersOnline = useSelector(state => state.authReducer.usersOnline);
    const commentsDirect = useSelector(state => state.commentReducer.commentsDirect);
    const disabled = useSelector(state => state.appReducer.disabled);

    ///// modal with img ////
    useEffect(() => {
        if(comment.photoFile){
            setOpen(true);
            setFileUploadEnable(false);
        }   
    }, [comment.photoFile])

    useEffect(() => {
        dispatch(getUserProfile(param.id));
        dispatch(getUsersOnline(user, socket));
        dispatch(commentsLoadDirect(socket, room));
        return () => {
            socket.emit("leave-room", room);
            dispatch(commentsLoadDirect(socket, []));
        }
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [commentsDirect])

    const room = orderIds(user.result.googleId ? user.result.googleId : user.result._id, param.id);

    function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 + "-" + id2;
        } else {
            return id2 + "-" + id1;
        }
    }
    
    const scrollToBottom = () => commentsDirectRef.current?.scrollIntoView();

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setComment({
                commentText: comment.commentText,
                photoFile: file
            })
            setPreviewPhoto(reader.result)
        }
    }

    const handleDeleteChat = async () => {
        dispatch(deleteDirectChat(socket, room, setChatSettings))
    }
    
    function isFileImage(file) {
        const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        return file && acceptedImageTypes.includes(file['type'])
    }

    const handleOnChange = (e) => {
        const file = e.target.files[0];
        setFileToBase(file);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const date = String(new Date().getHours()).padStart(2, '0') + ':' + String(new Date().getMinutes()).padStart(2, '0');
        
        const formData = {
            comment: comment.commentText, 
            photo: comment.photoFile,
            photoSize: photoSize,
            timeCreate: date,
            name: user.result.name,
            avatar: user.result.avatar,
            changed: false, 
            creator: user.result.googleId ? user.result.googleId : user.result._id,
        }

        if(comment.commentText.length > 0){
            dispatch(commentCreateDirect(formData, setComment, socket, room, setOpen));
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
            <PrivateMessagesBackground>
            { (profile && param.id !== (user.result.googleId ? user.result.googleId : user.result._id)) &&
            <>
                <div className='wrap'>
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={open}
                        onClick={() => {
                            setOpen(false);
                            setComment({ 
                                commentText: comment.commentText,
                                photoFile: null
                            })   
                        }}>
                            <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} style={{ display: open ? 'flex' : 'none', margin:'10px', flexDirection:'column', alignItems:'flex-end', maxWidth:'550px', background: '#fff', padding:'10px', borderRadius:'8px' }}>
                                <div style={{marginBottom:'8px', display:'flex', width:'100%', alignItems:'center', justifyContent:'center'}}>
                                    {isFileImage(comment?.photoFile) ?
                                        <div style={{ color:'black', flexBasis:'90%', fontSize:'20px', fontWeight:'500', marginLeft:'10px'}}>
                                            Send photo
                                        </div>
                                        :
                                        <div style={{ color:'black', flexBasis:'90%', fontSize:'20px', fontWeight:'500', marginLeft:'10px'}}>
                                            Send file
                                        </div>
                                    }
                                    <Button onClick={handleSubmit} sx={{fontSize:'10px'}} size="large" variant="contained">
                                        Send
                                    </Button>
                                </div>
                                <div style={{display:'flex', alignItems:'center', justifyContent: 'center', width:'100%' }}>
                                    {isFileImage(comment?.photoFile)
                                        ? <img onLoad={onImgLoad} style={{ width:'100%', maxWidth:'100%' }} src={previewPhoto} alt="" />
                                        : <div style={{color:'black', margin:'15px', display:'flex', alignItems:'center'}}>
                                            <div style={{ width:'30px', height:'30px', marginRight:'10px', position:'relative'}}>
                                                <FileMulticolor  />
                                            </div>
                                            {comment?.photoFile?.name.slice(0, 15)+ '...'}
                                        </div>
                                    }
                                </div>
                                <input 
                                    placeholder='Caption' 
                                    style={{ border:'1px solid gray', borderRadius:'10px', marginTop:'10px', padding:' 8px 12px' }} 
                                    type="text" 
                                    value={comment.commentText} 
                                    onChange={(e) => setComment({
                                        photoFile: comment.photoFile,
                                        commentText: e.target.value
                                    })} 
                                />
                                <input type="submit" hidden />
                            </form>
                    </Backdrop>
                    <div className='user-header'>
                        <div style={{ flexBasis:'95%', display:'flex', alignItems:'center' }}>
                            <div>
                                <Avatar src={profile?.userAvatar} sx={{ width:30, height:30, mr: 1 }} />
                            </div>
                            <div>
                            <div>
                                {profile?.userName.length > 25 
                                    ? profile?.userName.slice(0, 25) + '...'
                                    : profile?.userName
                                }
                            </div>
                            { usersOnline.some(user => user.userId === param.id)
                                ? <div className='user-header-online'>online</div>
                                : <div className='user-header-offline'>offline</div>
                            }
                            </div>
                        </div>
                        <MoreVertIcon sx={{width:20, height:20}} className='chat-settings-svg' onClick={() => setChatSettings((prev) => !prev)} />
                        <div onClick={handleDeleteChat} className={chatSettings ? 'chat-settings active' : 'chat-settings'}>
                            <div className='chat-settings-delete'>
                                <DeleteIcon sx={{mr:1, fill:'red'}}/>
                                <div style={{color:'red'}}>Delete chat</div>
                            </div>
                        </div>
                    </div>
                    <div className='messages-board'>
                    {commentsDirect.map(res => {
                        return(
                            <SinglePrivateComment
                                photoSize={res.photoSize} 
                                comments={res}
                                setComment={setComment}
                            />
                        )
                    })}
                    <div ref={commentsDirectRef} />
                    </div>
                    <div className='create-message-wrap'>
                        <form onSubmit={handleSubmit} className='emoji-select-and-message'>
                            <Emoji
                                onClick={() => {
                                    if(!disabled){
                                        SetEmojiEnable(prev => !prev);
                                        setChatSettings(false);
                                        setFileUploadEnable(false)
                                    }
                                }} 
                                className={emojienable ? 'emoji-svg active' : 'emoji-svg'} 
                            />
                            <Clip 
                                className={fileuploadenable ? "clip-svg active" : "clip-svg"} 
                                onClick={() => {
                                    if(!disabled){
                                        setFileUploadEnable((prev) => !prev);
                                        setChatSettings(false);
                                        SetEmojiEnable(false)
                                    }
                                }} 
                            />
                            <input disabled={disabled}
                                value={open ? '' : comment.commentText} 
                                onChange={(e) => setComment({
                                    photoFile: comment.photoFile,
                                    commentText: e.target.value
                                })} 
                                className='create-message' 
                            />
                            <input type="submit" hidden/>
                        </form>
                        <button className="voice-svg-wrap">
                            <Voice className="voice-svg" />
                        </button>
                            <div className={fileuploadenable ? 'fileuploadenable active' : 'fileuploadenable'}>
                                <div className='photoOrFile-upload'>
                                    <label for="photo" className='photo'>
                                        <Image className="photo-svg" />
                                        <div>Photo</div>
                                        <input onClick={(e) => e.currentTarget.value = null} name="photo" id="photo" className='comments-item-select-img' type="file" accept="image/png, image/gif, image/jpeg" onChange={handleOnChange} />
                                    </label>
                                    <label for="file" className="file">
                                        <File className="file-svg"/>
                                        <div>File</div>
                                        <input onClick={(e) => e.currentTarget.value = null} name="file" id="file" className='comments-item-select-img' type="file" onChange={handleOnChange} />
                                    </label>
                                </div>
                            </div>
                            <div className={emojienable ? 'EmojiPickerWrap active' : 'EmojiPickerWrap'}>
                                <Picker
                                    theme={theme === 'light' ? 'light' : 'dark'}
                                    sheetSize="20"
                                    width="30px"
                                    emojiSize={20}
                                    emojiButtonSize={26} 
                                    previewPosition="none"
                                    skinTonePosition="none"
                                    data={data} 
                                    onEmojiSelect={(e) => setComment({
                                        photoFile: comment.photoFile,
                                        commentText: comment.commentText + e.native
                                    })} 
                                />
                            </div>
                    </div>
                </div>
                <div 
                    className={emojienable || fileuploadenable || chatSettings 
                        ? 'block-private-message active' 
                        : 'block-private-message'
                    } 
                    onClick={() => {
                        SetEmojiEnable(false);
                        setFileUploadEnable(false);
                        setChatSettings(false);
                    }}>
                </div>
                </>
            }
            {disabled && 
                <div style={{position:'absolute', left:'3px', bottom:'2px', right:'3px'}}>
                    <LinearProgress sx={{ borderRadius: '20px' }}/>
                </div>
            }
            </PrivateMessagesBackground>
        </Layout>
    )
}

export default PrivateMessages;