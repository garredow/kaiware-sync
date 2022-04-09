import { ApiResponse, Tokens } from './models';

type Options = {
  appId: string;
  baseUrl: string;
  authClientId: string;
  authDomain: string;
  authAudience: string;
  authRedirectUri: string;
};

export class KaiwareSync {
  options: Options;

  constructor(options: Partial<Options> & Pick<Options, 'appId'>) {
    this.options = {
      baseUrl: 'https://sync.kaiware.io/api',
      authClientId: 'pEpQbBNAnl5RDBXiGS7BXW3UZrVNJMsL',
      authDomain: 'https://kaiware-sync-dev.us.auth0.com',
      authAudience: 'https://sync.kaiware.io/api',
      authRedirectUri: `https://${options.appId.replace(/[^\w-]/gm, '_')}.app.kaiware.io/oauth`,
      ...options,
    };
  }

  async get<T>(): Promise<ApiResponse<T>> {
    const token = await this.getTokens();

    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => {
        resolve(JSON.parse(xhr.responseText));
      });
      xhr.addEventListener('error', () => {
        console.log('ERROR', xhr);
        reject();
      });
      xhr.open('GET', `${this.options.baseUrl}/settings/${this.options.appId}`);
      xhr.setRequestHeader('Authorization', token.accessToken);
      xhr.send();
    });
  }

  async set<T>(data: T): Promise<ApiResponse<T>> {
    const token = await this.getTokens();

    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => {
        resolve(JSON.parse(xhr.responseText));
      });
      xhr.addEventListener('error', () => {
        console.log('ERROR', xhr);
        reject();
      });
      xhr.open('PUT', `${this.options.baseUrl}/settings/${this.options.appId}`);
      xhr.setRequestHeader('Authorization', token.accessToken);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data as any);
    });
  }

  async delete(): Promise<void> {
    const token = await this.getTokens();

    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => {
        resolve();
      });
      xhr.addEventListener('error', () => {
        console.log('ERROR', xhr);
        reject();
      });
      xhr.open('DELETE', `${this.options.baseUrl}/settings/${this.options.appId}`);
      xhr.setRequestHeader('Authorization', token.accessToken);
      xhr.send();
    });
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
        window.localStorage.setItem(
          'kaios-sync__tokens',
          JSON.stringify({
            access: ev.detail.access_token,
            refresh: ev.detail.refresh_token,
            expiresAt: Date.now() + ev.detail.expires_in * 1000,
          })
        );
        resolve();
      });
      windowRef?.addEventListener('kaios-sync-tokens-error', (ev: any) => {
        reject();
      });
    });
  }

  async handleAuthCallback(): Promise<void> {
    this.getTokensFromCode()
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

  private async getTokens(): Promise<Tokens> {
    let tokens: Tokens = JSON.parse(window.localStorage.getItem('kaios-sync__tokens') as string);

    if (!tokens) {
      throw new Error('No token found! You must sign in first.');
    }

    if (tokens.expiresAt < Date.now() + 1_800_000) {
      console.log(
        `Token expires soon (${new Date(tokens.expiresAt).toISOString()}), refreshing...`
      );
      tokens = await this.refreshTokens(tokens.accessToken, tokens.refreshToken);
    }

    return tokens;
  }

  private getTokensFromCode() {
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

  private refreshTokens(accessToken: string, refreshToken: string): Promise<Tokens> {
    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
      xhr.addEventListener('error', () => reject(new Error('Failed to refresh tokens')));
      xhr.open('POST', `${this.options.baseUrl}/refresh`);
      xhr.setRequestHeader('Authorization', accessToken);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(
        JSON.stringify({
          refreshToken,
          clientId: this.options.authClientId,
        })
      );
    });
  }
}
