import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import 'antd/lib/index.css';
import './styles/admin.css';
import './styles/custom_menu.css';
import {Row, Col, QueueAnim} from 'antd';
import Loading from './loading';


class Home extends Component{
    constructor(props) {
        super(props);
        this.state = {
            loading : true
        }
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
            this.setState({loading:false});
        },1500);
    }

    render() {
        if(this.state.loading) return this.loadingRender();

        const isLogin = document.getElementById('isLogin').value;


        return <Row>
            <Col span="12" offset="6">
                <QueueAnim delay={500}>
                    <div key="a">首页</div>
                    {(isLogin.length>0)?<div key="b">你好！{isLogin},<a href="/admin">管理中心</a>,<a href="/logout">退出登录</a></div>
                        :<div key="c"><a href="/login">登录</a></div>}

                </QueueAnim>
            </Col>
        </Row>
    }
}

render(<Home />,document.getElementById('main'));

