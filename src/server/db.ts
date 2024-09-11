import * as inter from "../interface"
import * as fs from 'fs';
import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',   // 数据库主机
    user: 'root', // 数据库用户名
    password: 'mysql', // 数据库密码
    database: 'chat_room' // 数据库名
});

try {
    await connection.connect();
    console.log('成功连接到数据库！');
} catch (error) {
    console.error('连接失败:', error);
}


export const db = {
    room:{
        getRoomList: async() => {
            const [rows] = await connection.query('SELECT * FROM room');
            return {
                rooms: rows
            }
        },
        addRoomList: async(args:inter.RoomAddArgs) => {
            const [result] = await connection.execute(
                'INSERT INTO room (roomName, lastMessage) VALUES (?, ?)',
                [args.roomName, null]);
            const insertResult = result as mysql.ResultSetHeader;
            return {
                roomId: insertResult.insertId,
            }
        },
        deleteRoomList: async(args:inter.RoomDeleteArgs) => {
            const [result] = await connection.execute(
                'DELETE FROM room WHERE roomId = ?',
                 [args.roomId]);
            const deleteResult = result as mysql.ResultSetHeader;
            return null;
        }
    },
    message:{
      addMessage: async(args:inter.MessageAddArgs) => {
            const [result] = await connection.execute(
                'INSERT INTO message (roomId, sender, content, time) VALUES (?, ?, ?, ?)',
                [args.roomId, args.sender, args.content, Date.now()]);
            const insertResult = result as mysql.ResultSetHeader;
            return null;
      }
    },
    room_message:{
        getRoomMessageList: async(args:inter.RoomMessageListArgs) => {
            const [rows] = await connection.query('SELECT * FROM message WHERE roomId = ? ORDER BY time ASC', [args.roomId]);
            return {
                messages: rows
            }
        },
    }
}