import x from './Profile.module.scss';
import Avatar from '@mui/material/Avatar';
import noProfile from '../../png/noProfile.jpg'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getUserProfile, SET_PROFILE } from '../../redux/actions';
import { CommentsBackground, UserName, UserNameAndAvatar, LightDrope } from '../styles/homestyles';
import Layout from '../styles/Layout';

const Profile = () => {
    const param = useParams();
   
    const dispatch = useDispatch();

    const profile = useSelector(state => state.authReducer.profile);
    
    useEffect(() => {
        dispatch(getUserProfile({id: param.id}));
        return () => dispatch({ type: SET_PROFILE, data: null });        
    }, [])

    return(
        <Layout>
            <CommentsBackground>
                {profile ?
                <div>
                    <LightDrope>
                        <ul className={x.lightrope}>
                            <li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li><li></li>
                        </ul>
                    </LightDrope>
                    <div style={{display: profile ? 'flex' : 'none', userSelect:'none'}} className={x.profile}>
                        <UserNameAndAvatar>
                            <Avatar sx={{width:160, height:160, border: '1px solid gray'}} src={profile?.userAvatar} />
                            <UserName>{profile?.userName}</UserName>
                        </UserNameAndAvatar>
                    </div>
                </div>
                :
                    <div className={x.noProfile}>
                        The profile been deleted <br/>or doesn't exist.
                    </div>
                }
            </CommentsBackground>
        </Layout>
    )
}

export default Profile;