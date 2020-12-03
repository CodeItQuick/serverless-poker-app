module.exports = (api) => {
	api.cache.forever();
	return {
		presets: [ '@babel/preset-env' ],
		plugins: [ '@babel/plugin-proposal-class-properties', '@babel/plugin-proposal-object-rest-spread' ],
		ignore: [/node_modules/]
	};
};
