import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { List } from 'semantic-ui-react';

function Topics(){
	const [topics, setTopics] = useState([]);
	const location = useLocation();
	const urlSearchParams = new URLSearchParams(location.search);
	const currentTopic = urlSearchParams.get('topic');

	useEffect(()=>{
		const db = getFirestore();
		const usersCollectionRef = collection(db, 'topics');
		getDocs(usersCollectionRef)
			.then(res=>{
				let resTopics = res.docs.map(doc=> doc.data());
				resTopics.unshift({
					name:'全部',
				})
				setTopics(resTopics);
			}).catch(error=>{
				console.log('error', error)
			});
	}, []);

	return <List animated selection>
		{ topics.map(topic=>{
			return (
				<List.Item 
					key={topic.name} 
					as={Link} 
					to={`/posts${topic.name!=='全部'? '?topic='+topic.name:''}`}
					active={topic.name === currentTopic || topic.name ==='全部'&& !currentTopic}
				>
						{topic.name}
				</List.Item>)
		})}
	</List>
}

export default Topics;