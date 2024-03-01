import { useAuth } from '../hooks/useAuth'
import { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const defaultProvider = {
  socket: null
}

export const SocketContext = createContext(defaultProvider)

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { user } = useAuth()

  console.log(socket)

  useEffect(() => {
    if (user && !socket?.connected) {
      const socketIO = io(process.env.NEXT_PUBLIC_SOCKET_URL)
      setSocket(socketIO)
    } else socket?.disconnect()

    return () => {
      socket?.disconnect()
      setSocket(null)
    }
  }, [setSocket, user])

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
}

export { SocketProvider }
