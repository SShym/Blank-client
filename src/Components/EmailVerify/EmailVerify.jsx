import './EmailVerify.css'
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { signin } from "../../redux/actions";
import axios from "axios";
import { useDispatch } from "react-redux";
import { decode } from "jsonwebtoken";
import mainPng from '../../png/main.png';

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState('');
	const param = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const API = axios.create({ 
		baseURL: 'https://vvv.herokuapp.com' 
	});
	
	API.interceptors.request.use((req) => {
	  if (localStorage.getItem('profile')) {
		req.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
	  }
	
	  return req;
	});


	useEffect(() => {
		const verifyEmail = async () => {
			try {
				await API.get(`https://sanar.netlify.app/${param.id}/verify/${param.token}`)
				.then((res) => {
					console.log(res)
					if (param.token) {
						const decodedToken = decode(param.token);
						if (decodedToken.exp * 1000 < new Date().getTime()) {
							setValidUrl('Registration link timed out, please try again')
						} else {
							setValidUrl('Email verified successfully')
							setTimeout(() => {
								dispatch(signin({
									email: res.data.user.email,
									password: res.data.user.password,
								}, navigate));
							}, 3000);
						};
					}
				})
			} catch (error) {
				setValidUrl('error');
			}
		};
		verifyEmail();
	}, []);

	return (
        <div className='mail_wrap' style={{backgroundImage: `url(${mainPng})`}}>
			<div>
			{ validUrl == 'Email verified successfully' && 
				<div>
					<h1>Email verified successfully</h1>
					<div>Redirect to main page...</div>
				</div>
			}
			{ validUrl == 'Registration link timed out, please try again' &&
			 	<div>
			 		<h1 className='mail_error'>Registration link timed out, please try again</h1>
				</div>
			}
			{ validUrl == 'error' &&
				<div>
					<h1 className='mail_error'>404 Not found</h1>
				</div>			
			}
			</div>
        </div>
	);
};

export default EmailVerify;