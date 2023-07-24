import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Item } from "semantic-ui-react";

import Post from '../components/Post';

function Posts(){
	const [posts, setPosts] = useState([]);
	
	useEffect(()=>{
		const db = getFirestore();
		const postsRef = collection(db,'posts');
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
		<Item.Group>
			{posts.map(post=>{
				return (
					<Post post={post} key={post.id} />
				)
			})}
		</Item.Group>
	)
}

export default Posts;