import React, {Component} from 'react';
import SpinLoading from '../../spinLoading';
import { Form, Input, Select, Row, Col, Button, notification} from 'antd';
import Req from '../../mixin/request';

const FormItem = Form.Item,
    createForm = Form.create;

let req = new Req();

class Config extends Component{

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isSpinLoading : false
        }
    }

    notification(json){
        let type = (json.state == 0)?'success':'error';
        notification[type]({
            message : '修改结果',
            description : json.message
        })
    }

    componentDidMount() {
        setTimeout(() => {
            this.getWebConfig();
        },200)
    }

    getWebConfig() {
        req.post('/WxConfig',{}).then(json => {
            this.setState({isSpinLoading:true});
            this.props.form.setFieldsValue(json)
        }).catch(err => {
            console.log(err);
        })
    }

    handleSubmit() {
        this.setWebConfig()
    }

    setWebConfig() {
        let data = this.props.form.getFieldsValue();
        req.post('/WxConfig',data).then(json => {
            this.notification(json);
        }).catch(err => {
            console.log(err);
        })
    }

    render() {
        if(!this.state.isSpinLoading){
            return (<SpinLoading />)
        }

        const { getFieldProps } = this.props.form;

        return (
            <Form horizontal>
                <FormItem
                    label="appID:"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 7 }}>
                    <Input {...getFieldProps('appID')}/>
                </FormItem>
                <FormItem
                    label="appsecret:"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 7 }}>
                    <Input {...getFieldProps('appsecret')}/>
                </FormItem>
                <FormItem
                    label="token:"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 7 }}>
                    <Input {...getFieldProps('token')}/>
                </FormItem>
                <FormItem
                    label="noncestr:"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 7 }}>
                    <Input {...getFieldProps('noncestr')}/>
                </FormItem>
                <FormItem wrapperCol={{ span: 7, offset: 9 }} >
                    <Button type="primary" onClick={() => {this.handleSubmit()}}>保存修改</Button>
                </FormItem>
            </Form>
        )
    }
}


export default createForm()(Config)