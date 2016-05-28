import React, {Component} from 'react';
import SpinLoading from '../../spinLoading';

export default class Email extends Component{

    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isSpinLoading : false
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({isSpinLoading:true});
        },500)
    }

    render() {
        if(!this.state.isSpinLoading){
            return (<SpinLoading />)
        }

        return (
            <div>
                Email
            </div>
        )
    }
}