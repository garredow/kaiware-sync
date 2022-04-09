import { API } from './API';
import { ApiResponse, Options } from './models';
import { Tokens } from './Tokens';

export class KaiwareSync {
  options: Options;
  tokens: Tokens;

  constructor(options: Partial<Options> & Pick<Options, 'appId'>) {
    this.options = {
      baseUrl: 'https://sync.kaiware.io/api',
      authClientId: 'pEpQbBNAnl5RDBXiGS7BXW3UZrVNJMsL',
      authDomain: 'https://kaiware-sync-dev.us.auth0.com',
      authAudience: 'https://sync.kaiware.io/api',
      authRedirectUri: `https://${options.appId.replace(/[^\w-]/gm, '_')}.app.kaiware.io/oauth`,
      ...options,
    };

    this.tokens = new Tokens(this.options);
  }

  async get<T>(): Promise<ApiResponse<T>> {
    return new API(this.options).get(`/data/${this.options.appId}`);
  }

  async set<T>(data: T): Promise<ApiResponse<T>> {
    return new API(this.options).put(`/data/${this.options.appId}`, data);
  }

  async delete(): Promise<void> {
    return new API(this.options).delete(`/data/${this.options.appId}`);
  }

  async signin(): Promise<void> {
    const url = new URL(`${this.options.authDomain}/authorize`);
    url.searchParams.append('response_type', 'code');
    url.searchParams.append('client_id', this.options.authClientId);
    url.searchParams.append('audience', this.options.authAudience);
    url.searchParams.append('redirect_uri', this.options.authRedirectUri);
    url.searchParams.append('scope', 'offline_access openid profile email');

    return new Promise((resolve, reject) => {
      const windowRef = window.open(url.toString());
      windowRef?.addEventListener('kaios-sync-tokens-success', (ev: any) => {
        this.tokens.set({
          accessToken: ev.detail.access_token,
          refreshToken: ev.detail.refresh_token,
          expiresAt: Date.now() + ev.detail.expires_in * 1000,
        });
        resolve();
      });
      windowRef?.addEventListener('kaios-sync-tokens-error', (ev: any) => {
        reject();
      });
    });
  }

  handleAuthCallback(): Promise<void> {
    return this.fetchTokensUsingCode()
      .then((result) => {
        window.dispatchEvent(
          new CustomEvent('kaios-sync-tokens-success', {
            detail: result,
          })
        );
        window.close();
      })
      .catch((err) => {
        window.dispatchEvent(new CustomEvent('kaios-sync-tokens-error'));
        window.close();
      });
  }

  private fetchTokensUsingCode() {
    const code = location.search.split('?code=')[1];

    var body = new URLSearchParams();
    body.append('code', code);
    body.append('grant_type', 'authorization_code');
    body.append('redirect_uri', this.options.authRedirectUri);
    body.append('client_id', this.options.authClientId);

    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
      xhr.addEventListener('error', () => reject(new Error('Failed to get tokens')));
      xhr.open('POST', `${this.options.authDomain}/oauth/token`);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(body);
    });
  }
}
