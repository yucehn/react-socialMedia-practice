import { useEffect, useState } from "react";
import { Header, Item } from "semantic-ui-react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import Post from '../components/Post';

function MyCollections(){
	const [posts, setPosts] = useState([]);
	
	useEffect(()=>{
		const db = getFirestore();
		const auth = getAuth();
		const postsRef = query(collection(db,'posts'), where("collectedBy", "array-contains", auth.currentUser.uid));
		getDocs(postsRef).then((res)=>{
			const data = res.docs.map(doc=> {
				const id =  doc.id;
				return {...doc.data(), id}
			});
			setPosts(data);
		}).catch(error=>{
			console.log('error', error)
		});
	},[]);

	return (
		<>
			<Header>我的收藏</Header>
			<Item.Group>
				{posts.map(post=>{
					return (
						<Post post={post} key={post.id} />
					)
				})}
			</Item.Group>
		</>
	)
}

export default MyCollections;