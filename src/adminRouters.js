import React, {Component} from 'react';
import ReactDOM, {render} from 'react-dom';
import {Router, Route, hashHistory, IndexRoute, browserHistory} from 'react-router';
import Admin from './adminComponent/admin';
import Home from './adminComponent/home';

import Setting from './adminComponent/setting';
import SettingIndex from './adminComponent/setting/index';
import Email from './adminComponent/setting/email';

import Wx from './adminComponent/wx';
import WxDome from './adminComponent/wx/dome';
import WxConfig from './adminComponent/wx/config';
import CustomMenu from './adminComponent/wx/customMenu'

class Routers extends Component{
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }

    render() {
        return (<Router history={browserHistory}>
            <Route path="/admin" component={Admin}>
                <Route path="home" component={Home} />
                <Route path="setting" component={Setting} >
                    <Route path="index" component={SettingIndex}/>
                    <Route path="email" component={Email}/>
                </Route>
                <Route path="wx" component={Wx}>
                    <Route path="dome" component={WxDome}/>
                    <Route path="config" component={WxConfig}/>
                    <Route path="customMenu" component={CustomMenu} />
                </Route>
            </Route>
        </Router>)
    }
}

render(<Routers />,document.getElementById('main'));