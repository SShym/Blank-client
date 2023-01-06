import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import Icon from './icon';
import successSvg from '../../png/success.svg';
import { signin, signup, googleAuth } from '../../redux/actions';
import useStyles from './styles';
import Input from './Input';
import Layout from '../styles/Layout';
import { PageAuth } from "../styles/homestyles";
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme } from '@mui/material/styles';

const initialState = { firstName: '', lastName: '', email: '', password: '' };

const theme = createTheme({
  palette: {
    secondary: {
      main: '#fff',
    },
  },
});

const SignUp = ({ socket }) => {
  document.body.className = localStorage.getItem('theme');
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();
  const disabled = useSelector(state => state.appReducer.disabled);
  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      try {
        dispatch(signup(form, setVerifyStatus));
      } catch(error) {
        console.log(error);
      }
    } else {
      dispatch(signin(form, navigate, socket));
    }
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    const formData = {
      result: result,
      token: token
    }
    
    try {
      dispatch(googleAuth(formData, navigate, socket));
    } catch (error) {
      console.log(error);
    }
  };
  
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Layout>
      <PageAuth>
        <div className="authpage-wrap">
          <Container component="main" maxWidth="xs">
            <Paper className="authpage-papper" elevation={3}>
              {verifyStatus &&
                <div className="authpage-verifyMail-wrap">
                  <img className={classes.successSvg} src={successSvg}  alt="" />
                  <h4 className={classes.verifyMailText}>An Email sent to your account, please verify</h4>
                </div>
              }
              <Avatar className='authpage-avatar'></Avatar>
              <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
                <form autocomplete="off" className={classes.form} onSubmit={handleSubmit}>
                  <Grid container spacing={1}>
                    { isSignup && (
                    <>
                      <Input disabled={disabled} name="firstName" label="First Name" handleChange={handleChange} half />
                      <Input disabled={disabled} name="lastName" label="Last Name" handleChange={handleChange} half />
                    </>
                    )}
                    <Input disabled={disabled} name="email" label="Email Address" handleChange={handleChange} type="email" />
                    <Input disabled={disabled} name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                  </Grid>
                    <div className='authpage-btnBlock'>
                      { isSignup ?
                        <button  type="submit" className="authpage-button">
                          {disabled ?
                            <div style={{display:'flex'}}>
                              <div>
                                <CircularProgress theme={theme} sx={{ display:'flex', flexDirection:'column', justifyContent:'center', mr: 0.8 }} size={10} color="secondary"/>
                              </div>
                              <div>SIGN UP</div>
                            </div>
                            : <div>SIGN UP</div>
                          }
                        </button>
                        :
                        <button  type="submit" className="authpage-button">
                        {disabled ?
                          <div style={{display:'flex'}}>
                            <div>
                              <CircularProgress theme={theme} sx={{ display:'flex', flexDirection:'column', justifyContent:'center', mr: 0.8 }} size={10} color="secondary"/>
                            </div>
                            <div>SIGN IN</div>
                          </div>
                          : <div>SIGN IN</div>
                        }
                      </button>
                      }
                    </div>
                  <GoogleLogin
                    clientId="733992931171-gjd9utoojt376cq1b0l9ut8prvikebbn.apps.googleusercontent.com"
                    render={(renderProps) => (
                      <button onClick={renderProps.onClick} disabled={renderProps.disabled || disabled} type="submit" className="authpage-button">
                        <Icon />Google Sign In
                      </button>
                    )}
                    onSuccess={googleSuccess}
                    cookiePolicy="single_host_origin"
                  />
                  {/* <div>{error}</div> */}
                  <Grid container justify="flex-end">
                    <Grid item>
                      <Button className='switch-mode' disabled={disabled} onClick={switchMode}>
                        { isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign Up" }
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Paper>
          </Container>
        </div>
      </PageAuth>
    </Layout>
  );
};

export default SignUp;