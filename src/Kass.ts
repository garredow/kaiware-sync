import { ApiResponse, Token } from './models';

type Options = {
  appId: string;
  baseUrl: string;
};
export default class Kass {
  options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  get<T>(): Promise<ApiResponse<T>> {
    const token = this.getToken();

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
      xhr.setRequestHeader('Authorization', token.access);
      xhr.send();
    });
  }

  set<T>(data: T): Promise<ApiResponse<T>> {
    const token = this.getToken();

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
      xhr.setRequestHeader('Authorization', token.access);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(data as any);
    });
  }

  delete(): Promise<void> {
    const token = this.getToken();

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
      xhr.setRequestHeader('Authorization', token.access);
      xhr.send();
    });
  }

  private getToken(): Token {
    const token = JSON.parse(window.localStorage.getItem('kass__tokens') as string);

    if (!token) {
      throw new Error('No token found! You must sign in first.');
    }

    return token;
  }
}
