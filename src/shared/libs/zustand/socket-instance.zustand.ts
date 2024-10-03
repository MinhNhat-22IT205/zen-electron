import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { SERVER_SOCKET_URL } from "../socketio/client-socket.base";

interface SocketState {
  socket: Socket | null;
  setSocket: (socket: Socket) => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  setSocket: (socket: Socket) => set({ socket }),
}));
