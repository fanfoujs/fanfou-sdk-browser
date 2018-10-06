'use strict';

const path = require('path');

module.exports = {
	mode: 'production',
	entry: path.join(__dirname, 'src/fanfou.js'),
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'fanfou.min.js',
		library: 'Fanfou',
		libraryExport: 'default'
	},
	performance: {
		hints: false
	}
};
