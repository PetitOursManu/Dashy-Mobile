import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput as RNTextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Spacing, Radius, Typography } from '../../theme/tokens';
import { useColors } from '../../theme/ThemeContext';
import { ColorPalette } from '../../theme/colors';
import { Text } from '../../components/ui/Text';
import { Card } from '../../components/ui/Card';
import { Icon } from '../../components/ui/Icon';
import { Button } from '../../components/ui/Button';
import { Loading } from '../../components/ui/Loading';
import { EmptyState } from '../../components/ui/EmptyState';
import { DrawerMenuButton } from '../../components/DrawerMenuButton';
import { useSync } from '../../context/SyncContext';
import { ChatMessage, ChatProposal } from '../../types/api';
import * as chatApi from '../../api/chat';
import * as requestsApi from '../../api/requests';

interface UIMessage extends ChatMessage {
  id: string;
  proposal?: ChatProposal;
  pending?: boolean;
}

let msgIdCounter = 0;
const genId = () => `msg-${++msgIdCounter}`;

export const DashboardChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const { sync } = useSync();
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<{ available: boolean; canRequest: boolean } | null>(
    sync?.chat ?? null,
  );
  const scrollRef = useRef<FlatList>(null);

  useEffect(() => {
    if (sync?.chat) {
      setStatus(sync.chat);
    } else {
      chatApi.getChatStatus().then(setStatus).catch(() => {});
    }
  }, [sync?.chat]);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError(null);
    const userMsg: UIMessage = { id: genId(), role: 'user', content: trimmed };
    const pendingMsg: UIMessage = { id: genId(), role: 'assistant', content: '', pending: true };

    const history: ChatMessage[] = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg, pendingMsg]);
    setInput('');
    setLoading(true);
    scrollToBottom();

    try {
      const { reply, proposal } = await chatApi.sendChat(history);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingMsg.id
            ? { ...m, content: reply, proposal, pending: false }
            : m,
        ),
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('chat.failedResponse');
      setMessages((prev) => prev.filter((m) => m.id !== pendingMsg.id));
      setError(msg);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleRequestAccess = async () => {
    try {
      await requestsApi.createRequest({
        kind: 'idea',
        message: t('chat.requestAccessMessage'),
      });
      setError(null);
      setStatus((prev) => prev ? { ...prev } : prev);
      // Show a confirmation
      setMessages([{
        id: genId(),
        role: 'assistant',
        content: t('chat.requestSent'),
      }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('chat.failedSendRequest'));
    }
  };

  // Chat not available
  if (status && !status.available) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top', 'left', 'right']}>
        <LinearGradient
          colors={['rgba(246, 222, 205, 0.4)', Colors.background]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.4 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <DrawerMenuButton />
            <Text variant="headlinePage" color={Colors.onSurface} style={{ marginLeft: 8 }}>
              {t('chat.dashyBot')}
            </Text>
          </View>
          <Card padding="lg" style={styles.card}>
            <View style={styles.iconCircleRow}>
              <View style={[styles.iconCircle, { backgroundColor: Colors.primaryContainer }]}>
                <Icon name="smart-toy" size={32} color={Colors.onPrimary} />
              </View>
            </View>
            <Text variant="headlineSection" color={Colors.onSurface} style={{ textAlign: 'center', marginTop: 16 }}>
              {t('chat.dashyAiAssistant')}
            </Text>
            <Text variant="bodyBase" color={Colors.onSurfaceVariant} style={{ textAlign: 'center', marginTop: 8 }}>
              {t('chat.assistantNotAvailable')}
            </Text>
            {status.canRequest && (
              <Button
                title={t('chat.requestAccess')}
                onPress={handleRequestAccess}
                fullWidth
                style={{ marginTop: 16 }}
              />
            )}
          </Card>
        </View>
      </SafeAreaView>
    );
  }

  const renderMessage = ({ item }: { item: UIMessage }) => {
    const isUser = item.role === 'user';
    return (
      <View style={[styles.msgRow, isUser ? styles.msgRowUser : styles.msgRowBot]}>
        {!isUser && (
          <View style={[styles.botAvatar, { backgroundColor: Colors.primaryContainer }]}>
            <Icon name="smart-toy" size={18} color={Colors.onPrimary} />
          </View>
        )}
        <View
          style={[
            styles.bubble,
            isUser ? styles.bubbleUser : styles.bubbleBot,
            { backgroundColor: isUser ? Colors.primary : Colors.surfaceContainerLowest },
          ]}
        >
          {item.pending ? (
            <View style={styles.typingRow}>
              <View style={[styles.typingDot, { backgroundColor: Colors.outline }]} />
              <View style={[styles.typingDot, { backgroundColor: Colors.outline }]} />
              <View style={[styles.typingDot, { backgroundColor: Colors.outline }]} />
            </View>
          ) : (
            <Text
              variant="bodyBase"
              color={isUser ? Colors.onPrimary : Colors.onSurface}
              style={styles.msgText}
            >
              {item.content}
            </Text>
          )}
          {item.proposal && (
            <View style={[styles.proposalBox, { backgroundColor: Colors.secondaryContainer }]}>
              <View style={styles.proposalHeader}>
                <Icon name="lightbulb" size={14} color={Colors.onSecondaryContainer} />
                <Text variant="labelCaps" color={Colors.onSecondaryContainer} style={{ marginLeft: 4 }}>
                  {t('chat.storeProposal')}
                </Text>
              </View>
              <Text variant="metadata" color={Colors.onSecondaryContainer} style={{ marginTop: 4 }}>
                {item.proposal.type === 'add_app'
                  ? t('chat.installApp', { name: item.proposal.name || item.proposal.manifest || '' })
                  : item.proposal.type === 'add_source'
                  ? t('chat.addSource', { name: item.proposal.name || '' })
                  : t('chat.addCatalogue', { name: item.proposal.name || '' })}
              </Text>
              <Text variant="metadata" color={Colors.outline} style={{ marginTop: 2 }}>
                {t('chat.confirmWebDashboard')}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors.background }]} edges={['top', 'left', 'right']}>
      <LinearGradient
        colors={['rgba(246, 222, 205, 0.4)', Colors.background]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 0.4 }}
        style={StyleSheet.absoluteFill}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboard}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.headerRow}>
          <DrawerMenuButton />
          <Text variant="headlinePage" color={Colors.onSurface} style={{ marginLeft: 8 }}>
            {t('chat.dashyBot')}
          </Text>
        </View>

        {messages.length === 0 && !error ? (
          <View style={styles.emptyContainer}>
            <EmptyState
              icon="smart-toy"
              title={t('chat.askDashyBot')}
              subtitle={t('chat.askDashyBotSubtitle')}
            />
          </View>
        ) : (
          <FlatList
            ref={scrollRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={styles.msgList}
            onContentSizeChange={scrollToBottom}
          />
        )}

        {error && (
          <View style={styles.errorBar}>
            <Icon name="error" size={16} color={Colors.error} />
            <Text variant="bodyBase" color={Colors.error} style={{ marginLeft: 8, flex: 1 }}>
              {error}
            </Text>
            <TouchableOpacity onPress={() => setError(null)}>
              <Icon name="close" size={18} color={Colors.error} />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.inputBar}>
          <View style={[styles.inputWrap, { borderColor: Colors.outlineVariant, backgroundColor: 'rgba(255,255,255,0.6)' }]}>
            <RNTextInput
              value={input}
              onChangeText={setInput}
              placeholder={t('chat.messagePlaceholder')}
              placeholderTextColor={Colors.outline}
              multiline
              maxLength={4000}
              style={[styles.input, { color: Colors.onSurface }]}
              editable={!loading}
            />
          </View>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || loading}
            style={[
              styles.sendBtn,
              { backgroundColor: (!input.trim() || loading) ? Colors.outlineVariant : Colors.primary },
            ]}
            activeOpacity={0.8}
          >
            <Icon name="send" size={20} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const getStyles = (Colors: ColorPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: Spacing.marginMobile,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.marginMobile,
      paddingBottom: 8,
    },
    card: {
      alignItems: 'center',
      marginTop: 24,
    },
    iconCircleRow: {
      alignItems: 'center',
    },
    iconCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    keyboard: {
      flex: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    msgList: {
      paddingHorizontal: Spacing.marginMobile,
      paddingBottom: 8,
      flexGrow: 1,
    },
    msgRow: {
      flexDirection: 'row',
      marginVertical: 4,
      maxWidth: '100%',
    },
    msgRowUser: {
      justifyContent: 'flex-end',
    },
    msgRowBot: {
      justifyContent: 'flex-start',
    },
    botAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 8,
      marginTop: 2,
    },
    bubble: {
      borderRadius: Radius.lg,
      paddingHorizontal: 14,
      paddingVertical: 10,
      maxWidth: '80%',
    },
    bubbleUser: {
      borderBottomRightRadius: Radius.sm,
    },
    bubbleBot: {
      borderBottomLeftRadius: Radius.sm,
    },
    msgText: {
      flexShrink: 1,
    },
    typingRow: {
      flexDirection: 'row',
      gap: 4,
      paddingVertical: 4,
    },
    typingDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      opacity: 0.5,
    },
    proposalBox: {
      borderRadius: Radius.md,
      padding: 10,
      marginTop: 8,
    },
    proposalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    errorBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing.marginMobile,
      paddingVertical: 8,
      backgroundColor: Colors.errorContainer,
    },
    inputBar: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: Spacing.marginMobile,
      paddingTop: 8,
      paddingBottom: 20,
      gap: 8,
    },
    inputWrap: {
      flex: 1,
      borderRadius: Radius.lg,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 8,
      minHeight: 44,
      maxHeight: 120,
    },
    input: {
      ...Typography.bodyBase,
      paddingVertical: 0,
      textAlignVertical: 'top',
    },
    sendBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });