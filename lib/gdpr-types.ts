// types for GDPR compliance
export interface DataRequest {
  id: string
  user_id: string
  request_type: 'article_15' | 'article_20'
  email: string
  status: 'pending' | 'completed' | 'expired' | 'rejected'
  requested_at: string
  completed_at?: string
  expires_at: string
  metadata?: {
    ip_address?: string
    user_agent?: string
  }
}

export interface DeletionRequest {
  id: string
  user_id: string
  email: string
  status: 'pending' | 'completed' | 'cancelled' | 'failed'
  requested_at: string
  completed_at?: string
  scheduled_deletion_at: string
  metadata?: {
    ip_address?: string
    user_agent?: string
  }
}

export interface UserDataExport {
  exportDate: string
  dataVersion: string
  gdprCompliance: {
    description: string
    exportedAt: string
    personalDataIncluded: boolean
  }
  user: {
    id: string
    email: string
    emailVerified?: string
    createdAt: string
    lastSignInAt?: string
  }
  profile?: any
  books?: any[]
  chapters?: any[]
  comments?: any[]
  following?: any[]
  followers?: any[]
}
