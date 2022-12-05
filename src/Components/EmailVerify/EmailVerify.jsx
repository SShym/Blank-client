import './EmailVerify.css'
import Layout from '../styles/Layout';
import { decode } from "jsonwebtoken";
import { useDispatch } from "react-redux";
import { verifyMailOnLoad } from "../../redux/actions";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EmailVerifyBackground } from '../styles/homestyles';

const EmailVerify = () => {
	const [validUrl, setValidUrl] = useState('');
	const param = useParams();

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const formData = {
		id: param.id,
		token: param.token
	}

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				dispatch(verifyMailOnLoad(formData, navigate, decode, setValidUrl));
			} catch (error) {
				setValidUrl('error');
			}
		};
		verifyEmail();
	}, []); // eslint-disable-line

	return (
		<Layout>
			<EmailVerifyBackground>
			{ validUrl === 'Email verified successfully' && 
				<div className='SuccessVerificationEmail'>
					<h1>Email verified successfully</h1>
					<div>Redirect to main page...</div>
				</div>
			}
			{ validUrl === 'Registration link timed out, please try again' &&
			 	<div>
			 		<h1 className='mail_error'>Registration link timed out, please try again</h1>
				</div>
			}
			{ validUrl === 'error' &&
				<div>
					<h1 className='mail_error'>404 Not found</h1>
				</div>			
			}
			</EmailVerifyBackground>
		</Layout>
	);
};

export default EmailVerify;