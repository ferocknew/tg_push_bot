const Controller = require('egg').Controller;
const fs = require('fs');

class HomeController extends Controller {
    async index() {
        const {ctx, app} = this;
        // let userId = 11;
        // const userInfo = await ctx.service.user.find(userId);
        // ctx.logger.info('some request data: %j', userInfo);
        // ctx.body = '';
        let htmlData = {};
        htmlData['title'] = "demo";
        htmlData['list'] = await ctx.renderView('nexmoe/list.html', {});
        ctx.body = await ctx.renderView('nexmoe/layout.html', htmlData);
        return;
    }

    async inlineQuery() {
        const {ctx, app} = this;
        let p = ctx.params;
        let q = ctx.query;
        let b = ctx.request.body;
        let messageObj = b.message || null;
        ctx.logger.info('HomeController.inlineQuery || b = %j', b);
        let entities = messageObj.entities || null;
        let photoObj = messageObj.photo || null;

        // 处理bot 命令
        if (!Object.is(entities, null)) {
            let entitiesType = entities[0]['type'];
            switch (entitiesType) {
                case "bot_command":
                    await ctx.service.tgbot.command(messageObj.text.substr(1), messageObj);
                    break;
                case "url":
                    await ctx.service.url.main(messageObj.text, messageObj);
                    break;
            }

            ctx.body = '';
            return;
        }

        // 处理发送图片
        if (!Object.is(photoObj, null)) {
            let res = await ctx.service.tgbot.ipfsSave(messageObj);
            ctx.body = '';
            return;
        }
        ctx.body = '';
        return;
    }

    async sendMessage() {
        const {ctx, app} = this;
        let p = ctx.params;
        let q = ctx.query;
        let b = ctx.request.body;

        ctx.logger.info('HomeController.sendMessage || p = %j', p);
        ctx.logger.info('HomeController.sendMessage || q = %j', q);

        let token = p['token'] || null;
        let text = q['text'] || b['text'] || null;
        let parseMode = q['parse_mode'] || b['parse_mode'] || 'Markdown';

        let photo = q['photo'] || b['photo'] || null;
        if (!token || !text) {
            ctx.body = '';
            return;
        }

        let chatId = await ctx.service.tgbot.getChatId(token);
        if (!chatId) {
            ctx.body = '';
            return;
        }

        let res = await ctx.service.tgbot.sendMessage(chatId, text, parseMode);
        ctx.body = res;
        return;
    }

    async sendPhoto() {
        const {ctx, app} = this;
        let p = ctx.params;
        let q = ctx.query;
        let b = ctx.request.body;

        let token = p['token'] || null;
        let photo = q['photo'] || b['photo'] || null;

        if (!token || !photo) {
            ctx.body = '';
            return;
        }


        let chatId = await ctx.service.tgbot.getChatId(token);
        if (!chatId) {
            ctx.body = '';
            return;
        }

        let res = await ctx.service.tgbot.sendPhoto(chatId, photo);
        ctx.body = res;
        return;

    }

    async test() {
        const {ctx, app} = this;
        // let q = ctx.query;
        //
        // let piwigoConfig = app.config.piwigo;
        // let url = piwigoConfig.url;
        // const result = await ctx.curl(url, {
        //     // 必须指定 method
        //     method: 'POST',
        //     // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
        //     // contentType: 'json',
        //     data: {
        //         method: 'pwg.session.login',
        //         username: piwigoConfig.userName,
        //         password: piwigoConfig.password
        //     },
        //     // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        //     dataType: 'json',
        // });
        // let cookie = result.headers['set-cookie'];
        // ctx.logger.info('HomeController.test || cookie = %j', cookie);
        // let res = await ctx.curl(url, {
        //     // 必须指定 method
        //     method: 'POST',
        //     // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
        //     // contentType: 'json',
        //     data: {
        //         method: 'pwg.session.getStatus'
        //     },
        //     headers: {
        //         'Cookie': cookie.join("")
        //     },
        //     // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        //     dataType: 'json',
        // });
        // let token = res.data.result.pwg_token;
        // ctx.logger.info('HomeController.test || token = %j', token);
        // let category = piwigoConfig.categorieId;
        // // let fileRes = await app.curl("https://hashnews.k1ic.com/ipfs/QmZkGfrbgguZ2vsBNgKEP3ctoz5iKxUDETL24RDBivEgKC/o4wz6hm1dqzkfl3ogus.jpg");
        // // let fileData = fileRes.data;
        // let filePath = "/tmp/o4wz6hm1dqzkfl3nr09_1/o4wz6hm1dqzkfl3nr09.JPG";
        //
        // let getListRes = await ctx.curl(url, {
        //     // 必须指定 method
        //     method: 'POST',
        //     // 通过 contentType 告诉 HttpClient 以 JSON 格式发送
        //     // contentType: 'json',
        //     data: {
        //         method: 'pwg.images.upload',
        //         category: category,
        //         pwg_token: token,
        //         name: "o4wz6hm1dqzkfl3nr09.jpg",
        //         source:piwigoConfig.testUrl
        //         // file: fs.createReadStream(filePath)
        //     },
        //     // files: filePath,
        //     headers: {
        //         'Cookie': cookie.join("")
        //     },
        //     // 明确告诉 HttpClient 以 JSON 格式处理返回的响应 body
        //     dataType: 'text',
        //     timeout: 120000,
        // });
        // // res = await ctx.curl(url, {
        // //     // 必须指定 method
        // //     method: 'POST',
        // //     data: {
        // //         method: 'pwg.images.upload',
        // //
        // //     },
        // // }
        // ctx.body = getListRes.data;
        ctx.body = '';
        return;
    }

    // mysql的crud
    async sql() {
        const {ctx, app} = this;
        // ctx.body = await this.service.user.getUserList();

        // 第一种根据id查询数据
        // ctx.body = await app.mysql.get('user', { id: 1 });

        // 第二种查询全部数据
        // ctx.body = await app.mysql.select('user');
        // ctx.body = await app.mysql.select('user', {}); // 或者这种都可以

        // 第三种查询条件


        // 新增用户


        // 修改用户 id为4的用户 硬编码演示


        // 修改用户 执行sql的方式来修改 第一个参数是sql，第二个参数是sql中的参数
        // ctx.body = await app.mysql.query('update user set username=? , password=? where id=?', [ 'admin_super', '111111', 1 ]);

        // 删除用户
        // ctx.body = await app.mysql.delete('user', { id: 4 });

        // 查询语言，通过sql
        // ctx.body = await app.mysql.query('select * from user where id=?', [ 1 ]);

        // 事务
        const conn = await app.mysql.beginTransaction();
        try {
            await conn.insert('user', {username: 'test2', password: '666666'}); // 增加数据操作
            await conn.update('user', {id: 1, username: 'admin'}); // 修改数据操作
            await conn.commit();
            ctx.body = '事务成功';
        } catch (err) {
            // rollback call won't throw err
            await conn.rollback();
            ctx.body = '事务失败！';
            throw err;
        }
    }
}

module.exports = HomeController;
