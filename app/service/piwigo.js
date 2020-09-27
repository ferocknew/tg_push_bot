'use strict'
const Service = require('egg').Service;

class PiwigoService extends Service {
    constructor(ctx) {
        super(ctx);
        this.token = "";
        this.url = "";
        this.timeout = 120000;
    }

    async uploadImg(filePath) {
        const {ctx, app} = this;
        ctx.logger.info('PiwigoService.uploadImg || filePath = %j', filePath);

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
        let token = res.data.result.pwg_token;
        // ctx.logger.info('HomeController.test || token = %j', token);
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
}

module.exports = PiwigoService;
