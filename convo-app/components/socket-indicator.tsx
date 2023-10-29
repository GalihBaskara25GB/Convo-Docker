"use client"

import React from 'react'
import { useSocket } from './providers/socket-provider'
import { Badge, BadgeAlert, BadgeAlertIcon, Cloud, CloudOff } from 'lucide-react'

export const SocketIndicator = () => {
  const { isConnected } = useSocket()
  if(!isConnected) {
    return (
      <CloudOff color='gray' /> 
    )
  }
  
  return (
    <Cloud color='#64d385' />
  )
}
