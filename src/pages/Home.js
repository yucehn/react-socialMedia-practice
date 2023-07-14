import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { Grid, Item, Image, Icon, Container } from "semantic-ui-react";

import Topics from '../components/Topics';


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
		<Container>
			<Grid>
				<Grid.Row>
					<Grid.Column width={3}>
						<Topics/>
					</Grid.Column>
					<Grid.Column width={10}>
						<Item.Group>
							{posts.map(post=>{
								return (
									<Item key={post.id} as={Link} to={`/posts/${post.id}`}>
										<Item.Image src={post.imageUrl ||'https://react.semantic-ui.com/images/wireframe/image.png'} size="tiny"/>
										<Item.Content>
											<Item.Meta>
												{
													post.author.photoUR
													? (<Image src={post.author.photoURL} /> )
													: <Icon name="user circle"/>
												}
												{post.topic}。{post.author.displayName ||'使用者'}
											</Item.Meta>
											<Item.Header>{post.title}</Item.Header>
											<Item.Description>{post.content}</Item.Description>
											<Item.Extra>
												留言 0 。讚 {post.likedBy?.length||0}
											</Item.Extra>
										</Item.Content>
									</Item>
								)
							})}
						</Item.Group>
					</Grid.Column>
					<Grid.Column width={3}>空白</Grid.Column>
				</Grid.Row>
			</Grid>
		</Container>
	)
}

export default Posts;