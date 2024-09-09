import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import "./ChatRoom.css";
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { RoomRouter, MessageRouter, RoomMessageRouter} from '../../server';
import * as inter from '../../interface'

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
const room_message_trpc = createTRPCProxyClient<RoomMessageRouter>({
  links:[
    httpBatchLink({
      url: 'http://localhost:3000/api/room/message',
    })
  ]
})

function fetchData(key:string) {
  return fetch(key).then(resp => resp.json());
}

function roomListHook(){
  const {data, error} = useSWR(`${API_URL}/api/room/roomList`, fetchData);
  let res = null;
  if(data){
    res = data.result.data.data.rooms;
  }
  return {
    roomlist:res,
    error};
}



function RoomProfile({ value, onProfileClick }: { value: string; onProfileClick: () => void }) {
    const initial = value.charAt(0).toUpperCase(); 
    return (
    <div className="room-profile" onClick={onProfileClick}>
        <div className="initial-box">
          {initial}
        </div>
        <div className="room-name">
          {value}
        </div>
      </div>
    );
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


function ChatDispaly() {
    const [inputValue, setInputValue] = useState('');

    const handleSend = () => {
        if (inputValue.trim()) {
          setInputValue('');
        }
      };

    
    return (
        <div className='chat-display'>
          <div className='chat-title'>
            room
          </div>    
          <div className='chat-content'>
          <ChatChain user='User1' messages={['Hello', 'How are you?']} />
          <ChatChain user='User1' messages={['Hello', 'How are you?']} />
          </div>
          <div className="chat-input">
            <input
              className="input-box"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="输入消息..."
            />
            <button onClick={handleSend}>发送</button>
          </div>
        </div>
      );
};
      

const ChatRoom = () => {
  /*
  const [roomId, setRoom] = useState<string | null>(null);
  useEffect(() => {
    const fetchRoom = async () => {
      const data = await room_trpc.roomList.query();
      const roomlists: inter.RoomPreviewInfo[] = data.data.rooms;
      console.log(roomlists[0]);
      setRoom(roomlists[0].roomName);
    };
    fetchRoom();
  }, []);
  */
  const {roomlist, error} = roomListHook();
  if (roomlist){
    console.log(roomlist);
  }

  return (
    <div className="chat-room">
        <div className='chat-list'>
            <div className='chat-list-header'>
                <button className="add-button">+</button>
            </div>
            <div className="list-rows">
                <RoomProfile value="Room 1" onProfileClick={() => {}} />
                <RoomProfile value="Room 2" onProfileClick={() => {}} />
            </div>
        </div>
        <ChatDispaly/>
    </div>
  );
}

export default ChatRoom;