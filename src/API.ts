import { Options } from './models';
import { Tokens } from './Tokens';

export class API {
  options: Options;
  tokens: Tokens;

  constructor(options: Options) {
    this.options = options;
    this.tokens = new Tokens(options);
  }

  async get<T>(path: string): Promise<T> {
    const tokens = await this.tokens.get();
    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject(new Error(`API call failed: ${xhr.statusText}`));
        }
        resolve(JSON.parse(xhr.responseText));
      });
      xhr.addEventListener('error', () => {
        reject(new Error(`API call failed: ${xhr.statusText}`));
      });
      xhr.open('GET', `${this.options.baseUrl}${path}`);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.accessToken}`);
      xhr.send();
    });
  }

  async put<T>(path: string, body: unknown): Promise<T> {
    const tokens = await this.tokens.get();
    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject(new Error(`API call failed: ${xhr.statusText}`));
        }
        resolve(JSON.parse(xhr.responseText));
      });
      xhr.addEventListener('error', () => {
        reject(new Error(`API call failed: ${xhr.statusText}`));
      });
      xhr.open('PUT', `${this.options.baseUrl}${path}`);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.accessToken}`);
      xhr.send(JSON.stringify(body));
    });
  }

  async delete<T>(path: string): Promise<T> {
    const tokens = await this.tokens.get();
    return new Promise((resolve, reject) => {
      const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
      xhr.addEventListener('load', () => {
        if (xhr.status >= 400) {
          return reject(new Error(`API call failed: ${xhr.statusText}`));
        }
        resolve(JSON.parse(xhr.responseText));
      });
      xhr.addEventListener('error', () => {
        reject(new Error(`API call failed: ${xhr.statusText}`));
      });
      xhr.open('DELETE', `${this.options.baseUrl}${path}`);
      xhr.setRequestHeader('Authorization', `Bearer ${tokens.accessToken}`);
      xhr.send();
    });
  }
}
