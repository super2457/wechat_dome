import express from 'express';
import httpProxy from 'http-proxy';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import favicon from 'express-favicon';
import multer from 'multer';
import WX_Db from './mixin/db';
import WX from './mixin/wx';
import routerCore from './routes/router-core';
import browser from './mixin/browser';
import credentials from './mixin/credentials';
import routerAssist from './routes/router-assist';
import WechatAPI from 'wechat-api'


let proxy = httpProxy.createProxyServer({target:'http://localhost:3000'}).listen(80);
//let proxy = httpProxy.createProxyServer({target:'http://localhost:3000'}).listen(80);

proxy.on('error', function (error, req, res) {
    var json;
    console.log('proxy error', error);
    if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json' });
    }

    json = { error: 'proxy_error', reason: error.message };
    res.end(JSON.stringify(json));
});

let db = new WX_Db(),
    wx = new WX(),
    app = express(),
    {username, password} = credentials.DbConfig;

app.use(favicon(__dirname + '/public/favicon.ico'));

async function serverInit(){
    await db.init(username,password);
    console.log(db.wxConfig);
    await wx.init(db);
    return true;
}

serverInit().then(ret => {

    app.set('views', './views');
    app.engine('.html', require('ejs').__express);
    app.set('view engine', 'html');
    app.use(express.static('public'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser(credentials.cookie));
    app.use(session({
        secret: `${credentials.session}`,
        cookie: {
            maxAge: 7200000,
            httpOnly: false
        }
    }));
    //app.use(multer());  //上传图片
    app.use(browser());
    app.use((req,res,next) => {
        if(!req.session.username){
            req.session.username = 'admin';
        }
        next();
    });


    routerCore(app, routerAssist(db, wx));

    let server = app.listen(3000,(err) => {
        if(err) console.log(err);
        if(!err){
            let {host, port} = server.address();
            console.log('server listen at http://%s:%s', host, port)
        }
    });

});





