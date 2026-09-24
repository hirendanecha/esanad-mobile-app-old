import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { io } from 'socket.io-client';
import { AppState } from 'react-native';
import { env } from '@config/index';
import { useAuthStore } from '@store/authStore';

const SERVER_URL = env.API_URL;

const SocketContext = createContext({ socket: null, connected: false });

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const { token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      // if no auth token, ensure disconnected
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setConnected(false);
      return;
    }

    // initialize socket once per provider lifecycle (or per token change)
    if (!socketRef.current) {
      socketRef.current = io(SERVER_URL, {
        transports: ['websocket'],
        autoConnect: true, // we'll connect manually after setting auth
        // you can add reconnection options here
        // reconnectionAttempts: Infinity, reconnectionDelay: 1000
      });
    }

    const socket = socketRef.current;

    // attach auth and connect
    socket.auth = { token };
    socket.connect();

    const onConnect = () => setConnected(true);
    const onDisconnect = reason => {
      console.log('socket disconnected', reason);
      setConnected(false);
    };
    const onConnectError = err => {
      console.log('socket connect_error', err);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);

    // optional: handle app background to reduce battery / networking
    // const handleAppState = nextState => {
    //   if (!socket) return;
    //   if (nextState === 'background') socket.disconnect();
    //   if (nextState === 'active' && socket && !socket.connected)
    //     socket.connect();
    // };
    // const sub = AppState.addEventListener('change', handleAppState);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      socket.disconnect();
      socketRef.current = null;
      setConnected(false);
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
