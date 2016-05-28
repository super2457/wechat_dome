import React, {Component} from 'react';
import { Row, Col, Icon, Spin } from 'antd';

export default class Loading extends Component{
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }
    render(){
        return (
            <Row type="flex" justify="space-around" align="middle" style={{height: '700px'}}>
                <Col><Spin size="large" /></Col>
            </Row>
        )
    }
}