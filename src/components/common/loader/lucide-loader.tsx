import React from 'react'
import { Loader } from 'lucide-react'
const LucideLoader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader className="animate-spin text-muted-foreground size-5" />
    </div>
  )
}

export default LucideLoader