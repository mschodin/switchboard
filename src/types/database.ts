// Database enums
export type EndpointStatus = 'active' | 'inactive' | 'deprecated'
export type RequestStatus = 'pending' | 'approved' | 'rejected'
export type UserRole = 'user' | 'admin'
export type Protocol = 'HTTP' | 'HTTPS' | 'gRPC' | 'WebSocket' | 'TCP' | 'UDP'

// Database tables
export interface Tag {
  id: string
  name: string
  slug: string
  color: string
  created_at: string
}

export interface UserRoles {
  id: string
  user_id: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface Endpoint {
  id: string
  icon_url: string | null
  company: string
  title: string
  description: string | null
  status: EndpointStatus
  protocol: Protocol
  address: string
  ports: string[] | null
  created_by: string | null
  created_at: string
  updated_at: string
  endpoint_tags?: {
    tag: Tag
  }[]
}

export interface EndpointRequest {
  id: string
  icon_url: string | null
  company: string
  title: string
  description: string | null
  protocol: Protocol
  address: string
  ports: string[] | null
  request_status: RequestStatus
  submitted_by: string
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string
  updated_at: string
  endpoint_request_tags?: {
    tag: Tag
  }[]
}

export interface EndpointTag {
  endpoint_id: string
  tag_id: string
  created_at: string
}

export interface EndpointRequestTag {
  request_id: string
  tag_id: string
  created_at: string
}
