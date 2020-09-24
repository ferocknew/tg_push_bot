'use strict'
const Service = require('egg').Service;

const fs = require('fs');
const path = require('path');
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
const request = require('request');
const uniqid = require('uniqid');
const {globSource} = ipfsClient;

class IpfsService extends Service {
    constructor(ctx) {
        super(ctx);
    }

    async saveUrl(url) {
        const {ctx, app} = this;
        let returnUrl = "ok";

        let extname = path.extname(url);
        let fileName = uniqid();
        let saveDirPath = `/tmp/${fileName}_1`;
        let saveFilePath = `${saveDirPath}/${fileName}${extname}`;

        const result = await app.curl(url);
        let fileData = result.data.data;

        fs.writeFileSync(saveFilePath, fileData);
        ctx.logger.info('IpfsService.saveUrl || 文件写入成功 saveFilePath = %j', saveFilePath);
        return returnUrl;
    }
}

module.exports = IpfsService;
