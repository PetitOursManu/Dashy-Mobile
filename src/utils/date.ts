import { i18n } from '../i18n/config';

export function relativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return i18n.t('time.justNow');
  if (diffMin < 60) return i18n.t('time.mAgo', { count: diffMin });
  if (diffHour < 24) return i18n.t('time.hAgo', { count: diffHour });
  if (diffDay < 30) return i18n.t('time.dAgo', { count: diffDay });

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}