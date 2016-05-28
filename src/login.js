import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import { Button, Form, Input, Row, Col, notification} from 'antd';
import Loading from './loading';
import Req from './mixin/request';
const createForm = Form.create;
const FormItem = Form.Item;

const
    Styless = {
        container : {
            height : '700px'
        },
        container2 : {
            width : '1000px'
        }
    };
let req = new Req();


class Login extends Component {
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            iconLoading : true
        };
    }
    loadingRender() {
        return (
            <div>
                <Loading />
            </div>
        )
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({iconLoading:false});
            this.props.form.setFieldsValue({
                username : 'admin',
                password : 'admin'
            })
        },1500);
    }
    notification(json){
        let type = (json.state == 0)?'success':'error';
        notification[type]({
            message : '登录结果',
            description : (json.state == 0)?json.message:`登录失败！请检查账户名或密码!`
        })
    }
    handleSubmit() {
        this.props.form.validateFields((errors, values) => {
            if (!!errors) {
                console.log('Errors in form!!!');
                return;
            }
            console.log(values);

            req.post('/login',values).then(json => {
                console.log(json);

                this.notification(json);

                if(json.state == 0){
                    //登录成功修改连接跳转
                    setTimeout(() => {
                        location.href = '/admin'
                    },800);
                }
            }).catch(err => {
                console.log(err);
            })
        });
    }

    render() {
        if(this.state.iconLoading) return this.loadingRender();

        const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;

        return (<Row type="flex" justify="space-around" align="middle" style={Styless.container}>
                <Col style={Styless.container2}><Form horizontal form={this.props.form}>
                <FormItem
                    label="用户名："
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 7 }}
                    hasFeedback
                    help={isFieldValidating('name') ? '校验中...' : (getFieldError('name') || []).join(', ')}>
                    <Input placeholder="username"
                        {...getFieldProps('username', {
                            rules: [
                                { required: true, min: 5, message: '用户名至少为 5 个字符' },
                                { required: true, max: 11, message: '用户名最多为 11 个字符' }
                            ]
                        })} />
                </FormItem>

                <FormItem
                    label="密码："
                    labelCol={{ span: 9 }}
                    wrapperCol={{ span: 7 }}
                    hasFeedback>
                    <Input type="password" placeholder="password"
                        {...getFieldProps('password', {
                            rules: [
                                { required: true, min: 5, message: '密码至少为 5 个字符' },
                                { required: true, max: 11, message: '密码最多为 11 个字符' }
                            ]
                        })} />
                </FormItem>
                <FormItem wrapperCol={{ span: 7, offset: 9 }} >
                    <Button type="primary" onClick={() => {this.handleSubmit()}}>登录</Button>
                </FormItem>
            </Form></Col></Row>
        );
    }
}

Login = createForm()(Login);

ReactDOM.render(<Login />, document.getElementById('main'));




