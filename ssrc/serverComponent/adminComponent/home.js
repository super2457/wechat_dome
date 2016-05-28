import React, {Component} from 'react';
import {Link} from 'react-router';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';

export default class Home extends Component{

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        return (
            <div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['home']}>
                    <Menu.Item key="home"><Link to="/admin/home">首页</Link></Menu.Item>
                </Menu>
                <div>HOME</div>
            </div>
        )
    }
}