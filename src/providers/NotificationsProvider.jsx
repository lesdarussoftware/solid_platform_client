import { createContext, useContext, useEffect, useState } from "react"
import io from 'socket.io-client'

import { AuthContext } from "./AuthProvider"
import { DataContext } from "./DataProvider"
import { MessageContext } from "./MessageProvider"

import { BASE_URL } from "../helpers/urls"

export const NotificationsContext = createContext({
    socket: null,
    sendMessage: () => { }
})

export function NotificationsProvider({ children }) {

    const { auth } = useContext(AuthContext)
    const { state, dispatch } = useContext(DataContext)
    const { setSeverity, setMessage, setOpenMessage } = useContext(MessageContext)

    const [socket, setSocket] = useState(null)

    useEffect(() => {

        const socketInstance = io(BASE_URL.replace('/api', ''))

        socketInstance.on('notifyQrScan', (serverMsg) => {
            if (auth?.role === 'ADMIN') {
                setSeverity('success')
                setMessage(serverMsg.message)
                setOpenMessage(true)
                if (serverMsg.data) {
                    dispatch({
                        type: 'MOVEMENTS',
                        payload: [serverMsg.data, ...state.movements]
                    })
                }
            }
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.off('notifyQrScan')
            socketInstance.close()
        }
    }, [state, auth])

    const sendMessage = (message) => {
        if (socket) {
            socket.emit('qrScan', message)
        }
    }

    return (
        <NotificationsContext.Provider value={{ socket, sendMessage }}>
            {children}
        </NotificationsContext.Provider>
    )
}
