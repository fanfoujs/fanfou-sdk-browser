# fanfou-sdk-browser

[![](https://github.com/fanfoujs/fanfou-sdk-browser/workflows/Node/badge.svg)](https://github.com/fanfoujs/fanfou-sdk-browser/actions)
[![](https://img.shields.io/npm/v/fanfou-sdk-browser.svg)](https://www.npmjs.com/package/fanfou-sdk-browser)
[![](https://img.shields.io/npm/l/fanfou-sdk-browser.svg)](https://github.com/fanfoujs/fanfou-sdk-browser/blob/master/LICENSE)
[![](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

Fanfou SDK for browser

## Install

```bash
$ npm i fanfou-sdk-browser
```

---

<a href="https://www.patreon.com/LitoMore">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## Usage

```javascript
import Fanfou from 'fanfou-sdk-browser'
```

**OAuth**

```javascript
(async () => {
  const ff = new Fanfou({
    consumerKey: '',
    consumerSecret: '',
    oauthToken: '',
    oauthTokenSecret: ''
  })

  const timeline = await ff.get('/statuses/home_timeline', {format: 'html'})
})();
```

**XAuth**

```javascript
(async () => {
  const ff = new Fanfou({
    consumerKey: '',
    consumerSecret: '',
    username: '',
    password: ''
  });

  await ff.xauth();

  const publimeTimeline = await ff.get('/statuses/public_timeline', {count: 10})
  const status = await ff.post('/statuses/update', {status: 'Hi Fanfou'})
})();
```

**Options**

- `consumerKey`: The consumer key
- `consumerSecret`: The consumer secret
- `oauthToken`: The OAuth token
- `oauthTokenSecret`: The OAuth token secret
- `username`: The Fanfou username
- `password`: The Fanfou password
- `protocol`: Set the protocol, default is `''`
- `apiDomain`: Set the API domain, default is `api.fanfou.com`
- `oauthDomain`: Set the OAuth domain, default is `fanfou.com`
- `hooks`: Hooks allow modifications with OAuth

> For more Fanfou API docs, see the [Fanfou API doc](https://github.com/FanfouAPI/FanFouAPIDoc/wiki).

## API

```javascript
ff.getRequestToken()
ff.getAccessToken(token)
ff.xauth()
ff.get(uri, params)
ff.post(uri, params)
ff.upload(uri, params)
```

**Examples**

```javascript
(async () => {
  // Get request token
  const token = await ff.getRequestToken();

  // Get access token
  const token = await ff.getAccessToken({oauthToken: '', oauthTokenSecret: ''});

  // Get timeline
  const timeline = await ff.get('/statuses/home_timeline', {});

  // Post status
  const status = await ff.post('/statuses/update', {status: 'post test'});

  // Upload photo
  const result = await ff.upload('/photos/upload', {photo: uploadFile, status: 'unicorn'});
})();
```

**Tips**

Use `hooks` for your reverse-proxy server

```javascript
const ff = new Fanfou({
  consumerKey: '',
  consumerSecret: '',
  oauthToken: '',
  oauthTokenSecret: '',
  apiDomain: 'api.example.com',
  oauthDomain: 'example.com',
  hooks: {
    baseString: str => {
      return str.replace('example.com', 'fanfou.com')
    }
  }
})
```

## Related

- [fanfou-pro](https://github.com/LitoMore/fanfou-pro) - A Web App Fanfou client
- [x-fan](https://github.com/LitoMore/x-fan) - A Fanfou client with Framework7
- [fanfou-sdk-node](https://github.com/fanfoujs/fanfou-sdk-node) - Fanfou SDK for Node.js
- [fanfou-sdk-deno](https://github.com/LitoMore/fanfou-sdk-deno) - Fanfou SDK for Deno
- [fanfou-sdk-weapp](https://github.com/fanfoujs/fanfou-sdk-weapp) - Fanfou SDK for WeApp
- [fanfou-sdk-python](https://github.com/LitoMore/fanfou-sdk-python) - Fanfou SDK for Python
- [ky](https://github.com/sindresorhus/ky) - Tiny and elegant HTTP client based on the browser Fetch API

## License

MIT
