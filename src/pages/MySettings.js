import { useState } from "react";
import { Button, Header, Input, Modal, Segment } from "semantic-ui-react";
import { getAuth, updateProfile } from "firebase/auth";

function MyName(){
	const user = getAuth().currentUser || {};
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

function MySettings(){
	const user = getAuth().currentUser || {};

	return (
		<>
			<MyName/>
			<Header size="small">
				會員照片
				<Button floated="right">修改</Button>
			</Header>
			<Segment vertical>
				{user.photoURL}
			</Segment>
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