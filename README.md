# Kaiware Sync

[![CircleCI](https://circleci.com/gh/garredow/kaiware-sync/tree/main.svg?style=svg)](https://circleci.com/gh/garredow/kaiware-sync/tree/main)
[![npm](https://img.shields.io/npm/v/kaiware-sync.svg)](https://www.npmjs.com/package/kaiware-sync)

Kaiware Sync is a web service to sync app settings across devices.

## Examples

```ts
// Initialize
const sync = new KaiwareSync({
  appId: 'com.garredow.kaiware-sync-demo',
});

// Opens a new window to the login screen
await sync.signin();

// Store app data in the cloud
await sync.set({ theme: 'dark', accentColor: 'red' });

// Fetch app data
const data = await sync.get();

// Delete app data
await sync.delete();
```

To see an example of an app using Kaiware Sync, including logging in, check out [kaiware-sync-demo](https://github.com/garredow/kaiware-sync-demo).
