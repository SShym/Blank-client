import x from './Profile.module.scss';
import profileImg from '../../png/profile.webp'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserProfile, getUsersOnline, SET_PROFILE } from '../../redux/actions';
import { CommentsBackground, LightDrope, ProfileCase } from '../styles/homestyles';
import Layout from '../styles/Layout';

const Profile = ({ socket }) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const param = useParams();
    const [validProfile, setValidProfile] = useState('');
   
    const dispatch = useDispatch();
    
    const profile = useSelector(state => state.authReducer.profile);
    const usersOnline = useSelector(state => state.authReducer.usersOnline);

    useEffect(() => {        
        dispatch(getUsersOnline(user, socket))
        dispatch(getUserProfile({ id: param.id }, setValidProfile));
        return () => dispatch({ type: SET_PROFILE, data: null });        
    }, [])

    return(
        <Layout>
            <CommentsBackground>
                {validProfile === 'valid' ?
                <div className={x.wrap}>
                    <LightDrope>
                        <ul className={x.lightrope}>
                            <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                        </ul>
                    </LightDrope>
                    <ProfileCase style={{display: profile ? 'flex' : 'none', userSelect:'none'}} className={x.profile}>
                        <div>
                            <div className='profile-username'>{profile?.userName}</div>
                            <img style={{ border:'1px solid gray', width:'150px', height: '150px'}} src={profile?.userAvatar ? profile?.userAvatar : profileImg} alt="" />
                        </div>
                        <div>
                            <button className='profile-message-button'>message</button>
                            <div className='online-status'>
                                {Object.values(usersOnline).includes(param.id) ?
                                    <div style={{color:'green'}}>online</div>
                                    : <div style={{color:'rgb(183, 0, 0)'}}>offline</div>
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