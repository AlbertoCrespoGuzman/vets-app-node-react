import React, { Component } from 'react';
import { loadProfileRequest } from '../actions/actions'
import { connect } from 'react-redux'
import Tooltip from '@material-ui/core/Tooltip'
import Box from '@material-ui/core/Box'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import MenuItem   from '@material-ui/core/MenuItem'
import Select   from '@material-ui/core/Select'
import FormControl   from '@material-ui/core/FormControl'
import InputLabel   from '@material-ui/core/InputLabel'
import Input   from '@material-ui/core/Input'
import FormHelperText   from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress' 
import AppBar from  '@material-ui/core/AppBar' 
import { minWidth } from '@material-ui/system';
import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

class Profile extends Component {
    
    constructor(props){
        
        super(props)
        this.state = {
            isEditing: false,
            tab: 0,
            errors: false,
            message: false,
            isSaving: false,
            password: '',
            confirmPassword: ''
        }
        
        this.handleTabsChange = this.handleTabsChange.bind(this)
        this.changeToEditProfile = this.changeToEditProfile.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.saveProfile = this.saveProfile.bind(this)
        this.postPassword = this.postPassword.bind(this)
        this.handleInputPasswordChange = this.handleInputPasswordChange.bind(this)
    }
    
    componentDidMount(){
        this.props.loadProfile()
    }
    postPassword(){
        if(!this.state.password || !this.state.confirmPassword){
            this.setState({
                errors: 'Por favor, escrever senha e confirmar a mesma'
            })
        }else if(this.state.password.length < 6){
            this.setState({
                errors: 'A senha deve ter minimo 6 carateres'
            })
        }else if(this.state.password != this.state.confirmPassword){
            this.setState({
                errors: 'A senhas não coincidem'
            })
        }else{
            this.setState({
                isSaving: true
            })
            axios.post(process.env.REACT_APP_API_HOST + '/api/users/reset_password', {password: this.state.password,
                                                     confirmPassword: this.state.confirmPassword})
                  .then(res => {
                        this.setState({
                            password: '',
                            confirmPassword: '',
                            isSaving: false,
                            message: 'Sua senha foi redefinida com sucesso'
                        })
                  })
                  .catch(err => {
                      if(err && err.response){
                          this.setState({
                              errors: JSON.stringify(err.response),
                              isSaving: false
                          })
                      }
                  })
        }
        
    }
    saveProfile(){
        this.setState({
            isSaving: true
        })
        axios.post(process.env.REACT_APP_API_HOST + '/api/users/me', this.props.profile)
            .then(res => {
                
                this.props.profile.address = res.data.address
                this.props.profile.cpf = res.data.cpf
                this.props.profile.completename = res.data.completename
                
                this.setState({
                    isSaving: false,
                    isEditing: false
                })
            })
            .catch(err => {
                this.setState({
                    errors: JSON.stringify(err.response)
                })
            })
    }
    handleInputChange(e) {
        const varName = e.target.name
        this.props.profile[varName] = e.target.value
        this.setState({})
    }
    handleInputPasswordChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSelectTypeChange(e){
        this.setState({
            type: e.target.value
        })
    }
    handleSubmitProfile(e) {
        e.preventDefault();
    }
    handleTabsChange(event, newValue){
        this.setState({
            tab: newValue
        })
    }
    changeToEditProfile(){
        this.setState({
            isEditing : true
        })
    }
    render() {
        return (
            <div style={{marginTop:120, marginLeft:80, width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignContent:'center'}}>
               <Typography>
                   Meu Perfil
               </Typography>
               
               <Paper style={{marginTop:10, width: '70%'}}>
                    <Tabs 
                    value={this.state.tab} onChange={this.handleTabsChange} aria-label="Meu Perfil">
                    <Tab label="Detalhes Conta" {...a11yProps(0)} />
                    <Tab label="Modificar Senha" {...a11yProps(1)} />
                    </Tabs>
                <TabPanel value={this.state.tab} index={0}>
                {!this.props.isFetching &&(
                        <form onSubmit={ this.handleSubmitProfile }>
                            <FormControl className={classes.formControl} fullWidth={true} >
                                <InputLabel htmlFor="type-error">Tipo de Usuário</InputLabel>
                                <Select
                                value={this.props.profile.type}
                                onChange={this.handleSelectTypeChange}
                                name="type"
                                disabled={true}
                                >
                                    <MenuItem value={0}>
                                        <em>Escolha tipo de usuário</em>
                                    </MenuItem>
                                    <MenuItem value={1}>Cliente</MenuItem>
                                    <MenuItem value={2}>Clínica</MenuItem>
                                    <MenuItem value={3}>Veterinário</MenuItem>
                                    <MenuItem value={4}>Administrador</MenuItem>
                                </Select>
                                
                            </FormControl>
                                <FormControl className={classes.formControl} fullWidth={true} margin={PropTypes.margin}>
                                    <InputLabel htmlFor="username">E-mail</InputLabel>
                                    <Input
                                    type="text"
                                    id="username"
                                    name="username"
                                    onChange={this.handleInputChange}
                                    aria-describedby="username-text"
                                    value={ this.props.profile.username }
                                    disabled={true}
                                    />
                                    
                                </FormControl>
                                <FormControl className={classes.formControl} fullWidth={true} >
                                    <InputLabel htmlFor="completename">Nome Completo</InputLabel>
                                    <Input
                                    type="text"
                                    id="completename"
                                    name="completename"
                                    onChange={this.handleInputChange}
                                    aria-describedby="completename-text"
                                    value={ this.props.profile.completename }
                                    disabled={!this.state.isEditing}
                                    />
                                    {this.props.error.completename && (<FormHelperText id="completename-text">{this.props.error.completename}</FormHelperText>)}
                                </FormControl>
                                <FormControl className={classes.formControl} fullWidth={true} >
                                    <InputLabel htmlFor="cpf">CPF/CNPJ</InputLabel>
                                    <Input
                                    type="text"
                                    id="cpf"
                                    name="cpf"
                                    aria-describedby="cpf-text"
                                    onChange={ this.handleInputChange }
                                    value={ this.props.profile.cpf }
                                    disabled={!this.state.isEditing}
                                    />
                                    {this.props.error.cpf && (<FormHelperText id="cpf-text">{this.props.error.cpf}</FormHelperText>)}
                                </FormControl>
                                <FormControl className={classes.formControl} fullWidth={true} >
                                    <InputLabel htmlFor="address">Endereço</InputLabel>
                                    <Input
                                    type="text"
                                    id="address"
                                    name="address"
                                    aria-describedby="address-text"
                                    onChange={ this.handleInputChange }
                                    value={ this.props.profile.address }
                                    disabled={!this.state.isEditing}
                                    />
                                    {this.props.error.address && (<FormHelperText id="address-text">{this.props.error.address}</FormHelperText>)}
                                </FormControl>
                                {!this.props.profile.vet && (
                                    <FormControl className={classes.formControl} fullWidth={true} >
                                        <InputLabel htmlFor="address">Endereço</InputLabel>
                                        <Input
                                        type="text"
                                        id="address"
                                        name="address"
                                        aria-describedby="address-text"
                                        onChange={ this.handleInputChange }
                                        value={ this.props.profile.address }
                                        disabled={!this.state.isEditing}
                                        />
                                        {this.props.error.address && (<FormHelperText id="address-text">{this.props.error.address}</FormHelperText>)}
                                    </FormControl>
                                )}
                                { (this.props.profile.vet || this.props.profile.clinic) && (
                                
                                    <FormControl className={classes.formControl} fullWidth={true} >
                                        <InputLabel htmlFor="cmrv">CMRV</InputLabel>
                                        <Input
                                        type="text"
                                        id="cmrv"
                                        name="cmrv"
                                        aria-describedby="cmrv-text"
                                        onChange={ this.handleInputChange }
                                        value={ this.props.profile.cmrv }
                                        disabled={!this.state.isEditing}
                                        />
                                        {this.props.error.cmrv && (<FormHelperText id="cmrv-text">{this.props.error.cmrv}</FormHelperText>)}
                                    </FormControl>
                                )}
                                {this.props.profile.clinic && (
                                    <FormControl className={classes.formControl} fullWidth={true} >
                                        <InputLabel htmlFor="technicalSupport">Responsável Técnico</InputLabel>
                                        <Input
                                        type="text"
                                        id="technicalSupport"
                                        name="technicalSupport"
                                        aria-describedby="technicalSupport-text"
                                        onChange={ this.handleInputChange }
                                        value={ this.props.profile.address }
                                        disabled={!this.state.isEditing}
                                        />
                                        {this.props.error.technicalSupport && (<FormHelperText id="address-text">{this.props.error.technicalSupport}</FormHelperText>)}
                                    </FormControl>
                                )}
                            <CardActions>
                                {!this.state.isSaving && !this.state.isEditing && 
                                    (<Button 
                                        onClick={this.changeToEditProfile}
                                        fullWidth={true} variant="outlined" color="primary" type="submit" >
                                        Modificar Perfil
                                </Button> )}
                                {!this.state.isSaving && this.state.isEditing &&
                                    (<Button 
                                        onClick={this.saveProfile}
                                        fullWidth={true} variant="contained" color="primary" type="submit" >
                                        Salvar
                                </Button> )}
                                
                                {this.state.isSaving && (
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
                            </CardActions>
                            </form>
                            )}
                </TabPanel>
                <TabPanel value={this.state.tab} index={1}>
                {!this.props.isFetching &&(
                        <form onSubmit={ this.handleSubmitProfile }>
                            
                                <FormControl className={classes.formControl} fullWidth={true} margin={PropTypes.margin}>
                                    <InputLabel htmlFor="password">Nova senha</InputLabel>
                                    <Input
                                    type="password"
                                    id="password"
                                    name="password"
                                    onChange={this.handleInputPasswordChange}
                                    aria-describedby="password-text"
                                    value={ this.state.password }
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl} fullWidth={true} margin={PropTypes.margin}>
                                    <InputLabel htmlFor="confirmPassword">Confirmar Nova senha</InputLabel>
                                    <Input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    onChange={this.handleInputPasswordChange}
                                    aria-describedby="confirmPassword-text"
                                    value={ this.state.confirmPassword }
                                    />
                                </FormControl>
                                {this.state.errors && (<FormHelperText id="password-text" style={{color: 'red'}}>{this.state.errors}</FormHelperText>)}
                                {this.state.message && (<FormHelperText id="password-text" style={{color: 'green'}}>{this.state.message}</FormHelperText>)}
                            <CardActions>
                                {!this.state.isSaving &&
                                    (<Button 
                                        onClick={this.postPassword}
                                        fullWidth={true} variant="contained" color="primary" type="submit" >
                                        Redefinir Senha
                                </Button> )}
                                
                                {this.state.isSaving && (
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
                            </CardActions>
                            </form>
                            )}
                </TabPanel>
                </Paper>
            </div>
        );
    }
}
const classes = {}
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <Typography
        component="div"
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <Box p={3}>{children}</Box>
      </Typography>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  
  

const mapStateToProps = (state) => {
    return {
        isFetching: state.profile.isFetching,
        profile: state.profile.data,
        error: state.profile.error
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        loadProfile: () => dispatch(loadProfileRequest())
    }
} 

export default connect(mapStateToProps, mapDispatchToProps)(Profile)