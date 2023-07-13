import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, Timestamp, addDoc, setDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { Container, Header, Form, Image, Button } from "semantic-ui-react";

function NewPost(){
	const navigate = useNavigate();
	const [title, setTitle]=useState('');
	const [content, setContent] = useState('');
	const [topics, setTopics] = useState([]);
	const [topicName, setTopicName]= useState('');
	const [file, setFile ] = useState('');
	const [isLoading, setIsLoading]=useState(false);

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

	const options = topics.map(topic=> {
		return {
			text: topic.name,
			value: topic.name
		}
	});

	const previewUrl = file
		? URL.createObjectURL(file)
		:'https://react.semantic-ui.com/images/wireframe/image.png';

	async function onSubmit(){
		setIsLoading(true);
		const db = getFirestore();
		const auth = getAuth();
		const docRefID = await addDoc(collection(db, "posts"),{}).then((ref)=>{
			return ref.id;
		});
		let imageUrl = null;
		if(file){
			// 上傳圖片
			const storage = getStorage();
			const fileRef = ref(storage, 'post-images/'+ docRefID );
			const metadata = {
				contentType: file.type,
			};
			imageUrl = await uploadBytes(fileRef, file, metadata).then(() => {
				return getDownloadURL(fileRef)
			});
		}

		setDoc(doc(db, "posts", docRefID), {
			title,
			content,
			topic: topicName,
			createdAt: Timestamp.now(),
			author: {
				displayName: auth.currentUser.displayName || '',
				photoURL: auth.currentUser.photoURL || '',
				uid: auth.currentUser.uid || '',
				email: auth.currentUser.email || '',
			},
			imageUrl: imageUrl
		}).then(()=>{
			setIsLoading(false);
			navigate('/');
		});;

		return;
	}

	return (
		<Container>
			<Header>發表文章</Header>
			<Form onSubmit={onSubmit}>
				<Image 
					src={previewUrl}
					size='small'
					floated="left"
				/>
				<Button basic as="label" htmlFor="post-image">上傳文章圖片</Button>
				<Form.Input 
					type="file" 
					id="post-image" 
					style={{display:'none'}} 
					onChange={(e)=>setFile(e.target.files[0])}
				 />
				<Form.Input 
					value={title} 
					onChange={(e)=> setTitle(e.target.value)}
					placeholder="輸入文章標題"
				/>
				<Form.TextArea 
					value={content} 
					onChange={(e)=> setContent(e.target.value)}
					placeholder="輸入文章餒內容"
				/>
				<Form.Dropdown
					options={options}
					placeholder="選擇文章主題"
					selection={topicName||false}
					onChange={(e,{ value }) => setTopicName(value)}
				/>
				<Form.Button loading={isLoading}>送出</Form.Button>
			</Form>
		</Container>
	);
}

export default NewPost;