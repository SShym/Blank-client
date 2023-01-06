import './Settings.scss';
import { ReactComponent as Success } from '../../png/success.svg';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';import Icon from '@mui/material/Icon';
import Avatar from '@mui/material/Avatar';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { verifyMail, deleteSchema, changeSettings, loadAuthData, getUsersOnline } from "../../redux/actions";
import { GlobalContext } from '../styles/globalContext';
import { SwitchButton } from "../styles/homestyles";
import Layout from '../styles/Layout';
import { Black, PageBackground, SettingsRightBlock} from "../styles/homestyles";
import useMediaQuery from '@mui/material/useMediaQuery';
import profileImg from '../../png/profile.webp';
import { ReactComponent as UploadSvg } from '../../png/upload.svg';
import React from 'react';
import { TextField } from '@material-ui/core';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme } from '@mui/material/styles';

const colorCircle = createTheme({
    palette: {
      secondary: {
        main: '#f10f10f10',
      },
    },
  });

const CssTextField = styled(TextField)({
  label:{
    fontSize:'13px'
  },
  '& .MuiInputBase-input': {
    padding: '10px 4px',
    fontSize:'13px'
  },
  '& label.Mui-focused': {
    color: 'rgb(0, 110, 110)',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'rgb(0, 110, 110)',
  },
  '& .MuiInput-underline:before': { 
    borderBottomColor: 'rgb(151, 151, 151)' 
  },
});

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const styleMatches = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const initialState = { 
    firstName: '', 
    lastName: '', 
    photoUrl: '',
    photo: null,
};

