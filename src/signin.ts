export function signin(): Promise<void> {
  const url = new URL('https://kass-dev.us.auth0.com/authorize');
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('client_id', 'uFqNEKi4UJSgBtqEOSgchcnwGVb2BFjd');
  url.searchParams.append('audience', 'dev.nothing.kass-api');
  url.searchParams.append('redirect_uri', 'https://com.garredow.kass-demo/oauth');
  url.searchParams.append('scope', 'offline_access');

  return new Promise((resolve, reject) => {
    const windowRef = window.open(url.toString());
    windowRef?.addEventListener('kass-tokens-success', (ev: any) => {
      window.localStorage.setItem(
        'kass__tokens',
        JSON.stringify({
          access: ev.detail.access_token,
          refresh: ev.detail.refresh_token,
          expiresAt: Date.now() + ev.detail.expires_in * 1000,
        })
      );
      resolve();
    });
    windowRef?.addEventListener('kass-tokens-error', (ev: any) => {
      reject();
    });
  });
}
