import { createServerComponentClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

// Get current authenticated user (server component)
export async function getCurrentUser() {
  const supabase = await createServerComponentClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

// Require authentication (redirect to login if not authenticated)
export async function requireAuth() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/login')
  }

  return user
}

// Get user profile from database
export async function getUserProfile(userId: string) {
  const supabase = await createServerComponentClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    return null
  }

  return profile
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: string) {
  const profile = await getUserProfile(userId)

  if (!profile) return false

  return (
    profile.subscription_status === 'active' &&
    profile.subscription_tier !== 'free'
  )
}

// Get subscription tier
export async function getSubscriptionTier(userId: string) {
  const profile = await getUserProfile(userId)
  return profile?.subscription_tier || 'free'
}
