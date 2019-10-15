import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication'
import { makeStyles } from '@material-ui/core/styles'
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
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ResetPassword from './ForgotPassword'

class Login extends Component {

    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            errors: {}
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault()
        console.log()
        const user = {
            username: this.state.username,
            password: this.state.password,
        }
        this.props.loginUser(user);
    }

    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
            this.props.history.push('/')
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    render() {
        

        const {errors} = this.state

    //    React.useEffect(() => {
    //        setLabelWidth(labelRef.current.offsetWidth)
    //      }, [])

        return(
            
                <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
            
                <Grid item xs={6}>
                        <Card className={classes.card}>
                        <CardContent>
                        <Typography 
                                className={classes.title} color="textSecondary" gutterBottom>
                            Parapeti
                        </Typography>
                        <Typography 
                                variant="h5" component="h2">
                            Login
                        </Typography>
                        <form onSubmit={ this.handleSubmit }>
                            <FormControl className={classes.formControl} fullWidth={true} >
                                <InputLabel htmlFor="username">E-mail</InputLabel>
                                <Input
                                type="username"
                                id="username"
                                value={ this.state.username }
                                name="username"
                                onChange={this.handleInputChange}
                                aria-describedby="username-text"
                                onChange={ this.handleInputChange }
                                value={ this.state.username }
                                />
                                {errors.username && (<FormHelperText id="username-text" style={{color: 'red'}}>{errors.username}</FormHelperText>)}
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
                                {errors.password && (<FormHelperText id="password-text" style={{color: 'red'}}>{errors.password}</FormHelperText>)}
                            </FormControl>
                            
                            
                        <CardActions>
                            <Button fullWidth={true} variant="contained" color="primary" type="submit" >
                                Login
                            </Button>
                        </CardActions>
                        </form>
                        </CardContent>
                        <CardActions>
                                <Link component={ AdapterLink } to="/forgot_password">
                                    Esqueceu sua senha?
                                </Link>
                        </CardActions>

                    </Card>
                </Grid>      
            </Grid>
        )
    }
}
const AdapterLink = React.forwardRef((props, ref) => <RouterLink innerRef={ref} {...props} />);

const classes = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
      },
      formControl: {
        margin: theme.spacing(1),
        width: '100%'
      },
    card: {
        minWidth: 275,
        maxWidth:400
      },
    button: {
      margin: theme.spacing(1),
      width: '100%'
    },
    input: {
      display: 'none',
      width: '100%'
    },
    title: {
        alignItems: "center",
        justify: "center"
    }
  }))

//  const [labelWidth, setLabelWidth] = React.useState(0)
//  const [name, setName] = React.useState('Composed TextField')
// /  const labelRef = React.useRef(null)
  
Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { loginUser })(Login)