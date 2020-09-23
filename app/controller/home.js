const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const ctx = this.ctx;
        let userId = 11;
        // const user = await ctx.service.user.find(userId);
        this.ctx.body = 'Hello world';
    }
}

module.exports = HomeController;
