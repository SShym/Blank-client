import './Profile.css';
import snowman from '../../png/snowman.gif';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserProfile, getUsersOnline } from '../../redux/actions';
import { LightDrope, ProfileBackground, ProfileCase } from '../styles/homestyles';
import Layout from '../styles/Layout';
import { ReactComponent as Loader } from '../../png/loaderGear.svg';
import Avatar from '@mui/material/Avatar';

const Profile = ({ socket }) => {
    const [timer, setTimer] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [validProfile, setValidProfile] = useState(false);

    const profile = useSelector(state => state.profileReducer.profile);
    const usersOnline = useSelector(state => state.profileReducer.usersOnline);

    const param = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {  
        dispatch(getUsersOnline(user, socket))
        dispatch(getUserProfile(param.id, setValidProfile));

        // don't show the Loader if the Internet speed is normal
        // to prevent flicker
        setTimeout(() => setTimer(true), 1500)
    }, [])

    const redirect = () => {
        if(user) {
            navigate(`/direct/${param.id}`);
        } else {
            navigate(`/auth`);
        }
    }

    return(
        <Layout>
            <ProfileBackground>
                <LightDrope>
                    <ul className="lightrope">
                        <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                    </ul>
                </LightDrope>
                {validProfile ?
                    <div className="wrap">
                        <ProfileCase style={{display: profile ? 'flex' : 'none', userSelect:'none'}}>
                            {localStorage.getItem('theme') === "dark" && 
                                <img className='snow-background' src={snowman} alt="" />
                            }
                            <div>
                                <div className='profile-username'>
                                    {profile?.userName}
                                </div>
                                <Avatar className='profile-avatar' src={profile?.userAvatar}></Avatar>
                            </div>
                            <div>
                                {param.id !== (user?.result.googleId ? user?.result.googleId : user?.result._id) &&
                                    <button onClick={redirect} className='profile-message-button'>
                                        message
                                    </button>  
                                }
                                <div className='online-status'>
                                    {usersOnline.some(user => user.userId === param.id) ?
                                        <div style={{color:'green'}}>online</div>
                                        : <div className='offline-status'>offline</div>
                                    }
                                </div>
                            </div>
                        </ProfileCase>
                    </div>
                : <div style={{display: timer ? 'block' : 'none'}} className='profile-loader'>
                    <Loader className='profile-loader-svg' />
                </div>
            }
            </ProfileBackground>
        </Layout>
    )
}

export default Profile;