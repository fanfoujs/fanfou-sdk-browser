'use strict';

import ky from 'ky';
import oauth from 'oauth-1.0a';
import hmacsha1 from 'hmacsha1';
import queryString from 'query-string';
import User from './user';
import Status from './status';
import DirectMessage from './direct-message';

export default class Fanfou {
	constructor(opt = {}) {
		const {
			consumerKey = '',
			consumerSecret = '',
			oauthToken = '',
			oauthTokenSecret = '',
			username = '',
			password = '',
			apiDomain = 'api.fanfou.com',
			oauthDomain = 'fanfou.com',
			protocol = '',
			hooks = {}
		} = opt;

		this.consumerKey = consumerKey;
		this.consumerSecret = consumerSecret;
		this.oauthToken = oauthToken;
		this.oauthTokenSecret = oauthTokenSecret;
		this.username = username;
		this.password = password;
		this.apiDomain = apiDomain;
		this.oauthDomain = oauthDomain;
		this.protocol = protocol;
		this.hooks = hooks;

		this.oauthInit();
		this.apiInit();
	}

	oauthInit() {
		this.o = oauth({
			consumer: {key: this.consumerKey, secret: this.consumerSecret},
			signature_method: 'HMAC-SHA1',
			parameter_seperator: ',',
			hash_function: (baseString, key) => {
				const {baseString: baseStringHook} = this.hooks;
				if (baseStringHook) {
					baseString = baseStringHook(baseString);
				}
				return hmacsha1(key, baseString);
			}
		});
	}

	apiInit() {
		this.apiEndPoint = `${this.protocol}//${this.apiDomain}`;
		this.oauthEndPoint = `${this.protocol}//${this.oauthDomain}`;
	}

	async xauth() {
		const url = `${this.oauthEndPoint}/oauth/access_token`;
		const params = {
			x_auth_mode: 'client_auth',
			x_auth_password: this.password,
			x_auth_username: this.username
		};
		const {Authorization} = this.o.toHeader(this.o.authorize({url, method: 'POST'}));
		const response = await ky.post(url, {
			hooks: {
				beforeRequest: [opt => {
					opt.headers.append('Authorization', Authorization);
					opt.headers.append('Content-Type', 'application/x-www-form-urlencoded');
				}]
			},
			body: queryString.stringify(params)
		});
		const body = await response.text();
		const result = queryString.parse(body);
		const {
			oauth_token: oauthToken,
			oauth_token_secret: oauthTokenSecret
		} = result;
		this.oauthToken = oauthToken;
		this.oauthTokenSecret = oauthTokenSecret;
		return {oauthToken, oauthTokenSecret};
	}

	async get(uri, params) {
		const query = queryString.stringify(params);
		const url = `${this.apiEndPoint}${uri}.json${query ? `?${query}` : ''}`;
		const token = {key: this.oauthToken, secret: this.oauthTokenSecret};
		const {Authorization} = this.o.toHeader(this.o.authorize({url, method: 'GET'}, token));
		const response = await ky.get(url, {
			hooks: {
				beforeRequest: [opt => {
					opt.headers.append('Authorization', Authorization);
					opt.headers.append('Content-Type', 'application/x-www-form-urlencoded');
				}]
			}
		});
		const body = await response.json();
		if (body.error) {
			return body;
		}
		const result = Fanfou._parseData(body, Fanfou._uriType(uri));
		return result;
	}

	async post(uri, params) {
		const url = `${this.apiEndPoint}${uri}.json`;
		const token = {key: this.oauthToken, secret: this.oauthTokenSecret};
		const {Authorization} = this.o.toHeader(this.o.authorize({url, method: 'POST', data: params}, token));
		const response = await ky.post(url, {
			hooks: {
				beforeRequest: [opt => {
					opt.headers.append('Authorization', Authorization);
					opt.headers.append('Content-Type', 'application/x-www-form-urlencoded');
				}]
			},
			body: queryString.stringify(params)
		});
		const body = await response.json();
		if (body.error) {
			return body;
		}
		const result = Fanfou._parseData(body, Fanfou._uriType(uri));
		return result;
	}

	async upload(uri, params) {
		const url = `${this.apiEndPoint}${uri}.json`;
		const token = {key: this.oauthToken, secret: this.oauthTokenSecret};
		const {Authorization} = this.o.toHeader(this.o.authorize({url, method: 'POST'}, token));
		const formData = new FormData();
		Object.keys(params).forEach(key => {
			formData.append(key, params[key]);
		});
		const response = await ky.post(url, {
			hooks: {
				beforeRequest: [opt => {
					opt.headers.append('Authorization', Authorization);
				}]
			},
			body: formData
		});
		const body = await response.json();
		if (body.error) {
			return body;
		}
		const result = Fanfou._parseData(body, Fanfou._uriType(uri));
		return result;
	}

	static _uriType(uri) {
		const uriList = {
			// Timeline
			'/search/public_timeline': 'timeline',
			'/search/user_timeline': 'timeline',
			'/photos/user_timeline': 'timeline',
			'/statuses/friends_timeine': 'timeline',
			'/statuses/home_timeline': 'timeline',
			'/statuses/public_timeline': 'timeline',
			'/statuses/replies': 'timeline',
			'/statuses/user_timeline': 'timeline',
			'/statuses/context_timeline': 'timeline',
			'/statuses/mentions': 'timeline',
			'/favorites': 'timeline',

			// Status
			'/statuses/update': 'status',
			'/statuses/show': 'status',
			'/favorites/destroy': 'status',
			'/favorites/create': 'status',
			'/photos/upload': 'status',

			// Users
			'/users/tagged': 'users',
			'/users/followers': 'users',
			'/users/friends': 'users',
			'/friendships/requests': 'users',

			// User
			'/users/show': 'user',
			'/friendships/create': 'user',
			'/friendships/destroy': 'user',
			'/account/verify_credentials': 'user',

			// Conversation
			'/direct_messages/conversation': 'conversation',
			'/direct_messages/inbox': 'conversation',
			'/direct_messages/sent': 'conversation',

			// Conversation List
			'/direct_messages/conversation_list': 'conversation-list',

			// Direct Message
			'/direct_messages/new': 'dm',
			'/direct_messages/destroy': 'dm'

		};
		return uriList[uri] || null;
	}

	static _parseList(data, type) {
		const arr = [];
		for (const i in data) {
			if (data[i]) {
				switch (type) {
					case 'timeline':
						arr.push(new Status(data[i]));
						break;
					case 'users':
						arr.push(new User(data[i]));
						break;
					case 'conversation':
						arr.push(new DirectMessage(data[i]));
						break;
					case 'conversation-list':
						data[i].dm = new DirectMessage(data[i].dm);
						arr.push(data[i]);
						break;
					default:
						break;
				}
			}
		}
		return arr;
	}

	static _parseData(data, type) {
		switch (type) {
			case 'timeline':
			case 'users':
			case 'conversation':
			case 'conversation-list':
				return Fanfou._parseList(data, type);
			case 'status':
				return new Status(data);
			case 'user':
				return new User(data);
			case 'dm':
				return new DirectMessage(data);
			default:
				return data;
		}
	}
}
