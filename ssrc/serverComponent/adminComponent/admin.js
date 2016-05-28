import React, {Component} from 'react';
import {Link} from 'react-router';
import Menu from 'antd/lib/menu';
import Breadcrumb from 'antd/lib/breadcrumb';
import Icon from 'antd/lib/icon';
import openKeys from './open-key';

const SubMenu = Menu.SubMenu;

export default class Admin extends Component{

    constructor(props) {
        super(props);
        // 初始状态

        this.state = {};
    }

    render() {
        const
            select = this.props.location.pathname.split("/"),
            len =  select.length;
        let
            selectedKey = [];

        if(len == 3){
            selectedKey.push(select[len-1]);
        }else if(len == 4){
            selectedKey.push(select[len-2]);
        }else{
            throw `意外状况调试用：${select}`
        }
        //defaultSelectedKeys={['setting']} 选择默认Menu选中key defaultOpenKeys={['system']} 选择默认SubMenu打开key
        return (
            <Breadcrumb>
                <div className="ant-layout-aside">
                    <aside className="ant-layout-sider">
                        <div className="ant-layout-logo"></div>
                        <Menu mode="inline" theme="dark"
                              defaultSelectedKeys={selectedKey} defaultOpenKeys={openKeys[select[len-2]]?[openKeys[select[len-2]]]:[]}>
                            <Menu.Item key="home"><Link to="/admin/home"><Icon type="home" />首页</Link></Menu.Item>
                            <SubMenu key="system" title={<span><Icon type="setting" />系统设置</span>}>
                                <Menu.Item key="setting"><Link to="/admin/setting/index"><Icon type="desktop" />站点设置</Link></Menu.Item>
                                <Menu.Item key="wx"><Link to="/admin/wx/config"><Icon type="aliwangwang-o" />微信配置</Link></Menu.Item>
                                <Menu.Item key="3">选项3</Menu.Item>
                                <Menu.Item key="4">选项4</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub2" title={<span><Icon type="laptop" />导航二</span>}>
                                <Menu.Item key="5">选项5</Menu.Item>
                                <Menu.Item key="6">选项6</Menu.Item>
                                <Menu.Item key="7">选项7</Menu.Item>
                                <Menu.Item key="8">选项8</Menu.Item>
                            </SubMenu>
                            <SubMenu key="sub3" title={<span><Icon type="notification" />导航三</span>}>
                                <Menu.Item key="9">选项9</Menu.Item>
                                <Menu.Item key="10">选项10</Menu.Item>
                                <Menu.Item key="11">选项11</Menu.Item>
                                <Menu.Item key="12">选项12</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </aside>
                    <div className="ant-layout-main">
                        <div className="ant-layout-header">
                            微信公众号管理后台！你好：<span id="username">{this.props.route.username}</span>,<a href="/logout">退出登录</a>
                        </div>
                        <div className="ant-layout-container">
                            <div className="ant-layout-content">
                                <div>
                                    {this.props.children}
                                </div>
                            </div>
                        </div>
                        <div className="ant-layout-footer">
                            Ant Design 版权所有 © 2016
                        </div>
                    </div>
                </div>
            </Breadcrumb>
        )
    }
}




