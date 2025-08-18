"use client"

import { useState, useEffect } from "react"
import { Users, MapPin, Clock } from "lucide-react"

export default function SocialProofBanner() {
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    {
      icon: Users,
      text: "Sarah uit Amsterdam boekte zojuist een vlucht naar Barcelona voor €67",
      time: "2 minuten geleden",
    },
    {
      icon: MapPin,
      text: "Mark uit Rotterdam vond een deal naar Istanbul voor €89",
      time: "5 minuten geleden",
    },
    {
      icon: Users,
      text: "Lisa uit Utrecht boekte een vlucht naar Londen voor €45",
      time: "8 minuten geleden",
    },
    {
      icon: Clock,
      text: "Kevin uit Den Haag spaarde €178 op een vlucht naar Rome",
      time: "12 minuten geleden",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const message = messages[currentMessage]
  const MessageIcon = message.icon

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm">
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 transform transition-all duration-500 hover:scale-105">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <MessageIcon className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 font-medium leading-tight">{message.text}</p>
            <p className="text-xs text-gray-500 mt-1">{message.time}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
