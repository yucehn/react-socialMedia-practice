import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { getFirestore, collection, getDocs, query, where, orderBy, limit, startAfter } from "firebase/firestore";
import { Item } from "semantic-ui-react";
import { Waypoint } from "react-waypoint";

import Post from '../components/Post';

function Posts(){
	const location = useLocation();
	const urlSearchParams = new URLSearchParams(location.search);
	const currentTopic = urlSearchParams.get('topic');
	const [posts, setPosts] = useState([]);
	const lastPostSnapshotRef = useRef();
	
	useEffect(()=>{
		const db = getFirestore();
		const postsRef =  query(collection(db,'posts'),currentTopic ? where('topic','==',currentTopic):'', orderBy('createdAt', 'desc'), limit(5) );
		getDocs(postsRef).then((res)=>{
			const data = res.docs.map(doc=> {
				const id =  doc.id;
				return {...doc.data(), id}
			});
			lastPostSnapshotRef.current = res.docs[res.docs.length-1];
			setPosts(data);
		}).catch(error=>{
			console.log('error', error)
		});
		
	},[currentTopic]);

	return (
		<>
			<Item.Group>
				{posts.map(post=>{
					return (
						<Post post={post} key={post.id} />
					)
				})}
			</Item.Group>
		<Waypoint onEnter={()=>{ 
			if(lastPostSnapshotRef.current){
				const db = getFirestore();
				const postsRef =  query(collection(db,'posts'),currentTopic ? where('topic','==',currentTopic):'', orderBy('createdAt', 'desc'), limit(5), startAfter(lastPostSnapshotRef.current) );
				getDocs(postsRef).then((res)=>{
					const data = res.docs.map(doc=> {
						const id =  doc.id;
						return {...doc.data(), id}
					});
					lastPostSnapshotRef.current = res.docs[res.docs.length-1];
					setPosts([...posts,...data]);
				}).catch(error=>{
					console.log('error', error)
				});
			}
		 }} />
		</>
	)
}

export default Posts;