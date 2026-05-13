import { Link } from 'react-router-dom';
import { Image, Icon } from 'semantic-ui-react';
import styles from './PostRow.module.css';

const placeholder = 'https://react.semantic-ui.com/images/wireframe/image.png';

function Post({ post, style }) {
	return (
		<Link to={`/posts/${post.id}`} className={styles.row} style={style}>
			<img
				src={post.imageUrl || placeholder}
				alt={post.title}
				className={styles.image}
			/>
			<div className={styles.content}>
				<div className={styles.meta}>
					{post.author.photoURL
						? <Image src={post.author.photoURL} avatar />
						: <Icon name="user circle" />
					}
					{` `}{post.topic}。{post.author.displayName || '使用者'}
				</div>
				<div className={styles.title}>{post.title}</div>
				<div className={styles.description}>{post.content}</div>
				<div className={styles.extra}>
					留言 {post.commentsCount || 0} 。讚 {post.likedBy?.length || 0}
				</div>
			</div>
		</Link>
	);
}

export default Post;
