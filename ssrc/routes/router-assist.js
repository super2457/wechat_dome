import React, {createFactory} from 'react';
import {renderToString} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import IndexPage from '../serverComponent/indexPage';
import Admin from '../serverComponent/adminRouters';
import routerPointer from './router-pointer';
import Err from '../mixin/error';

const err = new Err();

const tool = {
    handleWxConfig(json) {

        return {
            appID : json.appID,
            appsecret : json.appsecret,
            token : json.token,
            noncestr : json.noncestr
        }
    }
};

export default function (db, wx) {
    return {
        authorize(req,res,next){
            if(req.session.username){
                next();
            }else{
                res.redirect('/login');
            }
        },

        adminRouterPointer(req, res, next){
            if(routerPointer[req.path]){
                res.redirect(routerPointer[req.path]);
            }else{
                next();
            }
        },

        getAdminRouterRender(req, res){
            match({ routes: React.cloneElement(Admin,{username:req.session.username}), location: req.url }, (err, redirect, props) => {
                if (err) {
                    // there was an error somewhere during route matching
                    res.status(500).send(err.message)
                } else if (redirect) {
                    // we haven't talked about `onEnter` hooks on routes, but before a
                    // route is entered, it can redirect. Here we handle on the server.
                    res.redirect(redirect.pathname + redirect.search)
                } else if (props) {

                    // if we got props then we matched a route and can render
                    const appHtml = renderToString(<RouterContext {...props}/>);
                    res.render('admin',{name:'admin',reactOutput: appHtml})
                } else {
                    // no errors, no redirect, we just didn't match anything
                    res.status(404).send('Not Found')
                }
            })
        },

        getHome(req, res){
            res.render('home',{name:'home', isLogin:req.session.username?req.session.username:"" ,reactOutput: renderToString(IndexPage({}))});
        },

        getLogin(req, res){
            if(req.session.username){
                res.redirect('/admin/home');
            }else{
                res.render('login',{name:'login',reactOutput: renderToString(IndexPage({}))});
            }
        },

        getLogout(req, res){
            if(!req.session.username){
                res.redirect('/login');
            }else{
                delete req.session.username;
                res.redirect('/login');
            }
        },

        getWxServerAuth(req, res){
            //微信接口验证
            let token  = db.wxConfig.token,
                {timestamp, nonce, signature, echostr} = req.query,
                tmpArr = [token, timestamp, nonce],
                sortArr = tmpArr.sort(),
                tmpStr = sortArr.join(""),
                sha1 = require('crypto').createHash('sha1');

            sha1.update(tmpStr);

            if(signature == sha1.digest('hex')){
                console.log('验证成功');
                res.send(echostr);
                db.updateWxConfig({hasValidate:true}).then(ret => {
                    if(ret.state == 4){
                        console.log('更新成功');
                        wx.init(db);
                    }
                });
            }else{
                console.log('验证失败');
                res.send(0);
            }
        },

        getWeChatAuthorize(req, res, next){
            if(req.session.userinfo){
                //已经认证过的用户
                if(new Date().getTime()  > req.session.userinfo.end_time){
                    console.log(`Auth Token 已经过期！必须刷新`);
                    wx.refreshAuthToken(db,req.session.userinfo.refresh_token).then(ret => {
                        if(ret.errcode){
                            console.log(`无法刷新,刷新过期的话要重新授权：${ret.errcode}`);
                            delete req.session.userinfo;
                            res.redirect('/weChat');
                        }else{
                            req.session.userinfo.access_token  = ret.access_token;
                            req.session.userinfo.expires_in = ret.expires_in;
                            req.session.userinfo.openid = ret.openid;
                            req.session.userinfo.scope = ret.scope;
                            req.session.userinfo.end_time = new Date().getTime() + ret.expires_in * 1000;
                            next();
                        }

                    }).catch(err => {
                        console.log(err);
                    })
                }else{
                    console.log(`Auth Token 未过期！`);
                    next();
                }

            }else if(req.query.code){
                //认真完毕获得code的用户
                console.log(`req.query.code：${req.query.code}`);
                wx.getAuthToken(db,req.query.code).then(ret => {
                    if(ret.errcode){
                        console.log(ret.errcode);
                        res.redirect('/weChat');
                    }else{
                        req.session.userinfo = ret;
                        req.session.userinfo.end_time = new Date().getTime() + ret.expires_in * 1000;
                        next();
                    }

                }).catch(err => {
                    console.log(err);
                })

            }else{

                //未认真过的用户
                let {appID} = db.wxConfig,
                    {domain} = db.webConfig,
                    redirect_uri = encodeURIComponent(domain + req.originalUrl),
                    redirect = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appID}&redirect_uri=${redirect_uri}&scope=snsapi_base&response_type=code&state=STATE#wechat_redirect`;
                res.redirect(redirect);
            }
        },


        getWeChatRender(req, res){
            console.log(`req.session.userinfo：${req.session.userinfo}`);

            let {access_token, openid} = req.session.userinfo,
                {domain} = db.webConfig,
                {appID, noncestr, ticket} = db.wxConfig,
                timestamp = Math.round(new Date().getTime() / 1000),
                url = domain + req.originalUrl,
                string1 = `jsapi_ticket=${ticket}&noncestr=${noncestr}&timestamp=${timestamp}&url=${url}`,
                sha1 = require('crypto').createHash('sha1');

            //加密string1
            sha1.update(string1);


            let signature = sha1.digest('hex');

            //验证 token 是否有效
            wx.hasAuthToken(access_token,openid).then(ret => {
                console.log(ret);
            }).catch(err => {
                console.log(err);
            });

            //console.log(`ticket：${ticket}`);
            //console.log(`noncestr：${noncestr}`);
            //console.log(`timestamp：${timestamp}`);
            //console.log(`url：${url}`);
            //console.log(`string1：${string1}`);
            //console.log(`signature：${signature}`);

            res.render('wechat',{
                name:'wechat',
                appID:appID,
                timestamp:timestamp,
                nonceStr:noncestr,
                signature : signature
            });
        },

        postWxServerAuth(req, res){
            if(req.body.xml.msgtype == 'event' && req.body.xml.msgtype == 'LOCATION'){
                //测试用,屏蔽获取地理信息
                res.send("");
            }else{
                console.log(req.body);
                res.send("");
            }
        },

        postLogin(req, res){
            db.hasLogin(req.body).then(ret =>{
                let ret1 = err.all(ret,'登录验证');
                if(ret1.state == 0){
                    console.log(`登陆成功！`);
                    req.session.username = req.body.username;
                }
                res.json(ret1);
            });
        },

        postInterception(req, res, next){
            if(req.session.username){
                next();
            }else{
                res.json({err:'Not! post'})
            }
        },

        postWebConfig(req, res){
            if(req.body.title || req.body.title == ""){
                //设置
                db.WebConfig(req.body).then(ret => {
                    res.send(ret);
                }).catch(err => {
                    throw `${err}`
                })
            }else{
                //获取
                res.json(db.webConfig);
            }
        },

        postWxConfig(req, res){
            if(req.body.appID || req.body.appID == ""){
                //设置
                db.WxConfig(tool.handleWxConfig(req.body)).then(ret => {
                    res.send(ret);
                }).catch(err => {
                    throw `${err}`
                })
            }else{
                console.log(db.wxConfig);
                res.json(tool.handleWxConfig(db.wxConfig));
            }
        },

        postCustomMenu(req, res){
            if(req.body.deleteMenu){
                //删除菜单
                wx.deleteMenu(db.wxConfig.access_token).then(ret => {

                    res.json(err.all(ret.errcode,'删除菜单'));

                }).catch(err => {
                    console.log(err);
                    res.json(err);
                })

            }else if(req.body.button){
                // 更新菜单
                wx.updateCustomMenu(db.wxConfig.access_token,req.body).then(ret => {

                    res.json(err.all(ret.errcode,'更新菜单'));

                }).catch(err => {
                    console.log(err);
                    res.json(err);
                });

            }else{
                // 查询菜单
                wx.getCustomMenuInfo(db.wxConfig.access_token).then(ret => {

                    if(ret.errcode){
                        res.json(err.all(ret.errcode,'查询菜单'));
                    }else{
                        res.json(ret);
                    }

                }).catch(err => {
                    console.log(err);
                    res.json(err);
                });
            }
        }
    }
}