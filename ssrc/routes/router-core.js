import xmlparser from 'express-xml-bodyparser';

export default function (app, ra) {

    /**
     *  ra is routerAssist
     */

    app.get('/',ra.getHome);

    app.get('/login',ra.getLogin);

    app.get('/logout',ra.getLogout);

    app.get('/wxServerAuth',ra.getWxServerAuth);

    app.get('/weChat',ra.getWeChatAuthorize, ra.getWeChatRender);

    app.get('/weChat/*',(req, res) => {
        res.send(req.params);
    });

    app.post('/wxServerAuth',xmlparser({trim:false,explicitArray:false}),ra.postWxServerAuth);

    app.post('/login', ra.postLogin);

    app.post('*',ra.postInterception);

    app.post('/WebConfig',ra.postWebConfig);

    app.post('/WxConfig',ra.postWxConfig);

    app.post('/CustomMenu',ra.postCustomMenu);

    app.get('*', ra.authorize,ra.adminRouterPointer,ra.getAdminRouterRender);
};