'use strict'
const Service = require('egg').Service;

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const ipfsClient = require('ipfs-http-client');
const ipfs = ipfsClient('/ip4/127.0.0.1/tcp/5001');
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

        if (!fs.existsSync(saveDirPath)) fs.mkdirSync(saveDirPath);

        const result = await app.curl(url);
        let fileData = result.data;
        try {
            fs.writeFileSync(saveFilePath, fileData);
            ctx.logger.info('IpfsService.saveUrl || 文件写入成功 saveFilePath = %j', saveFilePath);
            const file = await ipfs.add(globSource(saveDirPath, {recursive: true}));
            let hash = file.cid.toString();
            let ipfsUrl = app.config.ipfsUrl;

            let urlObj = ipfsUrl[_.random(0, ipfsUrl.length - 1)];
            ctx.logger.info('IpfsService.saveUrl || urlObj = %j', urlObj);

        } catch (e) {
            ctx.logger.warn('IpfsService.saveUrl || e = %j', e);
        }
        return returnUrl;
    }
}

module.exports = IpfsService;
