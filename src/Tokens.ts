import { Options, TokenData } from './models';

export class Tokens {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  set(data: TokenData): void {
    window.localStorage.setItem('kaios-sync__tokens', JSON.stringify(data));
  }

  async get(): Promise<TokenData> {
    let tokens: TokenData = JSON.parse(window.localStorage.getItem('kaios-sync__tokens') as string);

    if (!tokens) {
      throw new Error('No token found! You must sign in first.');
    }

    if (tokens.expiresAt < Date.now() + 1_800_000) {
      console.log(
        `Token expires soon (${new Date(tokens.expiresAt).toISOString()}), refreshing...`
      );
      tokens = await this.refresh(tokens.accessToken, tokens.refreshToken);
      this.set(tokens);
    }

    return tokens;
  }

  private refresh(accessToken: string, refreshToken: string): Promise<TokenData> {
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
