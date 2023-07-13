import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import {Container,  Grid, Header, Image, Segment, Icon } from "semantic-ui-react";

import Topics from '../components/Topics';

function Post(){
	const { postId }= useParams();
	const [ post, setPost ] = useState({
		author: {},
	});
	useEffect(()=>{
		const db = getFirestore();
		const docRef = doc(db, "posts", postId);
		getDoc(docRef).then((dpcSnapshot)=>{
			const data = dpcSnapshot.data();
			setPost(data);
		});   
	},[]);
	return (
		<Container>
			<Grid>
				<Grid.Row>
					<Grid.Column width={3}>
						<Topics />
					</Grid.Column>
					<Grid.Column width={10}>
						<Image src={post.author.photoURL} />
						{post.author.displayName}
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
							<Icon name="bookmark outline" color="grey" /> 
						</Segment>
					</Grid.Column>
					<Grid.Column width={3}>空白</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
	)
}

export default Post;