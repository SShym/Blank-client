import './App.css';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

function App() {                                              
  const error = useSelector(state => state.appReducer.error); 

  return (
    <div className="app">
      <div className="app-wrap">
        {error && <div className='error'>{error}</div>}
        <Navbar socket={socket} />
        <Routes>
          <Route path='/' element={<Navigate to={'/main'} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
