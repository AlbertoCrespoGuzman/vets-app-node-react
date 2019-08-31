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
            message: '',
            noReadMessageTag: false,
            noReadSendToServer: false,
            maxChatRefresh: 10,
            refreshIntervalTime: 15000,
            chatRefreshInterval: false,
            currentChatRefresh: 0
        }
        this.renderMessage = this.renderMessage.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.handleMessageChange = this.handleMessageChange.bind(this)
        this.postMessage = this.postMessage.bind(this)
        this.getMessages = this.getMessages.bind(this)
        this.messagesEndRef = React.createRef() 
        this.messagesNoReadRef = React.createRef() 
        this.messagesList = React.createRef()
    }
    
    componentDidMount(){
            this.props.loadChatDialogExams(this.props.file._id)
    }
    componentDidUpdate() {
        if(this.messagesNoReadRef && this.messagesNoReadRef.current){
            if(document.getElementById('messages-container')){
                document.getElementById('messages-container').addEventListener('scroll', this.trackScrolling, false)
                this.messagesNoReadRef.current.scrollIntoView({behavior: 'smooth'})
                if(this.props && this.props.comments && this.props.comments && this.props.comments.length < 4 
                    && !this.state.noReadSendToServer){
                    this.postMessagesRead()
                }
            }
            
        }else{
            if(this.messagesEndRef && this.messagesEndRef.current)
            this.messagesEndRef.current.scrollIntoView({behavior: 'smooth'})
        }
        if(!this.state.chatRefreshInterval){
            this.state.chatRefreshInterval = setInterval(this.getMessages, this.state.refreshIntervalTime);
        }
      }
      getMessages(){
          console.log('getMessages!')
        axios.get(process.env.REACT_APP_API_HOST + '/api/comments/file/' + this.props.file._id)
        .then((data) => {
            var comments = data.data
            if(comments && comments.length > this.props.comments.length){
                var commentsToAdd = []
                comments.forEach(comment => {
                    var exists = false
                    this.props.comments.forEach(commentProp => {
                        if(comment._id === commentProp._id) exists = true
                    })
                    if(!exists) commentsToAdd.push(comment)
                })
                commentsToAdd.forEach(comment => {
                    this.props.comments.push(comment)
                })
                
                this.state.noReadMessageTag = false
                this.state.noReadSendToServer = false
            }
            this.setState({
                currentChatRefresh: this.state.currentChatRefresh ++
            })
            if(this.state.currentChatRefresh >= this.state.maxChatRefresh){
                clearInterval(this.state.chatRefreshInterval)
                this.setState({
                    chatRefreshInterval: false
                })
                console.log('clearInterval because -> this.state.currentChatRefresh >= this.state.maxChatRefresh')
            }
        })
        .catch((error) => {
            clearInterval(this.state.chatRefreshInterval)
            this.setState({
                chatRefreshInterval: false
            })
            console.log('clearInterval because ERROR', JSON.stringify(error))
        })
      }
    componentWillReceiveProps(newProps){
        /*
        setTimeout(()=> {
            console.log("document.getElementById('messages-container')",document.getElementById('messages-container'))
            if(this.messagesNoReadRef && this.messagesNoReadRef.current){
                if(document.getElementById('messages-container')){
                    document.getElementById('messages-container').addEventListener('scroll', this.trackScrolling, false)
                }
                
            }else{
                if(this.messagesEndRef && this.messagesEndRef.current)
                this.messagesEndRef.current.scrollIntoView({behavior: 'smooth'})
            }
            
        }, 1500)
        */
    }
    isBottom(element) {
        if(element){
            console.log( 'element.clientHeight', element.clientHeight)
            console.log( 'element.scrollHeight - element.scrollTop', element.scrollHeight - element.scrollTop)
            return Math.abs((element.scrollHeight - element.scrollTop)  - element.clientHeight) < 60;
        }else{
            console.log('in the scrolling element doesnt exist !!!!!!!')
        }
      }
      
      componentWillUnmount() {
          if(document.getElementById('messages-container')){
            document.getElementById('messages-container').removeEventListener('scroll', this.trackScrolling);
          }
          clearInterval(this.state.chatRefreshInterval)
            this.setState({
                chatRefreshInterval: false
            })
            console.log('clearInterval because UNMOUNT')
      }
      
      trackScrolling = () => {
        const wrappedElement = document.getElementById('messages-container');
        console.log('scrooling')
        if (this.isBottom(wrappedElement)) {
            if(this.state.noReadMessageTag && !this.state.noReadSendToServer) this.postMessagesRead()

            if(document.getElementById('messages-container')){
                document.getElementById('messages-container').addEventListener('scroll', this.trackScrolling, false)
            }
        }
    }
    handleClose(){
        this.setState({
            openDialog: false,
            noReadMessageTag: false
        })
        this.props.removeDialog()
    }
    handleMessageChange(e){
        this.setState({
            message: e.target.value
        })
    }
    postMessagesRead(){
        console.log('postMessagesRead')
        axios.patch(process.env.REACT_APP_API_HOST + '/api/comments/read/file/' + this.props.file._id, {})
                .then(file => {
                    this.setState({
                        noReadSendToServer: true
                    })
                    if(file && file.data){
                        this.props.updateFile(file.data)
                    }
                    
                })
                .catch(err => {
                    console.log('error trying to update as read messages')
                })
    }
    renderMessage(comment, index){
        const { classes } = this.props
        console.log(comment == null)
        return (

          <div key={comment._id}  >
          {!this.state.noReadMessageTag && !comment.read && comment.sender._id != this.props.auth.user._id && (
              <ListItem  style={{width: '100%'}} ref={this.messagesNoReadRef}>
              <Card style={{marginLeft: 'auto', marginRight: 'auto', background: blue[10]}}>
                      <span style={{fontSize: 10, marginTop: -5, marginLeft:5, marginRight: 5}}>Mensagens não lidas</span>
                  
              </Card>
              </ListItem>
          )}
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
                <Card style={{background: comment.sender.admin ? blue[50] : 'white'}}>
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
            {!this.state.noReadMessageTag && !comment.read && comment.sender._id != this.props.auth.user._id && (this.state.noReadMessageTag = true)}
          </div>
        )
    }

    
    postMessage(){
        if(this.state.message && this.state.message.length > 0){
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
                    <DialogContent dividers={this.state.scroll === 'paper'} style={{background: '#eee'}} id="messages-container">
                        <List style={{width:'100%', minHeight: 310, margin:10,}} ref={this.messagesList}>
                                {(this.state.noReadMessageTag = false)}
                                {this.props.comments && this.props.comments.length > 0 && this.props.comments.map(this.renderMessage) }
                                <ListItem ref={this.messagesEndRef} onBlur={()=>{ console.log('focused')}}/>
                        </List>
                        
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