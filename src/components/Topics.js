import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { List } from 'semantic-ui-react';

function Topics(){
	const [topics, setTopics] = useState([]);
	useEffect(()=>{
		const db = getFirestore();
		const usersCollectionRef = collection(db, 'topics');
		getDocs(usersCollectionRef)
			.then(res=>{
				const resTopics = res.docs.map(doc=> doc.data());
				setTopics(resTopics);
			}).catch(error=>{
				console.log('error', error)
			});
	}, []);

	return <List animated selection>
		{topics.map(topic=>{
			return <List.Item key={topic.name}>{topic.name}</List.Item>
		})}
	</List>
}

export default Topics;