import React, { Component } from 'react'
import { loadDataRequest } from './actions'
import { connect } from 'react-redux'

class Login extends Component{
    render(){
        return (
            <p>Login</p>
        )
    }
}

const mapStateToProps = (state) =>{
    return {
        isFetching: state.login.isFetching,
        data: state.login.data,
        error: state.login.error
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        loadData: () => dispatch(loadDataRequest()) 
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)