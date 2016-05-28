import React, {Component, createFactory} from 'react';
import Loading from './loading'




class IndexPage extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render(){
        return <div>
            <Loading />
        </div>
    }
}

export default createFactory(IndexPage)

