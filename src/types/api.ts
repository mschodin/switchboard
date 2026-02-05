export interface ActionError {
  [key: string]: string[] | undefined
  root?: string[]
}

export interface ActionResult<T = unknown> {
  success?: boolean
  error?: ActionError
  data?: T
  message?: string
}

export interface AdminStats {
  pendingRequests: number
  totalEndpoints: number
  activeEndpoints: number
  totalUsers: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}
