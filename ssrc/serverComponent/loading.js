import React, {Component} from 'react';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Icon from 'antd/lib/icon';
import Spin from 'antd/lib/spin';


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