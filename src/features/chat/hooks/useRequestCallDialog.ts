import { useDisclosure } from '@/src/shared/hooks/use-disclosure'
import { EndUser } from '@/src/shared/types/enduser.type'
import React from 'react'

const useRequestCallDialog = () => {
    const {open,isOpen,close}=useDisclosure()
    const [sender,setSender]=React.useState<EndUser>()
    const [callingConversationId,setCallingConversationId]=React.useState<string>()
  return {
    open,
    isOpen,
    close,
    sender,
    setSender,
    callingConversationId,
    setCallingConversationId
  }
}

export default useRequestCallDialog