'use server'

import { PostHog } from 'posthog-node'

const posthog = process.env.NODE_ENV === 'production' 
  ? new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_KEY!,
      { host: process.env.NEXT_PUBLIC_POSTHOG_HOST }
    )
  : null

export async function trackExportEvent(eventName: string, data: {
  format: string,
  font: string,
  paperStyle: string,
  error?: string
}) {
  console.log(process.env.NODE_ENV)
  
  try {
    posthog?.capture({
      distinctId: 'sweatheart',
      event: eventName,
      properties: data
    })
  } catch (error) {
    console.error('Failed to track event:', error)
  }
} 