import React, { Component } from 'react';
import { loadChatDialogRequest } from '../actions/actions'
import { connect } from 'react-redux'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContentText from '@material-ui/core/DialogContentText'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import SendIcon from '@material-ui/icons/Send'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import TextField from '@material-ui/core/TextField'
import Grow from  '@material-ui/core/Grow'
import ListItem from '@material-ui/core/ListItem'
import List from '@material-ui/core/List'
import axios from 'axios'
import dotenv from 'dotenv'
import PropTypes from 'prop-types'
import Avatar from '@material-ui/core/Avatar'
import AssigmentIdIcon from '@material-ui/icons/AssignmentInd'
import { blue, deepOrange } from '@material-ui/core/colors'
import Moment from 'moment'
import Card from  '@material-ui/core/Card'
import CardHeader from  '@material-ui/core/CardHeader'
import CardContent from  '@material-ui/core/CardContent'

dotenv.config()
const styles = theme => ({
    title: {
      color: 'red',
    }
  });

class ChatDialog extends Component {

    
    
    constructor(props){
        super(props)
        
        this.state = {
            openDialog: true,
            scroll: 'paper',
            message: ''
        }
        this.renderMessage = this.renderMessage.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.postMessage = this.postMessage.bind(this)
        this.messagesEndRef = React.createRef() 
    }
    componentDidMount(){
        this.props.loadChatDialogExams(this.props.file._id)
    }
    componentWillReceiveProps(newProps){
        setTimeout(()=>{
            this.messagesEndRef.current.scrollIntoView({behavior: 'smooth'})
        }, 1000)
        
    }
    handleClose(){
        this.setState({
            openDialog: false
        })
        this.props.removeDialog()
    }
    handleMessageChange(e){
        this.setState({
            message: e.target.value
        })
    }
    renderMessage(comment, index){
        const { classes } = this.props
        return (

          <div key={comment._id}  >
            <Grow 
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                {...(true ? { timeout: 1000 } : {})}
            >
                <ListItem  style={{width: '100%'}}>
                    <span style={{marginLeft: comment.sender._id === this.props.auth.user._id ? '' : 'auto'}}>
                {comment.sender.admin && 
                (
                        <IconButton style={{float: comment.sender._id === this.props.auth.user._id ? 'left' : 'right'}} onClick={()=>{ 
                                                                                                                                console.log('comment.sender._id', comment.sender._id)
                                                                                                                                console.log('this.props.auth.user._id', this.props.auth.user._id)
                                                                                                                            }}>
                            <Avatar aria-label="Recipe" style={{ color: '#fff', backgroundColor: blue[500], }}>
                                <AssigmentIdIcon />
                            </Avatar>
                        </IconButton>
                )
                }
                {!comment.sender.admin && 
                        (
                            <IconButton style={{float: comment.sender._id === this.props.auth.user._id ? 'left' : 'right'}} onClick={()=>{ 
                                                                                                                                console.log('comment.sender._id', comment.sender._id)
                                                                                                                                console.log('this.props.auth.user._id', this.props.auth.user._id)
                                                                                                                                
                                                                                                                                }}>
                                <Avatar style={{color: '#fff',backgroundColor: deepOrange[500]}}>
                                {comment.sender.completename 
                                && comment.sender.completename.length
                                && comment.sender.completename.length > 0 ? 
                                comment.sender.completename.substring(0,1) : comment.sender.username.substring(0,1)}
                                </Avatar>
                            </IconButton>
                        )
                }
                <Card >
                    <CardContent>
                        <div><span style={{fontSize:11, float: 'left',marginRight:10}}>{comment.sender.completename}</span>   <span  style={{fontSize:10, float: 'left', color: 'gray'}}>{convertDate(comment.sentTime) }</span></div>
                        <Typography variant="body2"  component="p" style={{marginTop: 20}}>
                                {comment.message}
                        </Typography>
                    </CardContent>
                     </Card>
                </span>
                </ListItem>
            </Grow>
          </div>
        )
    }

    
    postMessage(){
        const comment = {
            message: this.state.message,
            file: this.props.file._id,
            sender: this.props.auth.user._id,
            receiver: this.props.auth.user._id === this.props.file.user._id ? this.props.file.admin._id : this.props.file.user._id,
        }
        this.setState({
            message: ''
        })
        axios.post(process.env.REACT_APP_API_HOST + '/api/comments/file/' + this.props.file._id, comment)
                .then(res => {
                    this.props.loadChatDialogExams(this.props.file._id)
                })
                .catch(err => {
                    alert('error')
                })
    }
    render() { 
        return (
            <Dialog
                fullScreen={false}
                fullWidth={true}
                maxWidth='lg'
                style={{ height: '90% !important' }}
                open={this.state.openDialog}
                scroll={this.state.scroll}
                onClose={this.handleClose}
                aria-labelledby="scroll-dialog-title"
            >
                <DialogTitle id="scroll-dialog-title">
                        Messagens do exame: {this.props.file.displayName} 
                    <IconButton edge="end" color="inherit" onClick={this.handleClose} aria-label="close" style={{float:'right'}}>
                    <CloseIcon />
                    </IconButton>
                </DialogTitle>
                    <DialogContent dividers={this.state.scroll === 'paper'} style={{background: '#eee'}}>
                        <DialogContentText style={{minHeight:320}}>
                        <List style={{width:'100%', minHeight: 310, margin:10,}}>
                                {this.props.comments.map(this.renderMessage)}
                                <div ref={this.messagesEndRef} />
                        </List>
                        
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{paddingLeft:25, paddingRight: 25, }}>
                                <TextField
                                    label="Faça sua pergunta..."
                                    multiline
                                    rowsMax="3"
                                    value={this.state.message}
                                    onChange={this.handleMessageChange}
                                    margin="normal"
                                    variant="outlined"
                                    fullWidth={true}
                                />
                                <IconButton edge="end" color="inherit" onClick={this.postMessage} style={{float: 'right'}}>
                                    <SendIcon />
                                </IconButton>
                    </DialogActions>
            </Dialog>
        );
    }
}
ChatDialog.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
}
function convertDate(date){
    return  Moment(date).format('DD/MM/YYYY hh:mm A')
    }
const mapStateToProps = (state) => {
    return {
        isFetching: state.chatDialog.isFetching,
        comments: state.chatDialog.data,
        error: state.chatDialog.error,
        auth: state.auth
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadChatDialogExams: (file_id) => dispatch(loadChatDialogRequest(file_id))
    }
} 
export default connect(mapStateToProps, mapDispatchToProps)(ChatDialog)



