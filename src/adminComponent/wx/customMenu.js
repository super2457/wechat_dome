import React, {Component} from 'react';
import SpinLoading from '../../spinLoading';
import { Button, Row, Col, Form, Input, Radio, notification, Icon} from 'antd';
import Req from '../../mixin/request';

const
    createForm = Form.create,
    FormItem = Form.Item,
    RadioGroup = Radio.Group,
    req = new Req();


class CustomMenu extends Component{

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isSpinLoading : false,
            button : [
                {
                    "type":"click",
                    "name":"点赞",
                    "key":"V1001_TODAY_MUSIC"
                },
                {
                    "name":"menu",
                    "sub_button":[
                        {
                            "type":"view",
                            "name":"weChat",
                            "url":"http://wxmall2.nat123.net/weChat"
                        }]
                }
            ]
        }
    }

    getMenuDate2(){
        let handle = '获取菜单';

        req.post('/CustomMenu',{}).then(ret => {
            if(ret.state){
                this.setState({button : []});
                this.notification(ret,handle)
            }else{
                this.setState({button : ret.menu.button});
                this.notification({state:0,message:'请求成功'},handle);
                console.log(this.state.button);
            }
        }).catch(err => {
            console.dir(err);
        });
    }

    getMenuDate(){

        return req.post('/CustomMenu',{})
    }

    deleteMenu(){
        req.post('/CustomMenu',{deleteMenu:true}).then(ret => {
            this.notification(ret,'删除菜单');
            if(ret.state == 0){
                this.setState({button : []});
            }
        }).catch(err => {
            console.dir(err);
        });
    }

    updateMenu(){

        req.post('/CustomMenu',{button : [
            {
                "type":"click",
                "name":"点赞",
                "key":"V1001_TODAY_MUSIC"
            },
            {
                "name":"menu",
                "sub_button":[
                    {
                        "type":"view",
                        "name":"weChat",
                        "url":"http://wxmall2.nat123.net/weChat"
                    }]
            }
        ]}).then(ret => {
            this.notification(ret,'更新菜单');
        }).catch(err => {
            console.dir(err);
        });
    }

    componentDidMount() {
        let handle = '获取菜单';
        this.getMenuDate().then(ret => {
            if(ret.state){
                this.setState({isSpinLoading:true,button : []});
                this.notification(ret,handle)
            }else{
                this.setState({isSpinLoading:true,button : ret.menu.button});
                this.notification({state:0,message:'请求成功'},handle)
            }

        }).catch(err => {

        })
    }

    checkMenuName(rule, value, callback) {
        let maxLen = 8,
            nameLen = 0;
        for(let i of value){
            (/^[\u4e00-\u9fa5]+$/i.test(i))?nameLen += 2:nameLen += 1
        }
        if(nameLen > maxLen || nameLen <= 0){
            callback('字数不超过4个汉字或8个字母');
        }else{
            callback();
        }
    }

    checkMethod(rule, value, callback) {

        console.log(value);
    }

    notification(json,text){
        let type = (json.state == 0)?'success':'error';
        notification[type]({
            message : text,
            description : (json.state == 0)?`${text}成功！`:json.message
        })
    }

    renderMenu (len) {

        if(len){
            return (
                this.state.button.map(item => {

                })
            )
        }else{
            return (
                <div style={{width:'100%'}}><Icon type="plus" /></div>
            )
        }

    }

    render() {
        if(!this.state.isSpinLoading){
            return (<SpinLoading />)
        }

        const
            formItemLayout = {
                labelCol: { span: 4 },
                wrapperCol: { span: 12 }
            },
            { getFieldProps, getFieldError, isFieldValidating, getFieldValue } = this.props.form;

        return (
            <div>
                <div className="ant-custom-menu-box">
                    <div style={{position: 'relative'}}>
                        <img src={require('../../images/custommenu.png')} />
                        <div style={{position:'absolute',top: 0, left: 0, right: 0, bottom: 0}}>

                            <div className="ant-custom-menu-pk">
                                {this.renderMenu(this.state.button.length)}
                            </div>

                        </div>
                    </div>
                    <div className="ant-custom-portable-editor">
                        <section className="ant-custom-editor-inner">
                            <header className="ant-custom-menu-form-hd">
                                <Row>
                                    <Col span="4">主菜单</Col>
                                    <Col span="4" offset="16" style={{textAlign: 'right'}}>删除菜单</Col>
                                </Row>
                            </header>

                            <section className="ant-custom-content1">
                                <Form horizontal form={this.props.form}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="菜单名称："
                                        hasFeedback>
                                        <Input placeholder="MenuName"
                                            {...getFieldProps('MenuName', {
                                                rules: [
                                                    {validator: this.checkMenuName.bind(this)}
                                                ]
                                            })} />
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="菜单内容：">
                                        <RadioGroup {...getFieldProps('method', {
                                            initialValue: 'send',
                                            rules: [
                                                {validator: this.checkMethod.bind(this)}
                                            ]
                                        })}>
                                            <Radio value="send">发送信息</Radio>
                                            <Radio value="aweb">跳转网页</Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Form>
                                <section>
                                    {getFieldValue('method')}
                                </section>
                            </section>

                        </section>

                    </div>
                </div>
                <Button type="primary" onClick={() => {this.getMenuDate2()}}>查询菜单</Button>
                <Button type="primary" onClick={() => {this.updateMenu()}}>更新菜单</Button>
                <Button type="primary" onClick={() => {this.deleteMenu()}}>删除菜单</Button>
            </div>
        )
    }
}

CustomMenu =  createForm()(CustomMenu);

export default CustomMenu