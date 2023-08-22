import { useEffect, useReducer, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, writeBatch, increment, Timestamp, collection, query, orderBy } from "firebase/firestore";
import { Grid, Header, Image, Segment, Icon, Comment, Form } from "semantic-ui-react";

function Post({user}){
	const { postId }= useParams();
	const db = getFirestore();
	const docRef = doc(db, "posts", postId);
	const auth = getAuth();
	const uid =  user?.uid || auth.currentUser?.uid;
	const [ post, setPost ] = useState({
		author: {},
	});
	const [commentContent,setCommentContent]=useState('');
	const [isLoading, setIsLoading]=useState(false);
	const [comments, setComments] = useState([]);

	useEffect(()=>{
		onSnapshot(docRef,(doc)=>{
			const data = doc.data();
			setPost(data);
		}); 
	},[]);

	useEffect(()=>{
		const docQuery = query(collection(docRef, 'comments'),orderBy('createdAt'));
		onSnapshot(
			docQuery,
			(collectionSnapshot) => {
				const data = collectionSnapshot.docs.map((doc)=>{
					 return doc.data();
				})
			setComments(data);
		});
	})

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
		
		const mailRef = doc(collection(db,'mail'));
		batch.set(mailRef,{
			to: post.author.email,
			message: {
				subject: `新訊息:${auth.currentUser.displayName}剛已回覆您的文章`,
				html: `<a href="${window.location.origin}/posts/${postId}"  target="_blank">前往文章</a>`
			}
		})

		batch.commit().then(()=>{
			setCommentContent('');
			setIsLoading(false)
		});
	};

	return (
		<Grid.Column width={10}>
			{ post.author.photoURL?
			<Image src={post.author.photoURL} avatar />:
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
				留言 {post.commentsCount || 0}。讚 {post.likedBy?.length||0}
				{ uid ? (
					<>
						。
						<Icon
							name={`thumbs up${isLiked?'':' outline'}`} 
							color={isLiked?'blue':'grey'}
							onClick={()=> toggle(isLiked,'likedBy')}
							link
						/>
						。
						<Icon
							name={`bookmark${isCollectedBy?'':' outline'}`}
							color={isCollectedBy?'blue':'grey'}
							onClick={()=>toggle(isCollectedBy,'collectedBy')} 
							link
						/>
					</>
				):''}	
			</Segment>
			<Comment>
				<Comment.Group>
					{ uid ? (
						<Form reply onSubmit={onSubmit}>
							<Form.TextArea
								value={commentContent} 
								onChange={(e)=>{setCommentContent(e.target.value)}}
							/>
							<Form.Button loading={isLoading}>留言</Form.Button>
						</Form>
					):''}
					<Header>共{post.commentsCount || 0}則留言</Header>
					{comments.map((comment)=>{
						return (
							<Comment>
								<Comment.Avatar src={comment.author.photoURL} />
								<Comment.Content>
									<Comment.Author as="span">{comment.author.displayName||'使用者'}</Comment.Author>
									<Comment.Metadata>{comment.createdAt.toDate().toLocaleString()}</Comment.Metadata>
									<Comment.Text>{comment.content}</Comment.Text>
								</Comment.Content>
							</Comment>
						)
					})}
				</Comment.Group>
			</Comment>
		</Grid.Column>
	)
}

export default Post;