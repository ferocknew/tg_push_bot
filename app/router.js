module.exports = app => {
    const {router, controller} = app;
    router.get('/', controller.home.index);
    router.get('/inlineQuery', controller.home.inlineQuery);
    router.get('/sendMessage/:token', controller.home.sendMessage);

    router.post('/sendMessage/:token', controller.home.sendMessage);
};
