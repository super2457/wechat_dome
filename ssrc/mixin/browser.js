export default function () {
    return (req,res,next) => {
        let str = req.headers['user-agent'],
            sign1 = 'MSIE',
            sign2 = 'MSIE 10.0';

        if(str.indexOf(sign1) > -1){
            //if(str.indexOf(sign2) > -1) {
            //    next();
            //    return;
            //}
            res.send('请使用谷歌浏览器，获得更好的用户体验');
        }else{
            next();
        }

    }
}