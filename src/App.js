import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Grid, Container, Image } from "semantic-ui-react";
import useFirebase from "./utils/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import Header from './Header';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import NewPost from './pages/NewPost';
import Post from './pages/Post';
import MyPost from './pages/MyPost';
import MyCollections from './pages/MyCollections';
import MySettings from './pages/MySettings';

import Topics from './components/Topics';
import MyMenu from './components/MyMenu';

import "./assets/styles.module.css";
import background from "./assets/image/homeBg.jpg";

function App() {
	const [user, setUser] = useState();

	useEffect(()=>{
		const auth = getAuth();
		onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});
	},[])
	useFirebase();

	return (
		<BrowserRouter>
			<Header user={user} />
			<Container>
				<Image src={background} style={{position:'fixed', bottom: 0, zIndex: -1}}></Image>
				<Grid>
					<Grid.Row>
						<Grid.Column width={3}>
							<Routes>
								<Route path="/posts/*" element={<Topics/>}/>
								<Route path="/my/*" element={<MyMenu/>}/>
								<Route exact path="/" element={<Topics/>}/>
							</Routes>
						</Grid.Column>
						<Grid.Column width={10}>
							<Routes>
								<Route exact path="/posts" element={<Home/>}/>
								<Route exact user={user} path="/posts/:postId" element={user!==null?<Post/>:<Navigate to="/" replace={true} />} />
								<Route path="/my" element={user!==null?'':<Navigate to="/" replace={true} />}>
									<Route exact path="/my/posts" element={<MyPost/>}/>
									<Route exact path="/my/collections" element={<MyCollections/>} />
									<Route exact path="/my/settings" element={<MySettings/>}/>
								</Route>
								<Route exact path="/" element={<Home/>}/>
							</Routes>
						</Grid.Column>
						<Grid.Column width={3}></Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
			<Routes>
				<Route exact path="/signIn" element={user!==null?<Navigate to="/" replace={true} />:<SignIn/>}/>
				<Route exact path='/new-post' element={user!==null?<NewPost/>:<Navigate to="/" replace={true} />} />
			</Routes>
		</BrowserRouter>
	)
};

export default App;