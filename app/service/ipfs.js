'use strict'
const Service = require('egg').Service;

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
const request = require('request');
const {globSource} = ipfsClient;

class IpfsService extends Service {
    constructor(ctx) {
        super(ctx);
    }

    async saveUrl(url) {
        const {ctx, app} = this;
        let returnUrl = "";

        const result = await app.curl(url);
        ctx.logger.info('IpfsService.saveUrl || result = %j', result);
        return returnUrl;
    }
}

module.exports = IpfsService;
