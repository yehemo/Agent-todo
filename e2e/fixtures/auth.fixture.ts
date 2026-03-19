import { request } from '@playwright/test'

export async function loginViaApi(email: string, password: string): Promise<string> {
  const context = await request.newContext({
    baseURL: 'http://localhost:8000',
  })

  const response = await context.post('/api/v1/auth/login', {
    data: { email, password },
  })

  const body = await response.json()
  await context.dispose()
  return body.data.token
}

export const DEMO_USER = {
  email: 'demo@example.com',
  password: 'password',
}
