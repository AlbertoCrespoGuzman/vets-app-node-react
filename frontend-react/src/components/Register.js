import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { registerUser } from '../actions/authentication'
import { makeStyles } from '@material-ui/core/styles'

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

class Register extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            type: 0,
            completename: '',
            cpf: '',
            address: '',
            password: '',
            confirmPassword: '',
            errors: {},
            isFetching: false
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleSelectTypeChange = this.handleSelectTypeChange.bind(this)
    }
    
    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSelectTypeChange(e){
        console.log('e ', e)
        this.setState({
            type: e.target.value
        })
    }
    handleSubmit(e) {
        e.preventDefault();
        const user = {
            username: this.state.username,
            type: this.state.type,
            completename: this.state.completename,
            cpf: this.state.cpf,
            address: this.state.address,
            password: this.state.password,
            confirmPassword: this.state.confirmPassword
        }
        this.setState({
            isFetching: true
        })
        this.props.registerUser(user, this.props.history);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
    //        this.props.history.push('/')
        }
        this.setState({
            isFetching: false
        })
        if(nextProps.errors) {
            var errors = nextProps.errors.errors
            console.log(errors)
            var errorsToSend = {

            }
            if(errors && errors.length){
                for(var i=0;i<errors.length;i++){
                    console.log(errors[i].param)
                    if(errors[i].param === 'username'){
                        errorsToSend.username = errors[i].msg
                    }else if(errors[i].param === 'password'){
                        errorsToSend.password = errors[i].msg
                    }
                    else if(errors[i].param === 'confirmPassword'){
                        errorsToSend.confirmPassword = errors[i].msg
                    }
                    else if(errors[i].param === 'type'){
                        errorsToSend.type = errors[i].msg
                    }
                }
                console.log(errorsToSend)
                this.setState({
                    errors: errorsToSend
                })
            }
        }
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated && !this.props.auth.user.admin) {
            this.props.history.push('/');
        }
    }
    
    render() {
        
        
        const { errors } = this.state

  //      React.useEffect(() => {
  //          setLabelWidth(labelRef.current.offsetWidth)
  //        }, [])


        return(
            <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
            style={{ minHeight: '100vh', marginTop: 50 }}
           >
          
            <Grid item xs={5}>
                    <Card className={classes.card}>
                    <CardContent>
                    <Typography 
                            variant="h5" component="h2">
                        Casdastrar novo usuário

                    </Typography>
                    <form onSubmit={ this.handleSubmit }>
                    <FormControl className={classes.formControl} fullWidth={true} >
                        <InputLabel htmlFor="type-error">Tipo de Usuário</InputLabel>
                        <Select
                        value={this.state.type}
                        onChange={this.handleSelectTypeChange}
                        name="type"
                        
                        >
                        <MenuItem value={0}>
                            <em>Escolha tipo de usuário</em>
                        </MenuItem>
                        <MenuItem value={1}>Cliente</MenuItem>
                        <MenuItem value={2}>Clínica</MenuItem>
                        <MenuItem value={3}>Veterinário</MenuItem>
                        <MenuItem value={4}>Administrador</MenuItem>
                        </Select>
                        {errors.type && (<FormHelperText id="type-text">{errors.type}</FormHelperText>)}
                    </FormControl>
                        <FormControl className={classes.formControl} fullWidth={true} >
                            <InputLabel htmlFor="username">E-mail</InputLabel>
                            <Input
                            type="text"
                            id="username"
                            value={ this.state.username }
                            name="username"
                            onChange={this.handleInputChange}
                            aria-describedby="username-text"
                            onChange={ this.handleInputChange }
                            value={ this.state.username }
                            />
                            {errors.username && (<FormHelperText id="username-text">{errors.username}</FormHelperText>)}
                        </FormControl>
                        <FormControl className={classes.formControl} fullWidth={true} >
                            <InputLabel htmlFor="completename">Nome Completo</InputLabel>
                            <Input
                            type="text"
                            id="completename"
                            value={ this.state.completename }
                            name="completename"
                            onChange={this.handleInputChange}
                            aria-describedby="completename-text"
                            onChange={ this.handleInputChange }
                            value={ this.state.completename }
                            />
                            {errors.completename && (<FormHelperText id="completename-text">{errors.completename}</FormHelperText>)}
                        </FormControl>
                        <FormControl className={classes.formControl} fullWidth={true} >
                            <InputLabel htmlFor="cpf">CPF/CNPJ</InputLabel>
                            <Input
                            type="text"
                            id="cpf"
                            value={ this.state.cpf }
                            name="cpf"
                            onChange={this.handleInputChange}
                            aria-describedby="cpf-text"
                            onChange={ this.handleInputChange }
                            value={ this.state.cpf }
                            />
                            {errors.cpf && (<FormHelperText id="cpf-text">{errors.cpf}</FormHelperText>)}
                        </FormControl>
                        <FormControl className={classes.formControl} fullWidth={true} >
                            <InputLabel htmlFor="address">Endereço</InputLabel>
                            <Input
                            type="text"
                            id="address"
                            value={ this.state.address }
                            name="address"
                            onChange={this.handleInputChange}
                            aria-describedby="address-text"
                            onChange={ this.handleInputChange }
                            value={ this.state.address }
                            />
                            {errors.address && (<FormHelperText id="address-text">{errors.address}</FormHelperText>)}
                        </FormControl>
                        <FormControl  fullWidth={true} className={classes.formControl} >
                            <InputLabel htmlFor="password">Senha</InputLabel>
                            <Input
                            type="password"
                            id="password"
                            value={ this.state.password }
                            name="password"
                            onChange={this.handleInputChange}
                            aria-describedby="password-text"
                            onChange={ this.handleInputChange }
                            value={ this.state.password }
                            />
                            {errors.password && (<FormHelperText id="password-text">{errors.password}</FormHelperText>)}
                        </FormControl>
                        <FormControl  fullWidth={true} className={classes.formControl} >
                            <InputLabel htmlFor="confirmPassword">Confirmar Senha</InputLabel>
                            <Input
                            type="password"
                            id="confirmPassword"
                            value={ this.state.confirmPassword }
                            name="confirmPassword"
                            onChange={this.handleInputChange}
                            aria-describedby="confirmPassword-text"
                            onChange={ this.handleInputChange }
                            value={ this.state.confirmPassword }
                            />
                            {errors.confirmPassword && (<FormHelperText id="confirmPassword-text">{errors.confirmPassword}</FormHelperText>)}
                        </FormControl>
                        
                    <CardActions>
                        {!this.state.isFetching && (<Button fullWidth={true} variant="contained" color="primary" type="submit" >
                            Cadastrar
                        </Button> )}
                        {this.state.isFetching && (
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
                    </CardContent>
                </Card>
            </Grid>      
          </Grid>
        )
    }
}

const classes = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
    formControl:{
        marginTop:20
    }
  }))
Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps,{ registerUser })(withRouter(Register))