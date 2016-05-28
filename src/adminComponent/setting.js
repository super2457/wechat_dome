import React, {Component} from 'react';
import {Link} from 'react-router';
import {Menu, Icon} from 'antd';


export default class Setting extends Component{

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        const
            select = this.props.location.pathname.split("/"),
            len =  select.length;

        return (
            <div>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[select[len-1]]}>
                    <Menu.Item key="index"><Link to="/admin/setting/index">网站设置</Link></Menu.Item>
                    <Menu.Item key="email"><Link to="/admin/setting/email">邮件设置</Link></Menu.Item>
                </Menu>
                <div className="ant-layout-second-content">
                    {this.props.children || '网站设置默认页'}
                </div>
            </div>
        )
    }
}