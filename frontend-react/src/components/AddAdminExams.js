import React, { Component } from 'react';
import Upload from './Upload'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import "./css/AdminExams.css"
import Button from '@material-ui/core/Button'
import FormControl  from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from  '@material-ui/core/Select'
import CircularProgress from  '@material-ui/core/CircularProgress'
import MenuItem from  '@material-ui/core/MenuItem'
import { connect } from 'react-redux'
import { loadUsersRequest } from '../actions/actions'
import TextField from '@material-ui/core/TextField'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import InboxIcon from '@material-ui/icons/MoveToInbox'
import DraftsIcon from '@material-ui/icons/Drafts'
import SendIcon from '@material-ui/icons/Send'
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf'
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Typography from '@material-ui/core/Typography'
import FormHelperText from '@material-ui/core/FormHelperText'

class AddAdminExams extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: false,
            displayName : '',
            userId: 0,
            activeStep: 0,
            skipped: new Set(),
            steps : this.getSteps(),
            showStepper: true
        }
        
        this.handleSelectedUser = this.handleSelectedUser.bind(this)
        this.handleNext = this.handleNext.bind(this)
        this.handleBack = this.handleBack.bind(this)
        this.handleSkip = this.handleSkip.bind(this)
        this.handleReset = this.handleReset.bind(this)
        this.getStepContent = this.getStepContent.bind(this)
        this.handledisplayName = this.handledisplayName.bind(this)
        this.triggerUploadedFinished = this.triggerUploadedFinished.bind(this)
    }
    componentDidMount(){
        this.props.loadUsers()
        
    }
    handledisplayName(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    handleSelectedUser(e){
        if(e && e.target.value != 0){
            var userOk = ''
            this.props.users.map((user, index)=>{
                if(user._id === e.target.value) userOk = user
            })
            this.setState({
                userId: e.target.value,
                user: userOk
            })
        }else{
            this.setState({
                userNameSelected: false,
                userId: 0
            })
        }
        
    }
    
    getSteps() {
        return ['Seleciona Usuário', 'Nome para o arquivo', 'Upload arquivo'];
      }
    getStepContent(step) {
        switch (step) {
            case 0:
            return this.renderSelectUser();
            case 1:
            return this.renderdisplayName();
            case 2:
            return this.renderUploadFile();
            default:
            return 'Passo desconhecido, reiniciar pagina';
        }
    }
    renderSelectUser(){
        return (
            <Card style={{minHeight: 300}}
            alignitems="center"
                        justify="center">
                         {this.props.isFetchingUsers && (
                     <Grid
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        style={{marginTop: 30}}
                    >
                            <CircularProgress />
                        </Grid>
            )}
            { !this.props.isFetchingUsers && (
            <FormControl fullWidth={true} style={{padding: 50}}>
                    <Select
                    native
                    value={this.state.userId}
                    onChange={this.handleSelectedUser}
                    >
                    <option value={0} > Escolher Usuário </option>
                        {this.props.users.map( (user, index) => {
                            return (
                                <option key={user._id} value={user._id}>{user.completename} 
                                </option>
                            )
                        })}
                    </Select>
                    {this.state.errors && (<FormHelperText id="username-text" style={{color: 'red'}}>{this.state.errors}</FormHelperText>)}
                </FormControl>
                )} 
            </Card>
        )
    }
    renderdisplayName(){
        return (
            <Card style={{minHeight: 300}}>
            <FormControl fullWidth={true} style={{padding: 50}}>
                        <TextField
                            label="Nome para o Arquivo"
                            placeholder="Nome para o Arquivo"
                            helpertext="Se quiser manter o nome do arquivo original, pode clicar em Pular"
                            margin="normal"
                            name="displayName"
                            variant="outlined"
                            onChange={this.handledisplayName}
                        />
                        {this.state.errors && (<FormHelperText id="username-text" style={{color: 'red'}}>{this.state.errors}</FormHelperText>)}
                    </FormControl>
            </Card>
        )
    }
    renderUploadFile(){
        return (
            <Card >
                <Upload data={this.state} triggerUploadedFinished={this.triggerUploadedFinished}/>
            </Card>
        )
    }
    isStepOptional(step) {
        return step === 1;
    }
    isStepSkipped(step) {
        return this.state.skipped.has(step);
    }
    handleNext() {
        let newSkipped = this.state.skipped;
        if (this.isStepSkipped(this.state.activeStep)) {
            newSkipped = new Set(newSkipped.values());
            newSkipped.delete(this.state.activeStep);
        }
        
        if(this.state.activeStep === 0 && this.state.userId === 0){
            this.setState({
                errors: 'Por favor, escolha um usuário da lista'    
            })
        }
        else if(this.state.activeStep === 1 && this.state.displayName.length === 0){
            this.setState({
                errors: 'Por favor, se quiser manter o nome original clique em Pular'    
            })
        }
        else{
            this.setState({
                activeStep: this.state.activeStep + 1,
                errors: false,
                newSkipped
            })
        }
        
    }
    handleBack() {
        this.setState({
            activeStep: this.state.activeStep - 1
        })
    }
    handleSkip() {
        if (!this.isStepOptional(this.state.activeStep)) {
          // You probably want to guard against something like this,
          // it should never occur unless someone's actively trying to break something.
          throw new Error("Não pode pular este passo porque não é opcional.");
        }
    
        this.setState({
            activeStep: this.state.activeStep + 1,
            displayName: ''
        })
    
        const newSkipped = new Set( this.state.skipped.values());
        newSkipped.add(this.state.activeStep)
        this.setState({
            skipped: newSkipped
        })

      }
      handleReset() {
        this.setState({
            activeStep: 0
        })
      }
      triggerUploadedFinished(){
          this.setState({
              uploadFinished : true
          })
      }
    render() {
        return (
            <div style={{width: '80%',margin: 40, marginTop:100}}>
                { this.state.showStepper && 
                ( 
                    <div>
                    <Stepper activeStep={this.state.activeStep}>
                        {this.state.steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};
                        if (this.isStepOptional(index)) {
                            labelProps.optional = <Typography variant="caption" component="span">Opcional</Typography>;
                        }
                        if (this.isStepSkipped(index)) {
                            stepProps.completed = false;
                        }
                        return (
                            <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                        })}
                    </Stepper>
                    <div>
                        {this.state.activeStep === this.state.steps.length ? (
                        <div>
                            <Typography style={{marginTop: 3, marginBottom: 3,}}  component="span">
                            Upload realizado com sucesso!
                            </Typography>
                            <Button onClick={this.handleReset} style={{marginRight: 3}}  component="span">
                            Adicionar mais
                            </Button>
                        </div>
                        ) : (
                        <div>
                            <Typography  component="span" style={{marginTop: 3, marginBottom: 3,}}>{this.getStepContent(this.state.activeStep)}</Typography>
                            <div>
                            <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} style={{marginRight: 3}}>
                                Voltar
                            </Button>
                            {this.isStepOptional(this.state.activeStep) && (
                                <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleSkip}
                                style={{marginRight: 3}}
                                >
                                Pular
                                </Button>
                            )}

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={this.handleNext}
                                style={{marginRight: 3}}
                                disabled={this.state.activeStep === this.state.steps.length - 1 && !this.state.uploadFinished}
                            >
                                {this.state.activeStep === this.state.steps.length - 1 ? 'Finalizar' : 'Seguinte'}
                            </Button>
                            </div>
                        </div>
                    )}
                </div>
                </div>
          )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isFetchingUsers: state.users.isFetching,
        users: state.users.data,
        error: state.users.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadUsers: () => dispatch(loadUsersRequest())
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(AddAdminExams)