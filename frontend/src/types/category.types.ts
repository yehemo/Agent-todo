export interface Category {
  id: number
  name: string
  color: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface CreateCategoryPayload {
  name: string
  color: string
  description?: string
}

export interface UpdateCategoryPayload extends Partial<CreateCategoryPayload> {}
