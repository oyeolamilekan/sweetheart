'use server'

import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!,
  token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN!,
})

export async function trackExportEvent(eventName: string, data: {
  format: string,
  font: string,
  paperStyle: string,
  error?: string
}) {
  try {
    const timestamp = new Date().toISOString()
    const logEntry = {
      timestamp,
      event: eventName,
      ...data
    }
    
    await redis.lpush('app_events', JSON.stringify(logEntry))
  } catch (error) {
    console.error('Failed to track event:', error)
  }
} 