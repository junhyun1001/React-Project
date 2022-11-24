//클래스 컴포넌트(훅사용불가)
import React, { Component } from 'react';
import { FaRegSmileWink } from 'react-icons/fa';
import { FaPlus } from 'react-icons/fa';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { connect } from 'react-redux';
//import firebase from '../../../firebase';
import { setCurrentChatRoom, setPrivateChatRoom } from '../../../redux/actions/chatRoom_action';
import { getDatabase, ref, onChildAdded, onValue, push, child, update, off } from "firebase/database";


export class ChatRooms extends Component {

	state = {
		show: false,
		name: "",
		description: "",
		chatRoomsRef: ref(getDatabase(), "chatRooms"),
		chatRooms: [],
		firstLoad: true,
		activeChatRoomId: ""
	}

	componentDidMount() {
		this.AddChatRoomsListeners();
	}

	componentWillUnmount() {
		off(this.state.chatRoomsRef);
	}

	AddChatRoomsListeners = () => { //db에서 실시간 가져오기
		let chatRoomsArray = [];

		onChildAdded(this.state.chatRoomsRef, DataSnapshot => {
				chatRoomsArray.push(DataSnapshot.val());
				this.setState({ chatRooms: chatRoomsArray },
						() => this.setFirstChatRoom());
				//this.addNotificationListener(DataSnapshot.key);
		})

}

	setFirstChatRoom = () => {
		const firstChatRoom = this.state.chatRooms[0]
		if (this.state.firstLoad && this.state.chatRooms.length > 0) {
			this.props.dispatch(setCurrentChatRoom(firstChatRoom))
			this.setState({ activeChatRoomId: firstChatRoom.id })
		}
		this.setState({ firstLoad: false })

	}

	handleClose = () => this.setState({ show: false });
	handleShow = () => this.setState({ show: true });

	handleSubmit = (e) => {
		e.preventDefault(); //임의로 페이지 refresh 막기
		const { name, description } = this.state;

		if (this.isFormValid(name, description)) { //유효성 체크
			this.addChatRoom();
		}

	}

	isFormValid = (name, description) => name && description;


	changeChatRoom = (room) => {
		this.props.dispatch(setCurrentChatRoom(room));
		this.props.dispatch(setPrivateChatRoom(false));
		this.setState({ activeChatRoomId: room.id })
	}

	renderChatRooms = (chatRooms) =>
		chatRooms.length > 0 &&
		chatRooms.map(room => (
			<li
				key={room.id}
				style={{
					backgroundColor: room.id === this.state.activeChatRoomId &&
						"#ffffff45"
				}}
				onClick={() => this.changeChatRoom(room)}
			>
				# {room.name}
			</li>
		))

	addChatRoom = async () => {
		const key = push(this.state.chatRoomsRef).key;		//자동생성키
		const { name, description } = this.state;
		const { user } = this.props
		const newChatRoom = {
			id: key,
			name: name,
			description: description,
			createdBy: {
				name: user.displayName,
				image: user.photoURL
			}
		}

		try { //db upload
			await update(child(this.state.chatRoomsRef, key), newChatRoom)
			this.setState({
				name: "",
				description: "",
				show: false
			})
		} catch (error) {
			alert(error)
		}
	}




	render() {
		return (
			<div>

				<div style={{
					position: 'relative', width: '100%',
					display: 'flex', alignItems: 'center'
				}}>

					<FaRegSmileWink style={{ marginRight: 3 }} />
					CHAT ROOMS {" "} (1)

					<FaPlus
						onClick={this.handleShow}
						style={{
							position: 'absolute',
							right: 0, cursor: 'pointer'
						}} />
				</div>


				<ul style={{ listStyleType: 'none', padding: 0 }}>
					{this.renderChatRooms(this.state.chatRooms)}
				</ul>

				{/* ADD CHAT ROOM MODAL */}
				<Modal show={this.state.show} onHide={this.handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Create a chat room</Modal.Title>
					</Modal.Header>

					<Modal.Body>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId="formBasicEmail">
								<Form.Label>방 이름</Form.Label>
								<Form.Control
									onChange={(e) => this.setState({ name: e.target.value })}
									type="text" placeholder="Enter a chat room name" />
							</Form.Group>

							<Form.Group controlId="formBasicPassword">
								<Form.Label>방 설명</Form.Label>
								<Form.Control
									onChange={(e) => this.setState({ description: e.target.value })}
									type="text" placeholder="Enter a chat room description" />
							</Form.Group>
						</Form>

					</Modal.Body>

					<Modal.Footer>
						<Button variant="secondary" onClick={this.handleClose}>
							Close
						</Button>
						<Button variant="primary" onClick={this.handleSubmit}>
							Create
						</Button>
					</Modal.Footer>
				</Modal>

			</div>
		)
	}
}


const mapStateToProps = state => {
	return {
		user: state.user.currentUser
	}
}

export default connect(mapStateToProps)(ChatRooms) 