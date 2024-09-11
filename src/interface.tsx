export interface Response {
  messages: "";
  code: 0;
  data: any | null;
}

export interface Message {
    messageId: number; 
    roomId: number; 
    sender: string; 
    content: string; 
    time: number; 
  }
  
export interface RoomPreviewInfo {
    roomId: number;
    roomName: string;
    lastMessage: Message | null; 
  }

export interface RoomAddArgs {
  user: string
  roomName: string;
}

export interface RoomAddRes {
  roomId: number;
}

export interface RoomListRes {
  rooms: RoomPreviewInfo[];
}

export interface RoomDeleteArgs {
  user:string;
  roomId: number;
}

export interface MessageAddArgs {
  roomId: number;
  content: string;
  sender: string;
}

export interface RoomMessageListArgs {
  roomId: number;
}

export interface RoomMessageListRes {
  messages: Message[];
}

