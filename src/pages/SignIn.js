import React from 'react';
import { Menu, Form, Container, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

function SignIn(){
	const auth = getAuth();
	const navigate = useNavigate();
	const [activeItem,setActiveItem]=React.useState('register');
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [errorMessage, setErrorMessage]=React.useState(null);
	const [isLoading, setIsLoading] = React.useState(false);

	const reset = ()=>{
		setErrorMessage('');
		setEmail('');
		setPassword('');
	}

	function onSubmit(){
		setIsLoading(true);
		if(activeItem==='register'){
			createUserWithEmailAndPassword(auth, email,password)
				.then((userCredential) => {
					const user = userCredential.email;
					setIsLoading(false);
					navigate('/');
			  }).catch((error) => {
				// Handle error.
				switch(error.code) {
					case 'auth/invalid-email':
						setErrorMessage('信箱格式不符');
						break;
					case 'auth/email-already-in-use':
						setErrorMessage('信箱已存在');
						break;
					case 'auth/weak-password':
						setErrorMessage('密碼強度不足');
						break;
					default:
				}
				setIsLoading(false);
			  });
		} else if(activeItem==='signIn'){
			signInWithEmailAndPassword(auth, email,password)
				.then((userCredential) => {
					const user = userCredential.email;
					console.log('user2:', user)
					setIsLoading(false);
					navigate('/');
				}).catch(function(error) {
					switch( error.code) {
						case 'auth/invalid-email':
							setErrorMessage('信箱格式不符');
							break;
						case 'auth/user-not-found':
							setErrorMessage('信箱不存在');
							break;
						case 'auth/wrong-password':
							setErrorMessage('密碼錯誤');
							break;
						default:
					}
					setIsLoading(false);
				});
		}
	}

	return (
		<Container>
			<Menu widths="2">
				<Menu.Item 
					active={activeItem==='register'} 
					onClick={()=>{
						setActiveItem('register'); 
						reset();
					}}
				>
					註冊
				</Menu.Item>
				<Menu.Item 
					active={activeItem==='signIn'}
					onClick={()=>{
						setActiveItem('signIn');
						reset();
					}}
				>
					登入
				</Menu.Item>
			</Menu>
			<Form onSubmit={onSubmit}>
				<Form.Input 
					label="信箱" 
					value={email}
					onChange={(e)=>setEmail(e.target.value)}
					placeholder="請輸入信箱"
				/>
				<Form.Input
					label="密碼"
					value={password} 
					onChange={(e)=>setPassword(e.target.value)}
					placeholder="請輸入密碼"
					type="password"
				/>
				{ errorMessage && <Message negative>{errorMessage}</Message> }
				<Form.Button loading={isLoading}>
					{activeItem==='register' && '註冊'}
					{activeItem==='signIn' && '登入'}
				</Form.Button>
			</Form>
		</Container>
	)
}

export default SignIn;