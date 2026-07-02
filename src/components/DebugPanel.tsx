import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Radius, Spacing } from '../theme/tokens';
import { useColors } from '../theme/ThemeContext';
import { ColorPalette } from '../theme/colors';
import { Text } from './ui/Text';
import { Button } from './ui/Button';
import { getServerUrl } from '../utils/storage';

interface Log {
  type: 'info' | 'error' | 'success';
  message: string;
}

export const DebugPanel: React.FC = () => {
  const Colors = useColors();
  const styles = useMemo(() => getStyles(Colors), [Colors]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [expanded, setExpanded] = useState(false);

  const addLog = (type: Log['type'], message: string) => {
    setLogs((prev) => [...prev, { type, message: `[${new Date().toLocaleTimeString()}] ${message}` }]);
  };

  const runTests = async () => {
    setLogs([]);
    addLog('info', 'Starting network diagnostics...');

    const serverUrl = await getServerUrl();
    addLog('info', `Stored server URL: ${serverUrl ?? 'none'}`);

    if (!serverUrl) {
      addLog('error', 'No server URL configured.');
      return;
    }

    const base = serverUrl.replace(/\/$/, '');

    // Test 1: GET /info
    try {
      addLog('info', `GET ${base}/api/mobile/v1/info`);
      const infoRes = await fetch(`${base}/api/mobile/v1/info`);
      const infoText = await infoRes.text();
      addLog(infoRes.ok ? 'success' : 'error', `Status ${infoRes.status}: ${infoText}`);
    } catch (err) {
      addLog('error', `GET /info failed: ${err instanceof Error ? err.message : String(err)}`);
    }

    // Test 2: POST /auth/login with fake credentials (to verify endpoint shape)
    const dummyBody = {
      email: 'debug@example.com',
      password: 'debugpassword123',
      device: 'Android Debug',
    };
    try {
      addLog('info', `POST ${base}/api/mobile/v1/auth/login (dummy credentials)`);
      addLog('info', `Request body: ${JSON.stringify(dummyBody)}`);
      const loginRes = await fetch(`${base}/api/mobile/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dummyBody),
      });
      const loginText = await loginRes.text();
      addLog(loginRes.ok ? 'success' : 'error', `Status ${loginRes.status}: ${loginText}`);
    } catch (err) {
      addLog('error', `POST /auth/login failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  if (!expanded) {
    return (
      <View style={styles.toggleContainer}>
        <Button
          title="Network diagnostics"
          variant="ghost"
          size="small"
          onPress={() => {
            setExpanded(true);
            runTests();
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text variant="bodyBold" color={Colors.onSurface}>Diagnostics</Text>
        <TouchableOpacity onPress={() => setExpanded(false)}>
          <Text variant="bodyBase" color={Colors.primary}>Hide</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.logs} nestedScrollEnabled
      >
        {logs.length === 0 && <Text variant="metadata" color={Colors.outline}>Running tests...</Text>}
        {logs.map((log, i) => (
          <Text
            key={i}
            variant="metadata"
            color={
              log.type === 'error' ? Colors.error : log.type === 'success' ? Colors.success : Colors.outline
            }
            style={{ marginBottom: 6 }}
          >
            {log.message}
          </Text>
        ))}
      </ScrollView>

      <Button
        title="Rerun diagnostics"
        variant="secondary"
        size="small"
        onPress={runTests}
        style={{ marginTop: 8 }}
      />
    </View>
  );
};

const getStyles = (Colors: ColorPalette) => StyleSheet.create({
  toggleContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  panel: {
    marginTop: 12,
    padding: 12,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    maxHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  logs: {
    maxHeight: 220,
  },
});
