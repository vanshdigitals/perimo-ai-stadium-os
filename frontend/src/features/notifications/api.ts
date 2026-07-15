/**
 * Notifications API types + fetchers.
 * Mirrors `backend/src/domains/notifications/schema.py`.
 */

import { apiClient } from '@/platform/api/client'

export type NotificationCategory = 'critical' | 'warning' | 'info' | 'resolved'

export interface Notification {
  id: string
  title: string
  description: string
  category: NotificationCategory
  time: string
  read: boolean
  action?: string | null
}

export interface NotificationsSummary {
  unread: number
  critical: number
  warning: number
  resolved_today: number
}

export interface NotificationsOverview {
  notifications: Notification[]
  summary: NotificationsSummary
}

export function fetchNotifications(signal: AbortSignal): Promise<NotificationsOverview> {
  return apiClient.get<NotificationsOverview>('/v1/notifications', { signal })
}

export function markAllNotificationsRead(): Promise<NotificationsOverview> {
  return apiClient.post<NotificationsOverview>('/v1/notifications/read-all')
}
