import fs, {exists, readFile, writeFile} from 'fs';
import path, {join} from 'path';
import https from 'https';
import iconv from 'iconv-lite';


function GetPromise(options,errName){
    return new Promise((resolve, reject) => {
        let bodyChunk = '',
            req = https.get(options,res => {
                res.on('data',chunk =>{

                    bodyChunk = JSON.parse(chunk);
                    if(bodyChunk.errcode) console.log(`${errName}：${bodyChunk.errmsg}`)

                }).on('end',() => {
                    resolve(bodyChunk)
                })
            });

        req.on('error',e => {
            throw `获取${errName}失败：${e}`;
        })
    });
}

class WX{
    constructor(){

    }
}

Object.assign(WX.prototype,{

    hasAuthToken(access_token,openid){
        let options = {
            hostname: 'api.weixin.qq.com',
            path: `/sns/auth?access_token=${access_token}&openid=${openid}`
        };

        return GetPromise(options,'验证AuthToken')
    },

    getUserInfo(access_token,openid){
        //如果网页授权作用域为snsapi_userinfo，则此时开发者可以通过access_token和openid拉取用户信息了。
        let options = {
            hostname: 'api.weixin.qq.com',
            path: `/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`
        };

        return GetPromise(options,'获取用户信息')
    },

    getAuthToken(db,code){
        let {appID, appsecret} = db.wxConfig;
        let options = {
            hostname: 'api.weixin.qq.com',
            path: `/sns/oauth2/access_token?appid=${appID}&secret=${appsecret}&code=${code}&grant_type=authorization_code`
        };

        return GetPromise(options,'获取AuthToken')
    },

    refreshAuthToken(db,refresh_token){
        let {appID} = db.wxConfig;
        let options = {
            hostname: 'api.weixin.qq.com',
            path: `/sns/oauth2/refresh_token?appid=${appID}&grant_type=refresh_token&refresh_token=${refresh_token}`
        };

        return GetPromise(options,'刷新AuthToken')
    },

    getToken (id,secret){
        let options = {
            hostname: 'api.weixin.qq.com',
            path: `/cgi-bin/token?grant_type=client_credential&appid=${id}&secret=${secret}`
        };
        return GetPromise(options,'获取Token')
    },

    getTicket(access_token){
        let options = {
            hostname: 'api.weixin.qq.com',
            path: `/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
        };
        return GetPromise(options,'获取Ticket')
    },

    getCustomMenuInfo(access_token){
        let options = {
            hostname: 'api.weixin.qq.com',
            path: `/cgi-bin/menu/get?access_token=${access_token}`
        };
        return GetPromise(options,'获取菜单信息')
    },

    deleteMenu(access_token){
        let options = {
            hostname: 'api.weixin.qq.com',
            path: `/cgi-bin/menu/delete?access_token=${access_token}`
        };
        return GetPromise(options,'删除菜单')
    },

    updateCustomMenu(token,data){

        let
            post_data = JSON.stringify(data),
            post_data2 = post_data.replace(/\//g,"\\\/"),
            options = {
                hostname: 'api.weixin.qq.com',
                path: `/cgi-bin/menu/create?access_token=${token}`,
                method: 'POST',
                headers : {
                    'Content-Type' : 'application/json',
                    'Content-Length' : post_data2.length,
                }
            };

        return new Promise((resolve, reject) => {
            let bodyChunk = '',
                post_req = https.request(options, res => {
                    res.on('data',chunk =>{
                        bodyChunk = JSON.parse(chunk);
                        if(bodyChunk.errcode) console.log(`错误信息：${bodyChunk.errmsg}`)
                    }).on('end',() => {
                        resolve(bodyChunk)
                    })
                });
            post_req.on('error',e => {
                throw `创建菜单失败：${e}`;
            });
            console.log(post_data2);
            let data = iconv.encode(post_data2,'utf8');
            console.log(data);
            post_req.write(data);
            post_req.end();
        })
    },

    updateTokenTime(token){
        return Object.assign({},token,{
            end_time : new Date().getTime() + token.expires_in * 1000,
            hasValidate : true
        });
    },

    timerUpdateToken(db,updateTokenTime){
        console.log(`${updateTokenTime}秒后更新TOKEN && TICKET`);
        setTimeout(() => {
            this.getTokenAndTicket(db).then(ret => {
                db.WxConfig(this.updateTokenTime(ret));
                this.timerUpdateToken(db,ret.expires_in)
            });
        },updateTokenTime * 1000)
    },

    async getTokenAndTicket(db){
        let {appID, appsecret} = db.wxConfig;
        let newToken = await this.getToken(appID,appsecret);
        let newTicket = await this.getTicket(newToken.access_token);
        Object.assign(newToken,newTicket);
        return newToken
    },

    async init (db){
        let {hasValidate, end_time} = db.wxConfig;
        if(hasValidate){

            if((new Date().getTime() >= end_time)){
                console.log(`token && ticket已经过期`);
                let newTokenTicket = await this.getTokenAndTicket(db);
                let newTokenTime = this.updateTokenTime(newTokenTicket);
                let updateRet = await db.WxConfig(newTokenTime);
                if(updateRet.state == 0){
                    this.timerUpdateToken(db,db.wxConfig.expires_in);
                }else{
                    console.log(`updateRet：${updateRet}`);
                }
            }else{
                console.log(`token && ticket未过期`);
                this.timerUpdateToken(db,(end_time - new Date().getTime()) / 1000);
            }
        }

        return true;
    }
});

export default WX;


