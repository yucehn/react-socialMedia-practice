// import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Item, Image, Icon } from "semantic-ui-react";

function Post({post}){
	return (
		<Item as={Link} to={`/posts/${post.id}`}>
			<Item.Image src={post.imageUrl ||'https://react.semantic-ui.com/images/wireframe/image.png'} size="tiny"/>
			<Item.Content>
				<Item.Meta>
					{
						post.author.photoURL
						? (<Image src={post.author.photoURL} avatar /> )
						: <Icon name="user circle"/>
					}
					{` `}{post.topic}。{post.author.displayName ||'使用者'}
				</Item.Meta>
				<Item.Header>{post.title}</Item.Header>
				<Item.Description style={{overflow:'hidden', whiteSpace: 'nowrap',textOverflow: 'ellipsis'}}>{post.content}</Item.Description>
				<Item.Extra>
					留言 {post.commentsCount || 0} 。讚 {post.likedBy?.length||0}
				</Item.Extra>
			</Item.Content>
		</Item>
	)
}

export default Post;