import mongoose from 'mongoose';
import {md5} from 'lei-utils';
import credentials from './credentials';
import Err from './error';

const err = new Err();

class WX_Db{
    constructor(username,password) {
        Object.assign(this,{
            username : (username)?username:`superjs`,
            password : (password)?password: `super2457`,
            db : null,
            schema : {},
            model : {},
            webConfig : {},
            wxConfig : {}
        })
    }
}

Object.assign(WX_Db.prototype,{
    connect(){
        return new Promise((resolve, reject) => {
            let db = mongoose.connect(`mongodb://${this.username}:${this.password}@ds013898.mongolab.com:13898/wx_mall`);
            //let db = mongoose.connect(`mongodb://${this.username}:${this.password}@ds023418.mlab.com:23418/aws_wechat`);
            db.connection.on("error",error => {
                    throw `数据库连接错误：${error}`
                })
                .on("disconnected",() => {
                    throw `数据库断开连接`
                })
                .once("open",() => {
                    console.log(`数据库连接成功`);
                    Object.assign(this,{
                        db : db
                    });
                    resolve(`数据库连接成功`)
                });
        })
    },
    createSchema(){
        let schema = {
            admin : new mongoose.Schema({
                username : { type : String, unique : true},
                password : { type : String, set : this.createMD5},
                superAdmin : { type : Number, default : 0 }
            }),
            webConfig : new mongoose.Schema({
                title : { type : String , default : "" },
                icp : { type : String , default : "Copyright (c) 2015 Alipay.com"},
                copyright : { type : String , default : "" },
                domain : { type : String , default : "" }
            }),
            wxConfig : new mongoose.Schema({
                appID : { type : String , default : "wxde243eb4ecae1f5a"},
                appsecret : { type : String , default : "16033ebc412965397f902f02e504e72e"},
                access_token : { type : String , default : ""},
                expires_in : { type : Number, default : 7200},
                end_time : {type : Number , default : 0},
                hasValidate : {type : Boolean, default : true},
                token : {type : String , default : "varjug1421047124"},
                ticket : {type : String , default : ""},
                noncestr : {type : String , default : "Wm3WZYTPz0wzccnW"}
            })
        };

        Object.assign(this,{schema:schema});
    },
    createModel(){
        let obj = {};

        for(let i in this.schema){
            obj[`${i}Model`] = this.db.model(`${i}`,this.schema[i]);
        }

        Object.assign(this.model,obj);
    },
    createMD5(password){
        return md5(`${password}${credentials.md5}`)
    },
    hasLogin(json){
        let model = this.model;
        return new Promise((resolve, reject) => {
            model['adminModel'].findOne({username:json.username},(err, doc) => {
                if(err) {
                    resolve(err.code);
                    return;
                }
                if(doc){
                    if(this.createMD5(json.password) == doc.password){
                        //密码正确
                        resolve(0);
                    }else{
                        //密码错误
                        resolve(1);
                    }
                }else{
                    //没有这个账户
                    if(json.username == 'admin'){
                        //如果用户名是admin，那么admin没有创建
                        this.createAdmin({username:'admin',password:'admin'}).then(ret => {
                            if(ret == 0){
                                resolve(0);
                            }else{
                                resolve(2);
                            }
                        }).catch(err => {
                            resolve(2);
                        })
                    }else{
                        resolve(2);
                    }
                }

            })
        })
    },

    createAdmin(json){
        let model = this.model;
        return new Promise((resolve, reject) => {
            model['adminModel'].create({
                username : json.username,
                password : json.password
            },(err, doc) => {
                if(err) {
                    console.log(`创建管理员错误：${err}`);
                    resolve(11000);
                }
                if(doc){
                    console.log(doc);
                    resolve(0);
                }

            })
        })
    },


    createData(ModelName, ModelData){
        let model = this.model;
        return new Promise((resolve, reject) => {
            model[ModelName].create(ModelData,(err, doc) => {
                if(err){
                    resolve(err.code);
                }
                if(doc){
                    resolve(true);
                }else{
                    resolve(false);
                }

            })
        })
    },
    /**
     * 创建网站配置
     */
    createWebConfig(){
        console.log(`第一次启动服务器,未设置服务器配置`);
        let model = this.model;
        return new Promise((resolve, reject) => {
            model['webConfigModel'].create({
                icp: 'Copyright (c) 2015 Alipay.com'
            },(err, doc) => {
                if(err){
                    resolve(err.code);
                }
                if(doc){
                    Object.assign(this,{webConfig:doc});
                    resolve(0)
                }else{
                    resolve(3)
                }
            })
        })
    },
    /**
     * 更新网站配置
     */
    updateConfig(json){
        let model = this.model;
        return new Promise((resolve, reject) => {
            model['webConfigModel'].update({},json,(err, doc) => {
                if(err){
                    resolve(err.code);
                }
                if(doc.ok > 0){
                    Object.assign(this.webConfig,json);
                    resolve(0);
                }else{
                    resolve(5);
                }

            })
        })
    },
    /**
     * 读取网站配置
     */
    readWebConfig(){
        let model = this.model;
        return new Promise((resolve, reject) => {
            model['webConfigModel'].findOne({},(err, doc) => {
                if(err) {
                    resolve(err.code);
                    return;
                }
                if(doc){
                    //读取配置成功,并且保存在db属性里
                    Object.assign(this,{webConfig:doc});
                    resolve(0);
                }else{
                    //读取失败
                    resolve(4);
                }
            })
        })
    },
    /**
     * 网站配置操作：读取,(读取不到数据则创建) & 更新
     */
    async WebConfig(handle){
        let
            model = this.model,
            arg = arguments,
            ret;

        if(arg.length > 0 && arg[0]){
            //更新WebConfig
            let ret1 = await this.updateConfig(handle);
            ret = err.all(ret1,'更新网站配置');

        }else{
            let ret1 = await this.readWebConfig();
            ret = err.all(ret1,'读取网站配置');

            //读取结果
            if(ret.state != 0){
                let ret2 = await this.createWebConfig();
                ret = err.all(ret2,'创建网站配置');
            }
        }

        return ret

    },
    /**
     * 创建微信配置
     */
    createWxConfig(){
        console.log(`第一次启动服务器,未设置微信配置`);
        let model = this.model;
        return new Promise((resolve, reject) => {
            model['wxConfigModel'].create({},(err, doc) => {
                if(err) {
                    resolve(err.code);
                }
                if(doc){
                    Object.assign(this,{wxConfig:doc});
                    resolve(0);
                }else{
                    resolve(6);
                }
            })
        })
    },
    /**
     * 读取微信配置
     */
    readWxConfig(){
        let model = this.model;
        return new Promise((resolve, reject) => {
            model['wxConfigModel'].findOne({},(err, doc) => {
                if(err){
                    resolve(err.code)
                }
                if(doc){
                    Object.assign(this,{wxConfig:doc});
                    resolve(0);
                }else{
                    resolve(7);
                }
            })
        })
    },
    /**
     * 更新微信配置
     */
    updateWxConfig(json){
        let model = this.model;
        return new Promise((resolve, reject) => {
            model['wxConfigModel'].update({},json,(err, doc) => {
                if(err){
                    resolve(err.code)
                }
                if(doc.ok > 0){
                    Object.assign(this.wxConfig,json);
                    resolve(0);
                }else{
                    resolve(8);
                }

            })
        })
    },
    /**
     * 微信配置操作：读取,(读取不到数据则创建) & 更新
     */
    async WxConfig(handle){
        let
            model = this.model,
            arg = arguments,
            ret;

        if(arg.length > 0 && arg[0]){
            //更新WxConfig
            let ret1 = await this.updateWxConfig(handle);
            ret = err.all(ret1,'更新WxConfig');
        }else{
            //查询WxConfig
            let ret1 = await this.readWxConfig();
            ret = err.all(ret1,'读取微信配置');

            //读取结果不是0,即创建WxConfig
            if(ret.state != 0){
                let ret2 = await this.createWxConfig();
                ret = err.all(ret2,'创建微信配置');
            }
        }

        return ret
    },

    async init(){
        await this.connect();
        this.createSchema();
        this.createModel();
        console.log(`数据库模型创建完毕`);

        //尝试读取网站配置
        await this.WebConfig();
        console.log(`站点配置检查完毕`);

        //尝试读取微信配置
        await this.WxConfig();
        console.log(`微信配置检查完毕`);

        return true;
    }
});

export default WX_Db