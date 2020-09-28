'use strict'
const Service = require('egg').Service;

class PiwigoService extends Service {
    constructor(ctx) {
        super(ctx);
        this.token = "";
        this.url = "";
        this.cookie = "";
        this.timeout = 120000;
    }

    async getToken() {
        const {ctx, app} = this;

        let piwigoConfig = app.config.piwigo;
        let url = piwigoConfig.url;
        const result = await ctx.curl(url, {
            // 必须指定 method
            method: 'POST',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            // contentType: 'json',
            data: {
                method: 'pwg.session.login',
                username: piwigoConfig.userName,
                password: piwigoConfig.password
            },
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'json',
        });
        let cookie = result.headers['set-cookie'];
        // ctx.logger.info('HomeController.test || cookie = %j', cookie);
        let res = await ctx.curl(url, {
            // 必须指定 method
            method: 'POST',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            // contentType: 'json',
            data: {
                method: 'pwg.session.getStatus'
            },
            headers: {
                'Cookie': cookie.join("")
            },
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'json',
        });
        this.token = res.data.result.pwg_token;
        this.cookie = cookie.join("");
        return this.token;
    }

    async uploadImg(filePath) {
        const {ctx, app} = this;
        let token = await this.getToken();

        let piwigoConfig = app.config.piwigo;
        let category = piwigoConfig.categorieId;
        // let fileRes = await app.curl("https://hashnews.k1ic.com/ipfs/QmZkGfrbgguZ2vsBNgKEP3ctoz5iKxUDETL24RDBivEgKC/o4wz6hm1dqzkfl3ogus.jpg");
        // let fileData = fileRes.data;
        // let filePath = "/tmp/o4wz6hm1dqzkfl3nr09_1/o4wz6hm1dqzkfl3nr09.JPG";

        let getListRes = await ctx.curl(url, {
            // 必须指定 method
            method: 'POST',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            // contentType: 'json',
            data: {
                method: 'pwg.images.upload',
                category: category,
                pwg_token: token,
                name: "o4wz6hm1dqzkfl3nr09.jpg",
                // file: fs.createReadStream(filePath)
            },
            files: filePath,
            headers: {
                'Cookie': cookie.join("")
            },
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'json',
            timeout: this.timeout,
        });
        // res = await ctx.curl(url, {
        //     // 必须指定 method
        //     method: 'POST',
        //     data: {
        //         method: 'pwg.images.upload',
        //
        //     },
        // }
        ctx.logger.info('PiwigoService.uploadImg || getListRes.data = %j', getListRes.data);
        return true;
    }

    async uploadImgFromUrl(uri) {
        const {ctx, app} = this;
        let cheveretoConfig = app.config.chevereto;
        let ownHost = cheveretoConfig.ownHost;
        let picUrl = `${ownHost}${uri}`;
        ctx.logger.info('PiwigoService.uploadImgFromUrl || url = %j', picUrl);

        //
        let piwigoConfig = app.config.piwigo;
        let url = piwigoConfig.url;
        const result = await ctx.curl(url, {
            // 必须指定 method
            method: 'POST',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            // contentType: 'json',
            data: {
                method: 'pwg.session.login',
                username: piwigoConfig.userName,
                password: piwigoConfig.password
            },
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'json',
        });
        let cookie = result.headers['set-cookie'];
        ctx.logger.info('PiwigoService.uploadImgFromUrl  || cookie = %j', cookie);
        let res = await ctx.curl(url, {
            // 必须指定 method
            method: 'POST',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            // contentType: 'json',
            data: {
                method: 'pwg.session.getStatus'
            },
            headers: {
                'Cookie': cookie.join("")
            },
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'json',
        });
        let token = res.data.result.pwg_token;
        ctx.logger.info('PiwigoService.uploadImgFromUrl  || token = %j', token);
        let category = piwigoConfig.categorieId;
        // let fileRes = await app.curl("https://hashnews.k1ic.com/ipfs/QmZkGfrbgguZ2vsBNgKEP3ctoz5iKxUDETL24RDBivEgKC/o4wz6hm1dqzkfl3ogus.jpg");
        // let fileData = fileRes.data;
        // let filePath = "/tmp/o4wz6hm1dqzkfl3nr09_1/o4wz6hm1dqzkfl3nr09.JPG";

        let getListRes = await ctx.curl(url, {
            // 必须指定 method
            method: 'POST',
            // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
            // contentType: 'json',
            data: {
                method: 'pwg.images.upload',
                category: category,
                pwg_token: token,
                name: "o4wz6hm1dqzkfl3nr09.jpg",
                source: picUrl
                // file: fs.createReadStream(filePath)
            },
            // files: filePath,
            headers: {
                'Cookie': cookie.join("")
            },
            // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
            dataType: 'text',
            timeout: 120000,
        });
        // res = await ctx.curl(url, {
        //     // 必须指定 method
        //     method: 'POST',
        //     data: {
        //         method: 'pwg.images.upload',
        //
        //     },
        // }
        ctx.logger.info('PiwigoService.uploadImgFromUrl  || getListRes.data = %j', getListRes.data);
    }
}

module.exports = PiwigoService;
