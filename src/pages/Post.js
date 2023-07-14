import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, writeBatch, increment, Timestamp, collection } from "firebase/firestore";
import {Container,  Grid, Header, Image, Segment, Icon, Comment, Form } from "semantic-ui-react";

import Topics from '../components/Topics';

function Post(){
	const { postId }= useParams();
	const db = getFirestore();
	const docRef = doc(db, "posts", postId);
	const auth = getAuth();
	const uid =  auth.currentUser.uid;
	const [ post, setPost ] = useState({
		author: {},
	});
	const [commentContent,setCommentContent]=useState('');
	const [isLoading, setIsLoading]=useState(false)

	useEffect(()=>{
		onSnapshot(docRef,(doc)=>{
			const data = doc.data();
			setPost(data);
		}); 
	},[]);

	const isCollectedBy = post.collectedBy?.includes(uid);
	const isLiked = post.likedBy?.includes(uid);
	function toggle(isActive,field){
		updateDoc(docRef, {
			[field]: isActive ? arrayRemove(uid) : arrayUnion(uid),
		});
	}

	const onSubmit=()=>{
		setIsLoading(true)
		const batch = writeBatch(db);
		batch.update(docRef, {
			commentsCount: increment(1)
		});
		
		const commentRef = doc(collection(docRef, 'comments'));
		batch.set(commentRef, {
			content: commentContent,
			createdAt: Timestamp.now(),
			author: {
				uid: uid,
				displayName: auth.currentUser.displayName ||'',
				photoURL: auth.currentUser.photoURL ||'',
			}
		});
		batch.commit().then(()=>{
			setCommentContent('');
			setIsLoading(false)
		});
	};

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
							留言 0。讚 {post.likedBy?.length||0}。 
							<Icon 
								name={`thumbs up${isLiked?'':' outline'}`} 
								color={isLiked?'blue':'grey'}
								onClick={()=> toggle(isLiked,'likedBy')}
								link						
							/>。
							<Icon 
								name={`bookmark${isCollectedBy?'':' outline'}`}
								color={isCollectedBy?'blue':'grey'}
								onClick={()=>toggle(isCollectedBy,'collectedBy')} 
								link
							/> 
						</Segment>
						<Comment>
							<Comment.Group>
								<Form reply onSubmit={onSubmit}>
									<Form.TextArea 
										value={commentContent} 
										onChange={(e)=>{setCommentContent(e.target.value)}}
									/>
									<Form.Button loading={isLoading}>留言</Form.Button>
								</Form>
								<Header>共1則留言</Header>
								<Comment>
									<Comment.Avatar src="" />
									<Comment.Content>
										<Comment.Author as="span">留言者名稱</Comment.Author>
										<Comment.Metadata>{new Date().toLocaleDateString()}</Comment.Metadata>
										<Comment.Text>留言內容</Comment.Text>
									</Comment.Content>
								</Comment>
							</Comment.Group>
						</Comment>
					</Grid.Column>
					<Grid.Column width={3}></Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
	)
}

export default Post;