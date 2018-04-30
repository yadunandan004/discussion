'use strict';

if(process.env.NODE_ENV === 'production'){
	//process.eenv.REDIS_URL :: consists of host,password and port in the same url we need to parse it
	let redisURI = require('url').parse(process.env.REDIS_URL);
	let redisPassword = redisURI.auth.split(':')[1];
	module.exports={
		host: process.env.host || "",
		dbURI: process.env.dbURI,
		sessionSecret:"chapinH1121",
		redis:{
			host:redisURI.hostname,
			port:redisURI.port,
			password:redisPassword
		},
		twitter:{
			bearer_token:process.env.bearer_token
		}
	}	
}else{
	module.exports = require('./development.json');
}