import './PrivateMessages.css';
import { ReactComponent as Emoji } from '../../png/emoji.svg';
import { ReactComponent as Voice } from '../../png/voice.svg';
import { ReactComponent as Clip } from '../../png/clip.svg';
import { ReactComponent as Image } from '../../png/image.svg';
import { ReactComponent as File } from '../../png/file.svg';
import { ReactComponent as FileMulticolor } from '../../png/filemulticolor.svg';
import { PrivateMessagesBackground } from '../styles/homestyles';
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


const PrivateMessages = ({ socket }) => {   
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    
    const [open, setOpen] = useState(false);
    const [emojienable, SetEmojiEnable] = useState(false);
    const [fileuploadenable, setFileUploadEnable] = useState(false);
    const [chatSettings, setChatSettings] = useState(false);
    const [previewPhoto, setPreviewPhoto] = useState('');
    const [comment, setComment] = useState({ commentText: '', photoFile: null })

    const param = useParams();
    const dispatch = useDispatch();
    const commentsDirectRef = useRef(null);

    const profile = useSelector(state => state.authReducer.profile);
    const usersOnline = useSelector(state => state.authReducer.usersOnline);
    const commentsDirect = useSelector(state => state.commentReducer.commentsDirect);

    ///// modal with img ////
    useEffect(() => {
        if(comment.photoFile){
            setOpen(true);
            setFileUploadEnable(false);
        }   
    }, [comment.photoFile])

    useEffect(() => {
        dispatch(getUserProfile({id: param.id}));
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
    
    const scrollToBottom = () => commentsDirectRef.current?.scrollIntoView({ behavior: "smooth" });

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
            // photo: comment.photoFile,
            timeCreate: date,
            name: user.result.name,
            avatar: user.result.avatar ? user.result.avatar : user.result.imageUrl,
            changed: false, 
            creator: user.result._id ? user.result._id : user.result.googleId,
        }

        if(comment.commentText.length > 0){
            dispatch(commentCreateDirect(formData, setComment, socket, room));
        }    
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
                            /// wait transition
                            setTimeout(() => setComment({ 
                                commentText: comment.commentText,
                                photoFile: null
                            }), 150)
                        }}>
                        <div onClick={e => e.stopPropagation()} 
                        style={{ display:'flex', margin:'10px', flexDirection:'column', alignItems:'flex-end', maxWidth:'550px', background:'#fff', padding:'10px', borderRadius:'8px' }}>
                            <div style={{display:'flex', width:'100%', alignItems:'center'}}>
                                <div style={{ color:'black', flexBasis:'90%', fontSize:'20px', fontWeight:'500', marginLeft:'10px'}}>
                                    Send photo
                                </div>
                                <Button disabled onClick={handleSubmit} sx={{fontSize:'11px', mb:1}} size="large" variant="contained">
                                    send
                                </Button>
                            </div>
                            <div style={{display:'flex', alignItems:'center', justifyContent: 'center', width:'100%' }}>
                                {isFileImage(comment?.photoFile)
                                    ? <img style={{ width:'100%' }} src={previewPhoto} alt="" />
                                    : <div style={{color:'black', margin:'15px', display:'flex', alignItems:'center'}}>
                                        <div style={{width:'30px', height:'30px', marginRight:'10px', position:'relative'}}>
                                            <FileMulticolor  />
                                            <div style={{
                                                position:'absolute',
                                                transform:'translate(50%, 50%)',
                                                left:'-1px',
                                                top:'4px',
                                                color:'black',
                                                fontSize:'10px'
                                            }}>
                                                {comment?.photoFile && comment?.photoFile?.name.split('.')[1]}
                                            </div>
                                        </div>
                                        {comment?.photoFile?.name.split('.')[0]}
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
                        </div>
                    </Backdrop>
                    <div className='user-header'>
                        <div style={{ flexBasis:'95%', display:'flex', alignItems:'center' }}>
                            <div>
                                <Avatar src={profile?.userAvatar} sx={{ width:30, height:30, mr: 1 }} />
                            </div>
                            <div>
                            <div>{profile?.userName}</div>
                            { usersOnline.map(user => user.socketId.includes(param.id))
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
                                    SetEmojiEnable(prev => !prev);
                                    setChatSettings(false);
                                    setFileUploadEnable(false)
                                }} 
                                className={emojienable ? 'emoji-svg active' : 'emoji-svg'} 
                            />
                            <Clip 
                                className={fileuploadenable ? "clip-svg active" : "clip-svg"} 
                                onClick={() => {
                                    setFileUploadEnable((prev) => !prev);
                                    setChatSettings(false);
                                    SetEmojiEnable(false)
                                }} 
                            />
                            <input 
                                autoFocus
                                value={open ? '' : comment.commentText} 
                                onChange={(e) => setComment({
                                    photoFile: comment.photoFile,
                                    commentText: e.target.value
                                })} 
                                className='create-message' 
                            />
                            <input type="submit" hidden/>
                        </form>
                        <div className="voice-svg-wrap">
                            <Voice className="voice-svg" />
                        </div>
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
                    className={
                        emojienable || fileuploadenable || chatSettings 
                        ? 'block-private-message active' : 'block-private-message'
                    } 
                    onClick={() => {
                        SetEmojiEnable(false);
                        setFileUploadEnable(false);
                        setChatSettings(false);
                    }}>
                </div>
                </>
            }
            </PrivateMessagesBackground>
        </Layout>
    )
}

export default PrivateMessages;