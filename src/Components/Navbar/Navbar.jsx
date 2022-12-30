import './Navbar.css';
import { Button} from '@material-ui/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LOGOUT, loadAuthData } from '../../redux/actions';
import { gapi } from 'gapi-script';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Layout from '../styles/Layout';
import { NavbarBlock, NavbarBlockUser, NavbarLogo } from "../styles/homestyles";
import { ReactComponent as HomeSvg } from '../../png/home.svg';
import useMediaQuery from '@mui/material/useMediaQuery';

const Navbar = ({ socket }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const disabled = useSelector(state => state.appReducer.disabled);
  const loading = useSelector(state => state.appReducer.loading);
  const error = useSelector(state => state.appReducer.error);
  const authData = useSelector(state => state.authReducer.authData);

  useEffect(() => {
    (user && !user.result.googleId) && dispatch(loadAuthData({
        socket,
        data: {
            id: user.result._id, 
            token: user.token
        }
    }));
  }, []); //eslint-disable-line 

  const matches = useMediaQuery('(max-width: 576px)');
  
  useEffect(()=>{
    user && location.pathname === '/auth' && navigate('/comments')
  }, [location]) //eslint-disable-line

  useEffect(() => {
    gapi.load('client:auth2', ()=>{
      gapi.client.init({
        clientId: '733992931171-gjd9utoojt376cq1b0l9ut8prvikebbn.apps.googleusercontent.com',
        scope: 'email',
      });
    });

    setUser(JSON.parse(localStorage.getItem('profile')));
  }, [location]);

  const open = Boolean(anchorEl);
  const handleClick = (event) => (!disabled && !loading && !error) && setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logout = () => {
    dispatch({ type: LOGOUT });
    socket.emit('disconnectById', { id: user.result.googleId ? user.result.googleId : user.result._id });
    navigate('/comments');
    setUser(null);
  };

  return (
    <div>
    { location.pathname.includes('verify') ? 
      <Layout>
        <NavbarBlock>
          <div className='verification-text'>VERIFICATION</div>
        </NavbarBlock>
      </Layout>
      :
      <Layout>
        <NavbarBlock>
        { location.pathname.includes('verify') &&
          <div className='verification-text'>VERIFICATION</div>
        }
          <NavbarLogo>
            <HomeSvg onClick={() => {!disabled && navigate("/comments")}} />
          </NavbarLogo>
          <div>
          {user ? 
          (
            <div>
              <Box onClick={handleClick}>
                <NavbarBlockUser>
                  <Tooltip title="Account settings" PopperProps={{modifiers: [{name: "offset", options: {offset: [2, -12]}}]}}>
                    <Typography sx={{ fontSize:'17px', marginLeft:'15px', userSelect:'none' }}>
                      {authData ? authData.result.name.split(' ')[0] : user.result.name.split(' ')[0]}
                        <IconButton style={{position:'relative'}}>
                          <Avatar className='navAvatar' src={authData ? authData?.result.avatar : user.result.avatar} sx={{ width: 30, height: 30 }}>
                            {authData ? authData?.result?.name.charAt(0) : user.result.name.charAt(0)}
                          </Avatar>
                          <div className='block-navbar'></div>
                        </IconButton>
                    </Typography>
                  </Tooltip>
                </NavbarBlockUser>
              </Box>
              <div>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  className='red'
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      bgcolor: localStorage.getItem('theme') === 'dark' ? 'rgb(170, 170, 170)' : '#fff',
                      overflow: 'visible',
                      marginLeft: matches ? '7px' : '-4px',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.0,
                      '& .MuiAvatar-root': {
                        bgcolor: 'papper',
                        color: 'white',
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: localStorage.getItem('theme') === 'dark' ? 'rgb(170, 170, 170)' : '#fff',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Link className='navbar-link' to="/settings">
                    <MenuItem>
                      <ListItemIcon>
                        <Settings fontSize="small" />
                      </ListItemIcon>
                      Settings
                    </MenuItem>
                  </Link>
                  <MenuItem onClick={logout}>
                    <ListItemIcon>
                      <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ) : 
          (
            <div className='navbar-right-block-two'>
              <Link className='navbar-link' to="/auth">
                <Button size="large" color="primary" variant="outlined">LOGIN</Button>
              </Link>
            </div>
          )}
          </div>
          </NavbarBlock>
      </Layout>
    }
    </div>
  );
};

export default Navbar;