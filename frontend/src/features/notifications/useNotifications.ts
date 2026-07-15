/**
 * useNotifications — loads the notifications overview from the backend.
 * Shared by the admin Notifications page and the header bell.
 */

import { useApiQuery } from '@/hooks/data/useApiQuery'
import { fetchNotifications, type NotificationsOverview } from './api'

export function useNotifications() {
  return useApiQuery<NotificationsOverview>((signal) => fetchNotifications(signal))
}
