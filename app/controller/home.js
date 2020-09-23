const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const {ctx, app} = this;
        // let userId = 11;
        // const userInfo = await ctx.service.user.find(userId);
        // ctx.logger.info('some request data: %j', userInfo);
        ctx.body = '';
    }

    async inlineQuery() {
        const {ctx, app} = this;
        ctx.body = '';
        return;
    }

    async sendMessage() {
        const {ctx, app} = this;
        let p = ctx.params;
        let q = ctx.query;
        ctx.logger.info('HomeController.sendMessage || p = %j', p);
        ctx.logger.info('HomeController.sendMessage || q = %j', q);
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
