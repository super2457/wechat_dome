import React, {Component} from 'react';
import SpinLoading from '../../spinLoading';
import { Form, Input, Select, Row, Col, Button, notification} from 'antd';
import Req from '../../mixin/request';

const FormItem = Form.Item,
    createForm = Form.create;

let req = new Req();

class Index extends Component{

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
        req.post('/WebConfig',{}).then(json => {
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
        console.log(data);
        req.post('/WebConfig',data).then(json => {
            this.notification(json);
        }).catch(err => {
            console.log(err);
        })
    }
    checkDomain(rule, value, callback) {
        if (!(/^https?:\/\//i.test(value)) || /\/$/i.test(value)) {
            callback('请以http:// 或 https://, 结尾请不要使用加上');
        } else {
            callback();
        }
    }

    render() {
        if(!this.state.isSpinLoading){
            return (<SpinLoading />)
        }

        const { getFieldProps } = this.props.form;

        return (
            <Form horizontal form={this.props.form}>
                <FormItem
                    label="title:"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 7 }}>
                    <Input {...getFieldProps('title')}/>
                </FormItem>
                <FormItem
                    label="ICP:"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 7 }}>
                    <Input {...getFieldProps('icp')}/>
                </FormItem>
                <FormItem
                    label="copyright:"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 7 }}>
                    <Input {...getFieldProps('copyright')}/>
                </FormItem>
                <FormItem
                    label="domain:"
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 7 }}
                    hasFeedback>
                    <Input placeholder="http://..." {...getFieldProps('domain',{
                        rules:[
                            {
                                validator: this.checkDomain.bind(this)
                            }
                        ]
                    })}/>
                </FormItem>
                <FormItem wrapperCol={{ span: 7, offset: 9 }} >
                    <Button type="primary" onClick={() => {this.handleSubmit()}}>保存修改</Button>
                </FormItem>
            </Form>
        )
    }
}


export default createForm()(Index)