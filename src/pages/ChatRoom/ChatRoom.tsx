import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useSWR, { mutate }  from 'swr';
import "./ChatRoom.css";
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { RoomRouter, MessageRouter} from '../../server';
import * as inter from '../../interface'
import Modal from './Modal/Modal';

const API_URL = 'http://localhost:3000';

const room_trpc = createTRPCProxyClient<RoomRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/room',
    }),
  ],
});
const message_trpc = createTRPCProxyClient<MessageRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/api/message',
    }),
  ],
});


function roomListHook(){
  const {data, error} = useSWR("roomList", room_trpc.list.query, {refreshInterval: 300});
  let res = null;
  if(data){
    res = data.data.rooms as inter.RoomPreviewInfo[];
  }
  return {
    roomlist:res,
    error};
}

function messageListHook(roomId:number){
  const req_ListMessage:inter.RoomMessageListArgs = {roomId:roomId};
  const {data, error} = useSWR("messageList",
  key => {return room_trpc.message.list.query(req_ListMessage)}, {refreshInterval: 300});
  let res = null;
  if(data && data.data){
    res = data.data.messages as inter.Message[];
  }
  return {
    messagelist:res,
    error};
  
}

async function click_AddRoom(userName:string, roomName:string){
  const req_AddRoom:inter.RoomAddArgs = {user:userName, roomName:roomName};
  const res = await room_trpc.add.mutate(req_AddRoom);
  console.log(res);
}

async function click_DeleteRoom(userName:string, roomId:number){
  const req_DelRoom:inter.RoomDeleteArgs = {user:userName, roomId:roomId};
  const res = await room_trpc.delete.mutate(req_DelRoom);
  console.log(res);
}

function RoomList({user, changeRoom}:{user:string, changeRoom: (roomId:number|null) => void}) {
  const {roomlist, error} = roomListHook(); 
  if(roomlist){
    return (
      <div className="room-list">
        {roomlist.map((room:inter.RoomPreviewInfo) => (
          <RoomProfile key={room.roomId} value={room.roomName}
           onProfileClick={async () => {
            await changeRoom(room.roomId);
            mutate("messageList");}} 
           deleteClick={async () => {
            await click_DeleteRoom(user, room.roomId);
            changeRoom(null);
            mutate("messageList");}}/>
        ))}
      </div>
    );
  }
  else{
    return(<div className="room-list"></div>);
  }
}

function RoomProfile({ value, onProfileClick, deleteClick }:
   { value: string; onProfileClick: () => void; deleteClick: () => void }) {
    const initial = value.charAt(0).toUpperCase(); 
    return (
    <div className="room-profile" onClick={onProfileClick}>
        <div className="initial-box">
          {initial}
        </div>
        <div className="room-name">
          {value}
        </div>
        <button className="delete-room-button" onClick={(e) => {
                e.stopPropagation();
                deleteClick();
            }}>
                x
        </button>
      </div>
    );
  }

function AddRoomModal({user, CloseModal}: {user:string, CloseModal: () => void}) {
  const [inputValue, setInputValue] = useState('');
  const handleSend = async () => {
    if (inputValue.trim()) {
      setInputValue('');
      await click_AddRoom(user, inputValue);
      mutate("roomList");
      CloseModal();
    }
  };

  return(
    <div className="add-room-modal">
      <h2 className='add-room-title'>Add New Room</h2>
      <div className="add-room-input-container">
      Name:
      <input
              className="add-room-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
        />  
      </div>
      <button className="add-room-button" onClick={()=>handleSend()}>Submit</button>
    </div>
  )
}

 
function ChatChain({ user, messages }: { user: string; messages: string[] }) {
    const initial = user.charAt(0).toUpperCase(); 
    return (
      <div className="chat-chain">
          <div className="chain-avatar">
              {initial}
          </div>
          <div className="message-chain">
              <div className="username">{user}</div>
                {messages.map((msg, index) => (
                    <div key={index} className="messages">
                    <p  className="message">{msg}</p>
                    </div>
                ))}
          </div>
      </div>
  );
};
function displayMessage({messagelist}:{messagelist: inter.Message[]}) {
  let result:{user:string, messages:string[]}[] = [];
  let user:string = messagelist[0].sender;
  let messages:string[] = [];
  for (let i = 0; i < messagelist.length; i++) {
    if (messagelist[i].sender === user) {
      messages.push(messagelist[i].content);
    }
    else {
      result.push({user, messages});
      user = messagelist[i].sender;
      messages = [messagelist[i].content];
    }
  }
  result.push({user, messages});
  return result.map((item, index) => <ChatChain key={index} user={item.user} messages={item.messages} />);
}

function ChatDispaly({RoomId,user}:{RoomId: number, user:string}) {
    const [inputValue, setInputValue] = useState('');
    const {roomlist} = roomListHook();
    const roomName = roomlist?.find(room => room.roomId === RoomId)?.roomName || '';
    const {messagelist} = messageListHook(RoomId);
    const messagesDisplay = messagelist && messagelist.length > 0
    ? displayMessage({messagelist}):<div></div>;
    const handleSend = async () => {
        if (inputValue.trim()) {
          const req_AddMessage:inter.MessageAddArgs = {
            roomId: RoomId,
            content: inputValue,
            sender: user
          }
          await message_trpc.add.mutate(req_AddMessage);
          mutate("messageList");
          setInputValue('');
        }
      };

    
    return (
        <div className='chat-display'>
          <div className='chat-title'>
            {roomName}
          </div>    
          <div className='chat-content'>
          {messagesDisplay}
          </div>
          <div className="chat-input">
            <input
              className="input-box"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入消息..."
            />
            <button className='send-button' onClick={handleSend}>发送</button>
          </div>
        </div>
      );
};
      

const ChatRoom = () => {
  const [RoomId, setRoom] = useState<number | null>(null);
  const [if_AddRoomModal, setAddRoomModal] = useState(false);
  const {roomlist, error} = roomListHook();

  const loacation = useLocation();
  const userName = loacation.state;
  if (!userName) {window.location.href = "/";return null;}
  if (RoomId === null && roomlist) {
    const reset_room = async () => {
      await setRoom(roomlist[0].roomId);
      mutate("messageList");
    }
    reset_room();
  }

  const displayRoom = RoomId ? <ChatDispaly RoomId={RoomId} user={userName}/> : <div>loading</div>;
  return (
    <div className="chat-room">
        <div className='chat-list'>
            <div className='chat-list-header'>
                <button className="add-button" onClick={() => setAddRoomModal(true)}>+</button>
            </div>
            <RoomList user={userName} changeRoom={id => {setRoom(id)}}/>
        </div>
        {displayRoom}
        <Modal isOpen={if_AddRoomModal} onClose={() => (setAddRoomModal(false))}>
        <AddRoomModal user={userName} CloseModal={() => (setAddRoomModal(false))}/>
        </Modal> 
    </div>
  );
}

export default ChatRoom;