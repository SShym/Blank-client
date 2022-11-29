import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import Icon from './icon';
import successSvg from '../../png/success.svg';
import { signin, signup, AUTH, errorOff } from '../../redux/actions';
import useStyles from './styles';
import Input from './Input';
import Layout from '../styles/Layout';
import { PageAuth } from "../styles/homestyles";

const initialState = { firstName: '', lastName: '', email: '', password: '' };

const SignUp = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const classes = useStyles();

  const handleShowPassword = () => setShowPassword(!showPassword);

  const switchMode = () => {
    dispatch(errorOff())
    setIsSignup((prevIsSignup) => !prevIsSignup);
    setShowPassword(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      try {
        dispatch(signup(form, navigate, setVerifyStatus));
      } catch(error) {
        console.log(error);
      }
    } else {
      dispatch(signin(form, navigate));
    }
  };

  const googleSuccess = async (res) => {
    const result = res?.profileObj;
    const token = res?.tokenId;

    try {
      dispatch({ type: AUTH, data: { result, token } });
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const googleError = (error) => console.log('error', error)
  
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <Layout>
      <PageAuth>
        <div className="authpage-wrap">
          <Container component="main" maxWidth="xs">
            <Paper className="authpage-papper" elevation={3}>
              {verifyStatus &&
                <div className={classes.verifyMail}>
                  <img className={classes.successSvg} src={successSvg}  alt="" />
                  <h4 className={classes.verifyMailText}>An Email sent to your account, please verify</h4>
                </div>
              }
              <Avatar className='authpage-avatar'></Avatar>
              <Typography component="h1" variant="h5">{ isSignup ? 'Sign up' : 'Sign in' }</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                  <Grid container spacing={1}>
                    { isSignup && (
                    <>
                      <Input name="firstName" label="First Name" handleChange={handleChange} autoFocus half />
                      <Input name="lastName" label="Last Name" handleChange={handleChange} half />
                    </>
                    )}
                    <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                    <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? 'text' : 'password'} handleShowPassword={handleShowPassword} />
                  </Grid>
                  <div className='authpage-btnBlock'>
                  {
                    isSignup ?
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                      Sign Up
                    </Button> :
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                      Sign In
                    </Button>  
                  }
                  </div>
                  <GoogleLogin
                    clientId="733992931171-gjd9utoojt376cq1b0l9ut8prvikebbn.apps.googleusercontent.com"
                    render={(renderProps) => (
                      <Button className='authpage-google-button' color="primary" fullWidth onClick={renderProps.onClick} disabled={renderProps.disabled} startIcon={<Icon />} variant="contained">
                        Google Sign In
                      </Button>
                    )}
                    onSuccess={googleSuccess}
                    onFailure={googleError}
                    cookiePolicy="single_host_origin"
                  />
                  {/* <div>{error}</div> */}
                  <Grid container justify="flex-end">
                    <Grid item>
                      <Button onClick={switchMode}>
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