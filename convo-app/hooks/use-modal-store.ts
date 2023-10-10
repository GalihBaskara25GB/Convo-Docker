import { create } from "zustand"
import { Server } from "@prisma/client"

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer"

interface ModalData {
  server?: Server
}

interface ModalStore {
  type: ModalType | null
  isOpen: boolean
  data: ModalData
  onOpen: (type: ModalType, data?: ModalData) => void
  onClose: () => void
}

export const useModal = create<ModalStore>((set: any) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type: any, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false})
}))