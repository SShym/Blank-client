import './App.css';
import Comments from './Components/Comments/Comments';
import Spin from './spin';
import Navbar from './Components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import AuthPage from './Components/AuthPage/AuthPage';
import EmailVerify from './Components/EmailVerify/EmailVerify';
import Settings from './Components/Settings/Settings'
import { useSelector } from 'react-redux';

function App() {
  const error = useSelector(state => state.appReducer.error);

  return (
      <div className="App">
        <div className="wrap">
          {error && <div className='error-message'>{error}</div>}
          <Navbar />
          <Routes>
            <Route path='/auth' element={<AuthPage />} />
            <Route path="/:id/verify/:token" element={<EmailVerify />} />
            <Route path='/' element={<Comments />} />
            <Route path='/settings' element={<Settings />} />
          </Routes>
          <Spin />
        </div>
      </div>
  );
}

export default App;
