export function handleCallback() {
  getToken()
    .then((result) => {
      window.dispatchEvent(
        new CustomEvent('kass-tokens-success', {
          detail: result,
        })
      );
      window.close();
    })
    .catch((err) => {
      window.dispatchEvent(new CustomEvent('kass-tokens-error'));
      window.close();
    });
}

function getToken() {
  const code = location.search.split('?code=')[1];

  var body = new URLSearchParams();
  body.append('code', code);
  body.append('grant_type', 'authorization_code');
  body.append('redirect_uri', 'https://com.garredow.kass-demo/oauth');
  body.append('client_id', 'uFqNEKi4UJSgBtqEOSgchcnwGVb2BFjd');

  return new Promise((resolve, reject) => {
    const xhr = new (XMLHttpRequest as any)({ mozSystem: true });
    xhr.addEventListener('load', () => resolve(JSON.parse(xhr.responseText)));
    xhr.addEventListener('error', () => reject(new Error('Failed to get tokens')));
    xhr.open('POST', 'https://kass-dev.us.auth0.com/oauth/token');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(body);
  });
}
