import React, {Component} from 'react';
import {Link} from 'react-router';
import Menu from 'antd/lib/menu';
import Icon from 'antd/lib/icon';


export default class Wx extends Component{

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
                    <Menu.Item key="demo"><Link to="/admin/wx/demo">配置演示</Link></Menu.Item>
                    <Menu.Item key="config"><Link to="/admin/wx/config">微信配置</Link></Menu.Item>
                    <Menu.Item key="customMenu"><Link to="/admin/wx/customMenu">自定义菜单</Link></Menu.Item>
                </Menu>
                <div className="ant-layout-second-content">
                    {this.props.children || '微信设置默认页'}
                </div>
            </div>
        )
    }
}