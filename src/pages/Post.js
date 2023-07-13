import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import {Container,  Grid, Header, Image, Segment, Icon } from "semantic-ui-react";

import Topics from '../components/Topics';

function Post(){
	const { postId }= useParams();
	const [ post, setPost ] = useState({
		author: {},
	});
	const db = getFirestore();
	const docRef = doc(db, "posts", postId);
	const auth = getAuth();
	const uid =  auth.currentUser.uid;

	useEffect(()=>{
		onSnapshot(docRef,(doc)=>{
			const data = doc.data();
			setPost(data);
		}); 
	},[]);
	
	const isCollectedBy = post.collectedBy?.includes(uid);
	function toggleCollected(){
		updateDoc(docRef, {
			collectedBy: isCollectedBy ? arrayRemove(uid) : arrayUnion(uid),
		});
	}


	return (
		<Container>
			<Grid>
				<Grid.Row>
					<Grid.Column width={3}>
						<Topics />
					</Grid.Column>
					<Grid.Column width={10}>
						{ post.author.photoURL?
						<Image src={post.author.photoURL} />:
						<Icon name="user circle" />}
						
						{post.author.displayName||'使用者'}
						<Header>
							{post.title}
							<Header.Subheader>
								{post.topic}。{post.createdAt?.toDate().toLocaleDateString()}
							</Header.Subheader>
						</Header>
						<Image src={post.imageUrl} />
						<Segment basic vertical>
							{post.content}
						</Segment>
						<Segment basic vertical>
							留言 0。 讚 0。 
							<Icon name="thumbs up outline" color="grey" />。
							<Icon name={`bookmark${isCollectedBy?'':' outline'}`} color={isCollectedBy?'blue':'grey'} link onClick={toggleCollected} /> 
						</Segment>
					</Grid.Column>
					<Grid.Column width={3}></Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
	)
}

export default Post;