const Settings = ({ socket }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile'))); // eslint-disable-line
    const { theme, themeSwitchHandler } = useContext(GlobalContext);
    const [form, setForm] = useState(initialState);
    const [verifyStatus, setVerifyStatus] = useState(false);
    const [color,  setColor] = useState(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [one, setOne] = useState({ status: true, className: 'pick' });
    const [two, setTwo] = useState({ status: false, className: '' }); 

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const matches = useMediaQuery('(min-width: 576px)');
    const authData = useSelector(state => state.authReducer.authData);
    const disabled = useSelector(state => state.appReducer.disabled)

    useEffect(() => {
        !user.result.googleId && dispatch(loadAuthData({ 
            socket,
            data: {
                id: user.result._id, 
                token: user.token
            }
        }, setLoading));
        dispatch(getUsersOnline(user, socket));
    }, []); // eslint-disable-line

    useEffect(() => localStorage.setItem("theme", theme), [theme]);
    document.body.className = localStorage.getItem('theme');

    const toggle = () => setColor(!color);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value.length > 0 ? e.target.value : '' });
    }

    useEffect(()=>{
        !user.result.googleId && setForm(authData ? { 
            ...form, firstName: authData?.result.name.split(' ')[0],
            lastName: authData?.result.name.split(' ')[1],
            photo: authData?.result.avatar,
            photoUrl: authData?.result.avatar,
        } : 
        { ...form });
    }, [authData]); // eslint-disable-line
    
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = {
            token: user.token,
            id: user.result.googleId ? user.result.googleId : user.result._id,
            photo: form.photo,
            firstName: form.firstName,
            lastName: form.lastName,
        }

        dispatch(changeSettings(formData, socket));
    };

    const formData = user.result.googleId ? { id: user.result.googleId } : { id: user.result._id }

    const handleDeleteProfile = () => {
        dispatch(deleteSchema(formData, user, navigate, socket))
    }

    const handleOnChange = (e) => {
        const file = e.target.files[0];
        setFileToBase(file);
    }

    const setFileToBase = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setForm({...form, photoUrl: reader.result, photo: file});
        }
    }

    const handleDeleteAvatar = () => {
        !disabled && setForm({...form, photoUrl: null, photo: null});
    }
    
    useEffect(()=>{
        const page = localStorage.getItem('settings-page');
        
        if(page === 'account'){
            setOne({status: true, className: 'pick'})
            setTwo({status: false, className: ''}); 
        } else if(page === 'settings'){
            setOne({satus: false, className: ''})
            setTwo({status: true, className: 'pick'}); 
        } 
        return () => localStorage.removeItem('settings-page');
    }, [])
    
    return(
        <Layout>
            <PageBackground>
                <div className={matches ? 'settings-block' : 'settings-block-media'}>
                    <div className='settings-block-one'>
                        <Black>
                            <div className={one.className}  onClick={()=>{
                                setOne({status: true, className: 'pick'}); 
                                localStorage.setItem('settings-page', 'account');
                                setTwo({status: false});
                            }}>Account</div>
                            <div className={two.className} onClick={()=>{
                                setTwo({status: true, className: 'pick'}); 
                                localStorage.setItem('settings-page', 'settings');
                                setOne({status: false});
                            }}>Settings</div>
                        </Black>
                    </div>

                    <SettingsRightBlock>
                        {one.status &&
                            <div className='settings-block-two-general'>
                                <div className='settings-block-two-general-one'>
                                        <div style={{  display:'inline-block', position:'relative' }}>
                                            <Avatar className='accountAvatar'src={authData ? authData?.result?.avatar : user.result.avatar}></Avatar>
                                            <div className='settings-block-avatar-black'></div>
                                        </div>
                                    <div className='settings-block-user-name'>{authData ? authData.result.name : user.result.name}</div>
                                    <div className='settings-block-user-email'>
                                        <Icon sx={{
                                            width:25, 
                                            height:25, 
                                            marginTop:0.3,
                                            marginRight:0.4
                                            }} 
                                            component={MarkunreadOutlinedIcon}
                                        />
                                        {/* If profile is Google Account */}
                                        {user.result.email.includes('gmail:') 
                                            ? user.result.email.slice(6).trim()
                                            : user.result.email
                                        }
                                    </div>
                                    { user.result.verified === false &&
                                    <div style={{marginTop: '10px'}}>
                                        {verifyStatus ?
                                            <div style={{
                                                backgroundColor: 'rgb(24, 247, 98)',
                                                border:'1px solid',
                                                borderRadius:'10px',
                                                padding:'10px 15px',
                                                fontSize:'17px',
                                                color:'black'
                                            }}>
                                                <Success style={{width:'60px', height:'60px'}} />
                                                <div style={{marginTop:'5px'}}>An Email sent to your account!</div>
                                            </div>
                                        :
                                        <div className='settings-confirm-mail'>
                                            <div>CONFIRM YOUR MAIL!!!</div>
                                            <div>
                                                <Button onClick={() => dispatch(verifyMail(user.result, setVerifyStatus))} style={{marginTop:'10px'}} variant="outlined" size="large" color="error">
                                                    CONFIRM
                                                </Button>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                    }
                                </div>
                            </div>
                        }
                        {two.status &&
                            <div className='settings-block-two-settings'>
                                <Modal keepMounted
                                    open={open}
                                    onClose={handleClose}
                                    aria-labelledby="keep-mounted-modal-title"
                                    aria-describedby="keep-mounted-modal-description">
                                    <Box sx={matches ? styleMatches : style}>
                                    <div style={{
                                        display:'flex', 
                                        alignItems:'center', 
                                        justifyContent:'center',
                                        marginBottom:'5px'
                                    }}>
                                        <Typography style={{textAlign:'center'}} id="keep-mounted-modal-title" variant="h6" component="h2">
                                            Are you sure you want to delete your profile?
                                        </Typography>
                                        <Typography >
                                            <Checkbox onChange={toggle}  />
                                        </Typography>
                                    </div>
                                    <div style={{textAlign:'center'}}>
                                        <Button className='settings-button-delete-profile'
                                            disabled={!color} 
                                            variant="outlined" 
                                            size="large" 
                                            color="error" 
                                            onClick={handleDeleteProfile}>
                                                Delete profile
                                        </Button>
                                    </div>
                                    </Box>
                                </Modal>
                                { !user.result.googleId &&
                                    <div className='change-user-settings'>
                                        <div style={{
                                            textAlign:'center',
                                            fontWeight:'bold',
                                            marginBottom:'10px', 
                                        }}>
                                            Profile settings:
                                        </div>
                                        <form autocomplete="off" onSubmit={handleSubmit} className={!matches ? 'change-user-settings-wrap-media' : 'change-user-settings-wrap'}>
                                            <div className='change-user-settings-one'>
                                                <div className='settings-changeAvatar'>
                                                    <div>
                                                        <img
                                                            src={
                                                                form.photoUrl ? form.photoUrl
                                                                : (!authData && user.result.avatar) ? user.result.avatar
                                                                : authData?.result?.avatar == null ? profileImg
                                                                : profileImg
                                                            }
                                                            alt="" 
                                                        />
                                                        <div className='settings-block-black'></div>
                                                    </div>
                                                    <label for="file">
                                                        <div className='settings-block-avatar-change'>
                                                            <div >change photo</div>
                                                            <UploadSvg style={{width:'30px', marginTop:'5px'}}/>
                                                        </div>
                                                    </label>
                                                </div>
                                                <div className={(disabled || loading) ? 'settings-delete-avatar-loading' : 'settings-delete-avatar'} onClick={handleDeleteAvatar}>
                                                    <div>delete</div>
                                                </div>
                                                <input onClick={(e) => e.currentTarget.value = null} disabled={disabled || loading} onChange={handleOnChange} name="photo" id="file" className='comments-item-select-img' type="file" />
                                            </div>
                                            <div className='change-user-settings-two'>
                                                <div className='change-user-settings-two-box'>
                                                    <CssTextField onKeyDown={(event) => { event.code === 'Space' && event.preventDefault()}}
                                                        required
                                                        inputProps={{ maxLength: 15}}
                                                        style={{margin:'13px 0px'}}
                                                        value={!authData ? user.result.name.split(' ')[0] : form.firstName}
                                                        onChange={handleChange}
                                                        disabled={disabled || loading} 
                                                        name="firstName" 
                                                        label="First Name"
                                                        className='settings-input-fname'
                                                    >
                                                    </CssTextField>

                                                    <CssTextField onKeyDown={(event) => { event.code === 'Space' && event.preventDefault()}}
                                                        required
                                                        inputProps={{ maxLength: 15}}
                                                        style={{margin:'13px 0px'}}
                                                        value={!authData ? user.result.name.split(' ')[1] : form.lastName}
                                                        disabled={disabled || loading}
                                                        name="lastName" 
                                                        label="Last Name" 
                                                        onChange={handleChange}
                                                        className='settings-input-lname'
                                                    >
                                                    </CssTextField>
                                                </div>
                                            </div>
                                            <button disabled={disabled || loading} type="submit" className='change-user-settings-button' style={(disabled || loading) ? {cursor: 'default'} : {cursor: 'pointer'}}>
                                                {disabled ? 
                                                    <div style={{display:"flex", justifyContent:'center', cursor:'default'}}>
                                                        <CircularProgress theme={colorCircle} sx={{ display:'flex', flexDirection:'column', justifyContent:'center' }} size={17} color="secondary"/>
                                                    </div> 
                                                : <div className='saveDiv'>save</div>}
                                            </button>
                                        </form>
                                    </div>
                                }
                                <div className='change-theme-block'>
                                    <div style={{
                                        textAlign:'center',
                                        fontWeight:'bold',
                                        marginBottom:'5px', 
                                        marginTop:'25px',
                                    }}>
                                        Change theme:
                                    </div>
                                    <SwitchButton>
                                        <input type='checkbox' onChange={() => themeSwitchHandler(theme === "dark" ? "light" : "dark")} />
                                        <span></span>
                                    </SwitchButton>
                                </div>
                                <div className='delete-profile-block'>
                                    <Button variant="outlined" size="large" color="error" onClick={handleOpen}>
                                        Delete profile
                                    </Button>
                                </div>
                            </div>
                        }
                    </SettingsRightBlock>
                </div>
            </PageBackground>
        </Layout>
    )
}

export default Settings;