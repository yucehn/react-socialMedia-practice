import { useState, useEffect } from "react";
import { Button, Header, Input, Modal, Segment, Image } from "semantic-ui-react";
import { getAuth, updateProfile, onAuthStateChanged } from "firebase/auth";
import { ref, getStorage, uploadBytes, getDownloadURL } from "firebase/storage";

function MyName({user}){
	const [ isModalOpen, setIsModalOpen ] = useState(false);
	const [ displayName, setDisplayName ] = useState('');
	const [ isLoading, setIsLoading ] = useState(false);

	const onSubmit = ()=>{
		setIsLoading(true);
		updateProfile(user, {
			displayName,
		}).then(()=>{
			setDisplayName('');
			setIsModalOpen(false);
			setIsLoading(false);
		});
	}
	return (
		<>
			<Header>會員資料</Header>
			<Header size="small">
				會員名稱
				<Button floated="right" onClick={()=>{setIsModalOpen(true)}}>修改</Button>
			</Header>
			<Segment vertical>
				{user.displayName}
			</Segment>
			<Modal 
				onClose={() => setIsModalOpen(false)}
				onOpen={() => setIsModalOpen(true)}
				open={isModalOpen}
				size="mini"
			>
				<Modal.Header>修改會員名稱</Modal.Header>
				<Modal.Content>
					<Input 
						value={displayName} 
						placeholder="輸入新的會員名稱"
						onChange={(e)=>{setDisplayName(e.target.value)}}
						fluid
					/>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={()=>setIsModalOpen(false)}>取消</Button>
					<Button onClick={onSubmit} loading={isLoading}>修改</Button>
				</Modal.Actions>

			</Modal>
		</>
	)
}

function MyPhoto({user}){
	const [ isModalOpen, setIsModalOpen ] = useState(false);
	const [ isLoading, setIsLoading ] = useState(false);
	const [ file, setFile ] = useState(null);
	const previewImageUrl = file
		? URL.createObjectURL(file)
		:user.photoURL;

	const onSubmit = async ()=>{
		setIsLoading(true);
		if(file){
			// 上傳圖片
			const storage = getStorage();
			const fileRef = ref(storage, 'user-photos/'+ user.uid );
			const metadata = {
				contentType: file.type,
			};
			const imageUrl = await uploadBytes(fileRef, file, metadata).then(() => {
				return getDownloadURL(fileRef)
			});

			updateProfile(user, {
				photoURL: imageUrl,
			}).then(()=>{
				setFile(null);
				setIsModalOpen(false);
				setIsLoading(false);
			});

		}
		setIsLoading(false);
	}

	return (
		<>
			<Header size="small">
				會員照片
				<Button floated="right" onClick={()=> setIsModalOpen(true)}>修改</Button>
			</Header>
			<Segment vertical>
				<Image src={user.photoURL} avatar wrapped />
			</Segment>
			<Modal open={isModalOpen} size="mini">
				<Modal.Header>修改會員照片</Modal.Header>
				<Modal.Content image>
					<Image src={previewImageUrl} avatar wrapped />
					<Modal.Description>
						<Button as="label" htmlFor="post-image">上傳</Button>
						<Input 
							id="post-image" 
							type="file" 
							style={{display:'none'}}
							onChange={(e)=>{setFile(e.target.files[0])}}
						/>
					</Modal.Description>
				</Modal.Content>
				<Modal.Actions>
					<Button onClick={()=>setIsModalOpen(false)}>取消</Button>
					<Button onClick={onSubmit} loading={isLoading}>修改</Button>
				</Modal.Actions>
			</Modal>

		</>
	)
}

function MySettings(){
	const [user, serUser] = useState({});
	useEffect(()=>{
		const auth = getAuth();
		onAuthStateChanged(auth, (currentUser) => {
			if (currentUser) {
				serUser(currentUser);
			}
			});
	},[])

	return (
		<>
			<MyName user={user} />
			<MyPhoto user={user} />
			<Header size="small">
				會員密碼
				<Button floated="right">修改</Button>
			</Header>
			<Segment vertical>
				******
			</Segment>
		</>
	)
}

export default MySettings;