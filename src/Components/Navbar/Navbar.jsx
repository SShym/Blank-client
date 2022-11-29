import './Navbar.css';
import { Button} from '@material-ui/core';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { errorOff, LOGOUT } from '../../redux/actions';
import { gapi } from 'gapi-script';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Layout from '../styles/Layout';
import { NavbarAvatar, NavbarBlock, NavbarBlockUser, NavbarLogo } from "../styles/homestyles";
import { ReactComponent as HomeSvg } from '../../png/home.svg';

const Navbar = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(()=>{
    user && location.pathname === '/auth' && navigate('/')
  }, [location])
  
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
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logout = () => {
    dispatch({ type: LOGOUT });
    dispatch(errorOff());
    navigate('/');
    setUser(null);
  };

  return (
    <Layout>
      <NavbarBlock>
        <NavbarLogo>
          <HomeSvg onClick={()=>navigate("/")} />
        </NavbarLogo>
        <div >
        {user ? 
        (
          <div>
            <Box onClick={handleClick}>
              <NavbarBlockUser>
                  <Typography sx={{ fontSize:'17px', marginLeft:'15px', userSelect:'none' }}>
                    {user.result.name}
                  </Typography>
                  <Tooltip title="Account settings">
                    <IconButton
                      size="small"
                      sx={{ ml: 0.3 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                    >
                    {user.result.imageUrl ?
                        <Avatar src={user.result.imageUrl} sx={{ width: 30, height: 30 }}></Avatar>
                      : <NavbarAvatar>{user.result.name.charAt(0)}</NavbarAvatar>              
                    }
                    </IconButton>
                  </Tooltip>
              </NavbarBlockUser>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  backgroundColor:'white',
                  overflow: 'visible',
                  marginLeft:'-1.5px',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.0,
                  '& .MuiAvatar-root': {
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
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem>
                <Avatar src={user.result.imageUrl ? user.result.imageUrl : ''} />{user.result.name}
              </MenuItem>
              <Divider />
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
  );
};

export default Navbar;