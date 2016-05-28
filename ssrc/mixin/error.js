const errInfo = {
    [-1] : {
        state : -1,
        message : `系统繁忙`
    },
    [0] : {
        state : 0,
        message : `请求成功`
    },
    [1] : {
        state : 1,
        message : `密码错误`
    },
    [2] : {
        state : 2,
        message : `未注册`
    },
    [3] : {
        state : 3,
        message : `创建网站配置失败`
    },
    [4] : {
        state : 4,
        message : `读取网站配置失败`
    },
    [5] : {
        state : 5,
        message : `更新网站配置失败`
    },
    [6] : {
        state : 6,
        message : `创建微信配置失败`
    },
    [7] : {
        state : 7,
        message : `读取微信配置失败`
    },
    [8] : {
        state : 8,
        message : `更新微信配置失败`
    },
    [11000] : {
        state : 11000,
        message : `已经存在`
    },
    [46003] : {
        state : 46003,
        message : `不存在的菜单数据`
    },
    [40016] : {
        state : 40016,
        message : `不合法的按钮个数`
    },
    [99999] : {
        state : 99999,
        message : `系统繁忙`
    }
};

class Err {
    constructor() {

    }
}

Object.assign(Err.prototype,{
    print(errNum,options){
        if(errInfo[errNum]){
            console.log(`${(options)?options+'：':''}${errInfo[errNum].message}`);
        }else{
            console.log(`没有这个状态：${errNum}`);
        }
    },
    ret(errNum,options){

        if(errInfo[errNum]){
            return errInfo[errNum]
        }else{
            return {
                state : 100000,
                message : `没有这个状态`
            }
        }
    },
    all(errNum,options){
        this.print(errNum,options);
        return this.ret(errNum)
    }
});

export default Err




