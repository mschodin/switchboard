import { Endpoint, EndpointRequest, Tag } from './database'

export interface EndpointWithTags extends Endpoint {
  tags: Tag[]
}

export interface EndpointRequestWithTags extends EndpointRequest {
  tags: Tag[]
}

export interface EndpointFilters {
  tags: string[]
  search: string
}
