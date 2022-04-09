# Kaiware Settings Sync

[![CircleCI](https://circleci.com/gh/garredow/kass-lib/tree/main.svg?style=svg)](https://circleci.com/gh/garredow/kass-lib/tree/main)
[![npm](https://img.shields.io/npm/v/kass-lib.svg)](https://www.npmjs.com/package/kass-lib)

Kaiware Settings Sync, or Kass for short, is a web service to sync app settings across devices.

## Examples

```ts
// Initialize Kass
const kass = new Kass({
  appId: 'com.garredow.kass-demo',
  baseUrl: 'https://kass.kaiware.io',
});

// Store app settings in the cloud
await kass.set({ theme: 'dark', accentColor: 'red' });

// Fetch app settings
const settings = await kass.get();

// Delete app settings
await kass.delete();
```

To see an example of an app using Kass, including logging in, check out [kass-demo](https://github.com/garredow/kass-demo).
