import x from './Profile.module.scss';
import { useContext } from "react";
import profileImg from '../../png/profile.webp'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserProfile, getUsersOnline } from '../../redux/actions';
import { CommentsBackground, LightDrope, ProfileCase } from '../styles/homestyles';

import Layout from '../styles/Layout';

const Profile = ({ socket }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const [validProfile, setValidProfile] = useState('');

    const profile = useSelector(state => state.authReducer.profile);
    const usersOnline = useSelector(state => state.authReducer.usersOnline);

    const param = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {  
        dispatch(getUsersOnline(user, socket))
        dispatch(getUserProfile({ id: param.id }, setValidProfile));
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
            <CommentsBackground>
                    <LightDrope>
                        <ul className={x.lightrope}>
                            <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                        </ul>
                    </LightDrope>
                {validProfile === 'valid' ?
                <div className={x.wrap}>
                    <ProfileCase style={{display: profile ? 'flex' : 'none', userSelect:'none'}} className={x.profile}>
                        <div>
                            <div className='profile-username'>{profile?.userName}</div>
                            <img style={{ objectFit:'cover', marginTop:'5px', width:'150px', height: '150px'}} src={profile?.userAvatar ? profile?.userAvatar : profileImg} alt="" />
                        </div>
                        <div>
                            {param.id !== (user.result.googleId ? user.result.googleId : user.result._id) &&
                                <button onClick={redirect} className='profile-message-button'>
                                    message
                                </button>  
                            }
                            <div className='online-status'>
                                {usersOnline.map(user => user.socketId.includes(param.id)) ?
                                    <div style={{color:'green'}}>online</div>
                                    : <div className='offline-status'>offline</div>
                                }
                            </div>
                        </div>
                    </ProfileCase>
                </div>
                : validProfile === 'invalid' ?
                    <div className={x.wrap}>
                        <span className='no-profile'>The profile has been deleted <br/>or doesn't exist.</span>
                    </div>
                : ''
                }
            </CommentsBackground>
        </Layout>
    )
}

export default Profile;