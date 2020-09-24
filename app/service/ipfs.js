'use strict'
const Service = require('egg').Service;

const path = require('path');
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
        let returnUrl = "ok";

        let extname = path.extname(url);
        const result = await app.curl(url);
        let fileData = result.data.data;
        ctx.logger.info('IpfsService.saveUrl || extname = %j', extname);
        return returnUrl;
    }
}

module.exports = IpfsService;
