import React, { Component } from 'react';
import { loadChatDialogRequest } from '../actions/actions'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'


class ChatDialog extends Component {

    constructor(props){
        super(props)
        console.log('eeee')
        this.state = {
            openDialog: true,
            scroll: 'paper'
        }
    }
    componentDidMount(){
        console.log('oi')
        this.props.loadChatDialogExams(this.props.file._id)
    }

    render() {
        return (
            <Dialog
                open={this.state.openDialog}
                
                scroll={this.state.scroll}
                aria-labelledby="scroll-dialog-title"
            >
                <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
                <DialogContent dividers={this.state.scroll === 'paper'}>
                <DialogContentText>

                    </DialogContentText>
                    </DialogContent>
                    </Dialog>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        isFetching: state.chatDialog.isFetching,
        messages: state.chatDialog.data,
        error: state.chatDialog.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadChatDialogExams: (file_id) => dispatch(loadChatDialogRequest(file_id))
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(ChatDialog)