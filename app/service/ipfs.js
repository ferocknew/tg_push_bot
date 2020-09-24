'use strict'
const Service = require('egg').Service;

const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
const {globSource} = ipfsClient;

class IpfsService extends Service {
    constructor(ctx) {
        super(ctx);
    }

    async saveUrl(url) {
        const {ctx, app} = this;
        let returnUrl = "";
        ctx.logger.info('IpfsService.saveUrl || url = %j', url);

        return returnUrl;
    }
}

module.exports = IpfsService;
