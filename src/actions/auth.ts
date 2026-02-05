'use server'

import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { loginSchema, registerSchema } from '@/lib/validators'
import type { ActionResult } from '@/types/api'
import type { UserRole } from '@/types/database'

export async function login(formData: FormData): Promise<ActionResult> {
  const supabase = createServerClient()

  const validated = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  })

  if (error) {
    return { error: { root: [error.message] } }
  }

  redirect('/')
}

export async function register(formData: FormData): Promise<ActionResult> {
  const supabase = createServerClient()

  const validated = registerSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  })

  if (!validated.success) {
    return { error: validated.error.flatten().fieldErrors }
  }

  const { error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
  })

  if (error) {
    if (error.message.includes('already registered')) {
      return { error: { email: ['This email is already registered'] } }
    }
    return { error: { root: [error.message] } }
  }

  return { success: true, message: 'Account created successfully. You can now log in.' }
}

export async function logout() {
  const supabase = createServerClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function getSession() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}

export async function getUserRole(): Promise<UserRole | null> {
  const supabase = createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  return data?.role ?? 'user'
}
