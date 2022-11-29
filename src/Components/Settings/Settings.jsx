import './Settings.scss';
import success from '../../png/success.svg';
import profile from '../../png/profile.svg';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MarkunreadOutlinedIcon from '@mui/icons-material/MarkunreadOutlined';import Icon from '@mui/material/Icon';
import { useContext, useEffect, useState } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { verifyMail, deleteSchema } from "../../redux/actions";
import { GlobalContext } from '../styles/globalContext';
import { SwitchButton } from "../styles/homestyles";
import Layout from '../styles/Layout';
import { Black, PageBackground, SettingsRightBlock} from "../styles/homestyles";
import useMediaQuery from '@mui/material/useMediaQuery';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -100%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

const Settings = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const { theme, themeSwitchHandler } = useContext(GlobalContext);
    
    const [verifyStatus, setVerifyStatus] = useState(false);

    const matches = useMediaQuery('(min-width: 442px)');

    useEffect(() => {
        window.localStorage.setItem("theme", theme);
      }, [theme]);

    const [one, setOne] = useState({
        status: true,
        className: 'pick'
    })

    const [two, setTwo] = useState({
        status: false,
        className: 'settings-x'
    }) 

    const [color,  setColor] = useState(false);

    const [open, setOpen] = useState(false);

    const toggle = () => setColor(!color)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formData = { id: user.result._id }

    return(
        <Layout>
            <PageBackground>
                <div className='settings-wrap'>
                    <div className={matches ? 'settings-block' : 'settings-block-media'}>
                        <div className='settings-block-one'>
                        <Black>
                            <div className={one.className}  onClick={()=>{
                                setOne({status: true, className: 'pick'}); 
                                setTwo({status: false});
                            }}>Account</div>
                            <div className={two.className} onClick={()=>{
                                setTwo({status: true, className: 'pick'}); 
                                setOne({status: false});
                            }}>Settings</div>
                        </Black>
                        </div>
                        <SettingsRightBlock>
                            {one.status &&
                                <div className='settings-block-two-general'>
                                    <div className='settings-block-two-general-one'>
                                        <div>
                                            { user.result.imageUrl 
                                                ? <img className='settings-avatar' src={user.result.imageUrl} alt="" />
                                                : <img className='settings-avatar' src={profile} alt="" />
                                            }
                                        </div>
                                        <div className='settings-block-user-name'>{user.result.name}</div>
                                        <div className='settings-block-user-email'>
                                            <Icon sx={{
                                                width:25, 
                                                height:25, 
                                                marginTop:0.3,
                                                marginRight:0.4
                                                }} 
                                                component={MarkunreadOutlinedIcon}
                                            />
                                            {user.result.email}
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
                                                    <img style={{width:'60px', height:'60px'}} src={success} alt="" />
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
                                        <Box sx={style}>
                                        <div style={{
                                            display:'flex', 
                                            alignItems:'center', 
                                            justifyContent:'center',
                                        }}>
                                            <Typography style={{textAlign:'center'}} id="keep-mounted-modal-title" variant="h6" component="h2">
                                                Are you sure you want to delete your profile?
                                            </Typography>
                                            <Typography >
                                                <Checkbox onChange={toggle}  />
                                            </Typography>
                                        </div>
                                        <div style={{textAlign:'center'}}>
                                            <Button 
                                                disabled={!color} 
                                                variant="outlined" 
                                                size="large" 
                                                color="error" 
                                                onClick={()=>dispatch(deleteSchema(formData, navigate))}>
                                                    Delete profile
                                            </Button>
                                        </div>
                                        </Box>
                                    </Modal>
                                    <div className='change-theme-block'>
                                        <h5>Change theme:</h5>
                                        <Layout>
                                            <SwitchButton>
                                                <input type='checkbox' onChange={() => themeSwitchHandler(theme === "dark" ? "light" : "dark")} />
                                                <span></span>
                                            </SwitchButton>
                                        </Layout>
                                    </div>
                                    <div className='delete-profile-block'>
                                        { !user.result.googleId &&
                                            <Button variant="outlined" size="large" color="error" onClick={handleOpen}>
                                                Delete profile
                                            </Button>
                                        }
                                    </div>
                                </div>
                            }
                        </SettingsRightBlock>
                    </div>
                </div>
            </PageBackground>
        </Layout>
    )
}

export default Settings;