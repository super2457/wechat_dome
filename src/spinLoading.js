import React, {Component} from 'react';
import { Row, Col, Icon, Spin} from 'antd';

const Styles = {
    loadingBox : {
        width : "100%",
        height: "100%"
    }
};

export default class SpinLoading extends Component{
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }
    render(){
        return (
            <Row type="flex" justify="space-around" align="middle" style={Styles.loadingBox}>
                <Col>
                    <Spin size="large"/>
                </Col>
            </Row>
        )
    }
}