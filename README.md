# fanfou-sdk-browser

[![](https://badges.greenkeeper.io/LitoMore/fanfou-sdk-browser.svg)](https://greenkeeper.io/)
[![](https://img.shields.io/travis/LitoMore/fanfou-sdk-browser/master.svg)](https://travis-ci.org/LitoMore/fanfou-sdk-browser)
[![](https://img.shields.io/npm/v/fanfou-sdk-browser.svg)](https://www.npmjs.com/package/fanfou-sdk-browser)
[![](https://img.shields.io/npm/l/fanfou-sdk-browser.svg)](https://github.com/LitoMore/fanfou-sdk-browser/blob/master/LICENSE)
[![](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/xojs/xo)

Fanfou SDK for browser

## Install

```bash
$ npm i fanfou-sdk-browser
```

## Usage

```javascript
import Fanfou from 'fanfou-sdk-browser'
```

**OAuth**

```javascript
const ff = new Fanfou({
  consumerKey: '',
  consumerSecret: '',
  oauthToken: '',
  oauthTokenSecret: ''
})

ff.get('/statuses/home_timeline', {format: 'html'})
  .then(res => console.log(res))
  .catch(res => console.log(err))
```

**XAuth**

```javascript
const ff = new Fanfou({
  consumerKey: '',
  consumerSecret: '',
  username: '',
  password: ''
})

ff.xauth()
  .then(res => {
    console.log(res)
    ff.get('/statuses/public_timeline', {count: 10})
      .then(res => console.log(res))
      .catch(err => console.log(err))

    ff.get('/statuses/update', {status: 'Hi Fanfou'})
      .then(res => console.log(res))
      .catch(err => console.log(err))
  })
  .catch(err => console.log(err))
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
ff.xauth()
ff.get(uri, params)
ff.post(uri, params)
ff.upload(uri, params)
```

**Examples**

```javascript
ff.get('/statuses/home_timeline', {})
  .then(res => console.log(res))
  .catch(err => console.log(err))

ff.post('/statuses/update', {status: 'post test'})
  .then(res => console.log(res))
  .catch(err => console.log(err))

ff.upload('/photos/upload', {photo: uploadFile, status: 'unicorn'})
  .then(res => console.log(res))
  .catch(err => console.log(err))
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

- [fanfou-sdk-node](https://github.com/LitoMore/fanfou-sdk-node) - Fanfou SDK for Node.js
- [fanfou-sdk-weapp](https://github.com/LitoMore/fanfou-sdk-weapp) - Fanfou SDK for WeApp
- [ky](https://github.com/sindresorhus/ky) - Tiny and elegant HTTP client based on the browser Fetch API

## License

MIT © [LitoMore](https://github.com/LitoMore)
