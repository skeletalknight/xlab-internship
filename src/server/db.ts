import * as inter from "../interface"

const trydata: inter.RoomPreviewInfo= {
    roomId: 0,
    roomName: "try",
    lastMessage: null,
}

let tryrooms: inter.RoomPreviewInfo[] = [trydata]

export const db = {
    room:{
        getRoomList: ():inter.RoomListRes => {
            return {
                rooms: tryrooms
            }
        },
        addRoomList: (args:inter.RoomAddArgs):inter.RoomAddRes => {
            const roomId = tryrooms.length
            tryrooms.push({
                roomId: roomId,
                roomName: args.roomName,
                lastMessage: null,
            })
            return {
                roomId: roomId
            }
        }
    }
}