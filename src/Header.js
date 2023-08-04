import { useState } from 'react';
import { Menu, Search } from 'semantic-ui-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import algolia from './utils/algolia';

function Header({user}){
	const navigate = useNavigate();
	const [inputValue, setInputValue] = useState('');
	const [results, setResults] = useState([]);

	function onSearchChange(e,{value}){
		setInputValue(value);
		algolia.search(value).then((result)=>{
			const searchResult = result.hits.map((hit)=>{
				return {
					title: hit.title,
					description: hit.content,
					id: hit.objectID
				}
			});
			setResults(searchResult)
		});
	}

	function onResultSelect(e,{result}){
		navigate(`/posts/${result.id}`)
	}

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
	const location = useLocation();

	return (
		<Menu className='secondary' style={{background:'#e9e9e9'}}>
			<Menu.Item as={Link} to="/posts">logo</Menu.Item>
			<Menu.Item>
				<Search 
					value={inputValue}
					onSearchChange={onSearchChange}
					results={results}
					noResultsMessage="搜尋不到相關文章"
					onResultSelect={onResultSelect}
				/>
			</Menu.Item>
			<Menu.Menu position="right" style={{background:'#e9e9e9'}}>
				{user? (
					<>
						<Menu.Item as={Link} to="/new-post" active={location.pathname==='/new-post'}>發表文章</Menu.Item>
						<Menu.Item as={Link} to="/my/posts" active={location.pathname==='/my/posts'}>會員</Menu.Item>
						<Menu.Item onClick={userSignOut}>登出</Menu.Item>
					</>
				):(
					<Menu.Item as={Link} to="/signIn">註冊/登入</Menu.Item>
				)}
			</Menu.Menu>
		</Menu>
	);
};

export default Header;