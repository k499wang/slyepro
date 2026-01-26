'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

function getField(formData: FormData, key: string) {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

function redirectWithParams(path: string, key: string, message: string) {
  const params = new URLSearchParams({ [key]: message })
  redirect(`${path}?${params.toString()}`)
}

export async function login(formData: FormData) {
  const email = getField(formData, 'email')
  const password = getField(formData, 'password')

  if (!email || !password) {
    redirectWithParams('/login', 'error', 'Email and password are required.')
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    redirectWithParams('/login', 'error', error.message)
  }

  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const name = getField(formData, 'name')
  const email = getField(formData, 'email')
  const password = getField(formData, 'password')
  const confirmPassword = getField(formData, 'confirmPassword')

  if (!email || !password) {
    redirectWithParams('/signup', 'error', 'Email and password are required.')
  }

  if (password !== confirmPassword) {
    redirectWithParams('/signup', 'error', 'Passwords do not match.')
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: name ? { full_name: name } : undefined,
    },
  })

  if (error) {
    redirectWithParams('/signup', 'error', error.message)
  }

  if (data.session) {
    redirect('/dashboard')
  }

  redirectWithParams(
    '/login',
    'success',
    'Check your email to confirm your account.'
  )
}
