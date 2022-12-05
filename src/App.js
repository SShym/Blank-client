import './App.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes, useLocation } from 'react-router-dom';
import { commentsLoad } from './redux/actions';
import Spin from './spin';
import Navbar from './Components/Navbar/Navbar';
import Comments from './Components/Comments/Comments';
import AuthPage from './Components/AuthPage/AuthPage';
import Settings from './Components/Settings/Settings';
import EmailVerify from './Components/EmailVerify/EmailVerify';

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
    if(trackLocation === '/'){
      localStorage.removeItem('settings-page');
      dispatch(commentsLoad());
    }
  }, [trackLocation]) // eslint-disable-line

  useEffect(()=>{
    (location.pathname === '/' && changes) && dispatch(commentsLoad());
  }, [location]) // eslint-disable-line

  ////////////////////////////////////////////////////////////////

  return (
    <div className="app">
      <div className="app-wrap">
        {error && <div className='error-message'>{error}</div>}
        <Navbar />
        <Routes>
          <Route path='/auth' element={<AuthPage />} />
          <Route path="/:id/verify/:token" element={<EmailVerify />} />
          <Route path='/' element={<Comments setTrackLocation={setTrackLocation} />} />
          <Route path='/settings' element={<Settings />} />
        </Routes>
        <Spin />
      </div>
    </div>
  );
}

export default App;
