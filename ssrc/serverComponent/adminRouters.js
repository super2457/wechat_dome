import React, {Component, createFactory} from 'react';
import {Router, Route, IndexRoute} from 'react-router';
import Admin from './adminComponent/admin';
import Home from './adminComponent/home';
import Setting from './adminComponent/setting';
import Wx from './adminComponent/wx';
//统一spinLoading模块,web端在渲染
import SpinLoading from './spinLoading';


export default (<Route path="/admin" component={Admin}>
    <Route path="home" component={Home} />
    <Route path="setting" component={Setting} >
        <Route path="index" component={SpinLoading}/>
        <Route path="email" component={SpinLoading}/>
    </Route>
    <Route path="wx" component={Wx}>
        <Route path="dome" component={SpinLoading}/>
        <Route path="config" component={SpinLoading}/>
        <Route path="customMenu" component={SpinLoading} />
    </Route>
</Route>);