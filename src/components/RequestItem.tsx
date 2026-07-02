import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ProjectRequest } from '../types/api';
import { Spacing } from '../theme/tokens';
import { useColors } from '../theme/ThemeContext';
import { ColorPalette } from '../theme/colors';
import { Card } from './ui/Card';
import { Text } from './ui/Text';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Icon } from './ui/Icon';
import { relativeTime } from '../utils/date';

interface Props {
  request: ProjectRequest;
  isStaff?: boolean;
  onReply?: (id: string, message: string) => Promise<void>;
  onSetStatus?: (id: string, status: 'pending' | 'resolved' | 'dismissed') => Promise<void>;
  onArchive?: (id: string, archived: boolean) => Promise<void>;
}

const statusVariant: Record<ProjectRequest['status'], Parameters<typeof Badge>[0]['variant']> = {
  pending: 'secondary',
  resolved: 'primary',
  dismissed: 'outline',
};

export const RequestItem: React.FC<Props> = ({
  request,
  isStaff = false,
  onReply,
  onSetStatus,
  onArchive,
}) => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const [showReply, setShowReply] = useState(false);
  const [replyMsg, setReplyMsg] = useState('');
  const [loading, setLoading] = useState<string | null>(null);

  const handleReply = async () => {
    if (!replyMsg.trim() || !onReply) return;
    setLoading('reply');
    try {
      await onReply(request.id, replyMsg.trim());
      setReplyMsg('');
      setShowReply(false);
    } catch {
      // parent handles error display
    } finally {
      setLoading(null);
    }
  };

  const handleStatus = async (status: 'pending' | 'resolved' | 'dismissed') => {
    if (!onSetStatus) return;
    setLoading(status);
    try {
      await onSetStatus(request.id, status);
    } catch {
      // parent handles error
    } finally {
      setLoading(null);
    }
  };

  const handleArchive = async (archive: boolean) => {
    if (!onArchive) return;
    setLoading(archive ? 'archive' : 'unarchive');
    try {
      await onArchive(request.id, archive);
    } catch {
      // parent handles error
    } finally {
      setLoading(null);
    }
  };

  return (
    <Card style={styles.card} padding="md">
      <View style={styles.row}>
        <View style={styles.badges}>
          <Badge label={request.kind === 'idea' ? t('requests.kind_idea') : t('requests.kind_file')} variant="secondary" />
          <Badge label={request.status === 'pending' ? t('requests.status_pending') : request.status === 'resolved' ? t('requests.status_resolved') : t('requests.status_dismissed')} variant={statusVariant[request.status]} />
          {request.archived && <Badge label={t('requests.archivedBadge')} variant="outline" />}
        </View>
        <Text variant="metadata" color={Colors.outline}>
          {relativeTime(request.createdAt)}
        </Text>
      </View>

      <Text variant="bodyBase" color={Colors.onSurface} style={{ marginTop: 8 }}>
        {request.message}
      </Text>

      {isStaff && (
        <Text variant="metadata" color={Colors.outline} style={{ marginTop: 4 }}>
          {request.userEmail}
        </Text>
      )}

      {isStaff && (
        <>
          <View style={styles.actions}>
            <ActionButton
              label={t('common.reply')}
              icon="reply"
              onPress={() => setShowReply((v) => !v)}
              loading={loading === 'reply'}
              disabled={loading !== null}
              color={Colors.primary}
            />
            {request.status !== 'resolved' && (
              <ActionButton
                label={t('requests.markDone')}
                icon="check-circle"
                onPress={() => handleStatus('resolved')}
                loading={loading === 'resolved'}
                disabled={loading !== null}
                color={Colors.primary}
              />
            )}
            {request.status !== 'dismissed' && (
              <ActionButton
                label={t('requests.markDismissed')}
                icon="cancel"
                onPress={() => handleStatus('dismissed')}
                loading={loading === 'dismissed'}
                disabled={loading !== null}
                color={Colors.primary}
              />
            )}
            {request.status !== 'pending' && (
              <ActionButton
                label={t('common.reopen')}
                icon="restart-alt"
                onPress={() => handleStatus('pending')}
                loading={loading === 'pending'}
                disabled={loading !== null}
                color={Colors.primary}
              />
            )}
            <ActionButton
              label={request.archived ? t('common.unarchive') : t('common.archive')}
              icon={request.archived ? 'unarchive' : 'archive'}
              onPress={() => handleArchive(!request.archived)}
              loading={loading === 'archive' || loading === 'unarchive'}
              disabled={loading !== null}
              color={Colors.primary}
            />
          </View>

          {showReply && (
            <View style={styles.replyBox}>
              <Input
                value={replyMsg}
                onChangeText={setReplyMsg}
                placeholder={t('requests.replyPlaceholder')}
                multiline
                numberOfLines={3}
                containerStyle={styles.replyInput}
              />
              <View style={styles.replyActions}>
                <Button
                  title={t('common.cancel')}
                  variant="ghost"
                  size="small"
                  onPress={() => {
                    setShowReply(false);
                    setReplyMsg('');
                  }}
                  disabled={loading !== null}
                />
                <Button
                  title={loading === 'reply' ? t('common.sending') : t('common.send')}
                  size="small"
                  onPress={handleReply}
                  disabled={!replyMsg.trim() || loading !== null}
                />
              </View>
            </View>
          )}
        </>
      )}
    </Card>
  );
};

function ActionButton({
  label,
  icon,
  onPress,
  loading,
  disabled,
  color,
}: {
  label: string;
  icon: string;
  onPress: () => void;
  loading: boolean;
  disabled: boolean;
  color: string;
}) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled} style={actionStyles.btn} activeOpacity={0.7}>
      {loading ? (
        <ActivityIndicator size={16} color={color} />
      ) : (
        <Icon name={icon as React.ComponentProps<typeof Icon>['name']} size={16} color={color} />
      )}
      <Text variant="metadata" color={color} style={{ marginLeft: 4 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const actionStyles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const getStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    card: {
      marginBottom: Spacing.gutter,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    badges: {
      flexDirection: 'row',
      gap: 6,
    },
    actions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: 'rgba(224, 192, 180, 0.3)',
    },
    replyBox: {
      marginTop: 12,
    },
    replyInput: {
      marginBottom: 8,
    },
    replyActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
    },
  });