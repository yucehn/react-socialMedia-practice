import { BrowserRouter, Routes, Route} from 'react-router-dom';
import useFirebase from "./utils/firebase";
import { Grid, Container } from "semantic-ui-react";

import Header from './Header';
import SignIn from './pages/SignIn';
import Home from './pages/Home';
import Post from './pages/Post';
import NewPost from './pages/NewPost';
import MyPost from './pages/MyPost';
import MyCollections from './pages/MyCollections';
import MySettings from './pages/MySettings';

import Topics from './components/Topics';
import MyMenu from './components/MyMenu';

function App() {
	useFirebase();

	return (
		<BrowserRouter>
			<Header />
			<Container>
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
								<Route exact path="/posts/:postId" element={<Post/>} />
								<Route exact path="/my/posts" element={<MyPost/>}/>
								<Route exact path="/my/collections" element={<MyCollections/>} />
								<Route exact path="/my/settings" element={<MySettings/>}/>
								<Route exact path="/" element={<Home/>}/>
							</Routes>
						</Grid.Column>
						<Grid.Column width={3}></Grid.Column>
					</Grid.Row>
				</Grid>
			</Container>
			<Routes>
				<Route exact path="/signIn" element={<SignIn/>}/>
				<Route exact path='/new-post' element={<NewPost/>} />
			</Routes>
		</BrowserRouter>
	)
};

export default App;