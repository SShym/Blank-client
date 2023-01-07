import './App.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { commentsLoad } from './redux/actions';
import Navbar from './Components/Navbar/Navbar';
import Comments from './Components/Comments/Comments';
import AuthPage from './Components/AuthPage/AuthPage';
import Settings from './Components/Settings/Settings';
import EmailVerify from './Components/EmailVerify/EmailVerify';
import Profile from './Components/Profile/Profile';
import PrivateMessages from './Components/PrivateMessages/PrivateMessages';
import io from 'socket.io-client';

const socket = io.connect('https://sqmr.onrender.com');

function App() {
  ////////////////////////////////////////////////////////////////
  //// Prevent re-render COMMENTS if SETTINGS haven't changed ////
  ////////////////////////////////////////////////////////////////

  const [trackLocation, setTrackLocation] = useState(null); 
                                                    
  const error = useSelector(state => state.appReducer.error); 
  const changes = useSelector(state => state.appReducer.changes);
  
  const location = useLocation();
  const dispatch = useDispatch();
    
  useEffect(() => {
    if(location.pathname === '/comments' && trackLocation){
      dispatch(commentsLoad(socket));
      localStorage.removeItem('settings-page');
    }
  }, [trackLocation]); // eslint-disable-line

  useEffect(() => {
    if(location.pathname === '/comments' && changes){
      dispatch(commentsLoad(socket));
    }
  }, [location]) // eslint-disable-line

  ////////////////////////////////////////////////////////////////

  return (
    <div className="app">
      <div className="app-wrap">
        {error && <div className='error-message'>{error}</div>}
        <Navbar socket={socket} />
        <Routes>
          <Route path='/' element={<Navigate to={'/comments'} />} />
          <Route path='/auth' element={<AuthPage socket={socket} />} />
          <Route path="/:id/verify/:token" element={<EmailVerify />} />
          <Route path='/settings' element={<Settings socket={socket} />} />
          <Route path='/profile/:id' element={<Profile socket={socket}/>} />
          <Route path='/direct/:id' element={<PrivateMessages socket={socket} />} />
          <Route path='/comments' element={<Comments socket={socket} setTrackLocation={setTrackLocation} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
