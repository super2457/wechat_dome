import React, {Component} from 'react';
import SpinLoading from '../../spinLoading';
import { Steps, Row, Col, Button, Alert} from 'antd';

const
    Step = Steps.Step,
    steps = [{
        title: '步骤一',
        description: '获取配置appID'
    }, {
        title: '步骤二',
        description: '配置服务器信息'
    }, {
        title: '步骤三',
        description: '启用'
    }].map((s, i) => <Step key={i} title={s.title} description={s.description} />);

export default class Dome extends Component{

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isSpinLoading : false,
            stepCurrent : 0
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({isSpinLoading:true});
        },500)
    }
    stepNext(step){

        this.setState({stepCurrent:(step == (steps.length - 1))?0:step+1})
    }
    renderStep(step){
        if(step == 0){
            return (
                <div>
                    <Alert message="登录微信公众号 ——> 开发 ——> 基本配置" type="info" showIcon />
                    <img src={require('../../images/appid.jpg')}/>
                    <Alert message="获取AppID && AppSecret ——> 复制粘贴到微信配置" type="info" showIcon />
                    <img src={require('../../images/appid2.jpg')} />
                    <Alert message="在微信配置填入Token(3-32字符),注意该Token和接下来服务器配置的Token一致" type="warn" showIcon />
                </div>
            )
        }
        if(step == 1){
            return (
                <div>
                    <Alert message="登录微信公众号 ——> 开发 ——> 基本配置 ——> 修改配置" type="info" showIcon />
                    <img src={require('../../images/config.jpg')} />
                    <Alert message="提交" type="info" showIcon />
                </div>
            )
        }
        if(step == 2){
            return (
                <div>
                    <Alert message="登录微信公众号 ——> 开发 ——> 基本配置 ——> 服务器配置" type="info" showIcon />
                    <img src={require('../../images/config2.jpg')} />
                    <Alert message="启用" type="info" showIcon />
                </div>
            )
        }
    }

    render() {
        if(!this.state.isSpinLoading){
            return (<SpinLoading />)
        }

        return (
            <div>
                <Steps current={this.state.stepCurrent}>{steps}</Steps>
                {this.renderStep(this.state.stepCurrent)}
                <Button type="primary" onClick={() => {this.stepNext(this.state.stepCurrent)}}>下一步</Button>
            </div>
        )
    }
}

