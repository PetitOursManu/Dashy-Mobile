import { useEffect, useState } from 'react';
import { ImageSource } from 'expo-image';
import { getServerUrl, getToken } from '../utils/storage';
import { buildAbsoluteUrl } from '../api/client';

export function useImageAuth(relativePath?: string | null): ImageSource | null {
  const [source, setSource] = useState<ImageSource | null>(null);

  useEffect(() => {
    let mounted = true;
    const build = async () => {
      if (!relativePath) {
        setSource(null);
        return;
      }
      const [serverUrl, token] = await Promise.all([getServerUrl(), getToken()]);
      if (!serverUrl || !token || !mounted) return;
      const uri = buildAbsoluteUrl(serverUrl, relativePath);
      setSource({
        uri,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };
    build();
    return () => {
      mounted = false;
    };
  }, [relativePath]);

  return source;
}
