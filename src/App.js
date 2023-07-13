import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useFirebase from "./utils/firebase";

import Header from './Header';
import SignIn from './pages/SignIn';
import Hone from './pages/Home';
import Post from './pages/Post';
import NewPost from './pages/NewPost';

function App() {
	useFirebase();
	return (
		<BrowserRouter>
			<Header />
			<Routes>
				<Route exact path="/" element={<Hone/>}/>
				<Route exact path="/signIn" element={<SignIn/>}/>
				{/* <Route exact path="/new-post"  element={<Posts/>}></Route> */}
				<Route exact path='/new-post' element={<NewPost/>} />
				<Route exact path="/posts/:postId" element={<Post/>} />
			</Routes>
		</BrowserRouter>
	)
};

export default App;