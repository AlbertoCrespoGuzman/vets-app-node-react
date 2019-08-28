import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { registerUser } from '../actions/authentication'
import { makeStyles } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/styles'
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
            crmv: '',
            technicalSupport: '',
            phone: '',
    //        password: '',
    //        confirmPassword: '',
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
            phone: this.state.phone,
            crmv: this.state.crmv,
            technicalSupport: this.state.technicalSupport
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
        const classes = styles()
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
                        {errors.type && (<FormHelperText id="type-text" style={{color: 'red'}}>{errors.type}</FormHelperText>)}
                    </FormControl>
                        <FormControl className={classes.formControl} fullWidth={true} margin={PropTypes.margin}>
                            <InputLabel htmlFor="username">E-mail</InputLabel>
                            <Input
                            type="text"
                            id="username"
                            value={ this.state.username }
                            name="username"
                            onChange={this.handleInputChange}
                            aria-describedby="username-text"
                            value={ this.state.username }
                            />
                            {errors.username && (<FormHelperText id="username-text" style={{color: 'red'}}>{errors.username}</FormHelperText>)}
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
                            value={ this.state.completename }
                            />
                            {errors.completename && (<FormHelperText id="completename-text" style={{color: 'red'}}>{errors.completename}</FormHelperText>)}
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
                            value={ this.state.cpf }
                            />
                            {errors.cpf && (<FormHelperText id="cpf-text" style={{color: 'red'}}>{errors.cpf}</FormHelperText>)}
                        </FormControl>
                        {this.state.type != 3 && (
                            <FormControl className={classes.formControl} fullWidth={true} >
                                <InputLabel htmlFor="address">Endereço</InputLabel>
                                <Input
                                type="text"
                                id="address"
                                value={ this.state.address }
                                name="address"
                                onChange={this.handleInputChange}
                                aria-describedby="address-text"
                                value={ this.state.address }
                                />
                                {errors.address && (<FormHelperText id="address-text" style={{color: 'red'}}>{errors.address}</FormHelperText>)}
                            </FormControl>
                        )
                        }
                        <FormControl className={classes.formControl} fullWidth={true} >
                            <InputLabel htmlFor="phone">Telephone de Contato</InputLabel>
                            <Input
                            type="text"
                            id="phone"
                            value={ this.state.phone }
                            name="phone"
                            onChange={this.handleInputChange}
                            aria-describedby="phone-text"
                            value={ this.state.phone }
                            />
                            {errors.phone && (<FormHelperText id="phone-text" style={{color: 'red'}}>{errors.phone}</FormHelperText>)}
                        </FormControl>
                        {(this.state.type == 2 || this.state.type == 3)  && (
                        <FormControl className={classes.formControl} fullWidth={true} >
                            <InputLabel htmlFor="crmv">CRMV</InputLabel>
                            <Input
                            type="text"
                            id="crmv"
                            value={ this.state.crmv }
                            name="crmv"
                            onChange={this.handleInputChange}
                            aria-describedby="crmv-text"
                            value={ this.state.crmv }
                            />
                            {errors.crmv && (<FormHelperText id="crmv-text" style={{color: 'red'}}>{errors.crmv}</FormHelperText>)}
                        </FormControl>
                        )}
                        {this.state.type == 2 && (
                            <FormControl className={classes.formControl} fullWidth={true} >
                                <InputLabel htmlFor="technicalSupport">Responsável Tecnico</InputLabel>
                                <Input
                                type="text"
                                id="technicalSupport"
                                value={ this.state.technicalSupport }
                                name="technicalSupport"
                                onChange={this.handleInputChange}
                                aria-describedby="technicalSupport-text"
                                value={ this.state.technicalSupport }
                                />
                                {errors.technicalSupport && (<FormHelperText id="technicalSupport-text" style={{color: 'red'}}>{errors.technicalSupport}</FormHelperText>)}
                            </FormControl>
                        )}
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

const styles = theme => ({
    button: {
    //  margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
    formControl:{
        marginTop:200
    }
  })
Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps,{ registerUser })(withRouter(Register), withStyles(styles))