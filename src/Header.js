import { Menu, Search } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import React from 'react';

function Header(){
	const [user, setUser] = React.useState(null);
	React.useEffect(()=>{
		const auth = getAuth();
		onAuthStateChanged(auth, (currentUser) => {
		if (currentUser) {
			// User is signed in, see docs for a list of available properties
			// https://firebase.google.com/docs/reference/js/auth.user
			// const uid = currentUser.uid;
			setUser(currentUser.email)
			// ...
		} else {
			// User is signed out
			// ...
		}
		});
	}, []);
	function userSignOut(){
		const auth = getAuth();
		signOut(auth).then(() => {
			// Sign-out successful.
			console.log('successful')
			setUser(null)
		  }).catch((error) => {
			// An error happened.
			console.log('error', error)
		  });
	}
	return (
		<Menu>
			<Menu.Item as={Link} to="/posts">logo</Menu.Item>
			<Menu.Item>
				<Search/>
			</Menu.Item>
			<Menu.Menu position="right">
				{user? (
					<Menu>
						<Menu.Item as={Link} to="/new-post">發表文章</Menu.Item>
						<Menu.Item as={Link} to="/my/posts">會員</Menu.Item>
						<Menu.Item onClick={userSignOut}>登出</Menu.Item>
					</Menu>
				):(
					<Menu.Item as={Link} to="/signIn">註冊/登入</Menu.Item>
				)}
				
			</Menu.Menu>
		</Menu>
	);
};

export default Header;