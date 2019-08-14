import React, { Component } from 'react'

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
import axios from  'axios'
import dotenv from 'dotenv'
dotenv.config()

export default class ResetPassword extends Component {
    constructor(props){
        super(props)
        this.state = {
            password: '',
            confirmPassword: '',
            message: false,
            errors: false,
            isFetching: false,
            passwordReseted: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }
    handleSubmit(e){
        e.preventDefault()
        if(this.state.password && this.state.password.length < 6){
            this.setState({
                errors: 'A senha deve ter mínimo 6 carateres'
            })
        }else if(this.state.password != this.state.confirmPassword){
            this.setState({
                erros: 'A senhas digitadas não coincidem'
            })
        }else{
                this.setState({
                    isFetching: true
                })
                var url = process.env.REACT_APP_API_HOST + '/api/users/reset_password/'
                if(this.props.location.search.split('=').length == 2){
                    url += 'token/' + this.props.location.search.split('=')[1]
                }
                axios.post(url, {password: this.state.password, 
                                    confirmPassword : this.state.confirmPassword })
                                    .then(res => {
                                        this.setState({
                                            message: res.data.msg,
                                            errors: false,
                                            isFetching: false,
                                            passwordReseted: true
                                        })
                                    })
                                    .catch(err => {
                                        this.setState({
                                            errors: JSON.stringify(err.response.data.msg),
                                            isFetching: false
                                        })
                                    })

        }
    }
    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    render() {
        return (
                <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justify="center"
                style={{ minHeight: '100vh' }}
            >
            
                <Grid item xs={6}>
                        <Card  style={{width: '100%'}}>
                        <CardContent>
                        <Typography 
                               color="textSecondary" gutterBottom>
                            Vets
                        </Typography>
                        <Typography 
                                variant="h5" component="h2">
                            Resetar Senha
                        </Typography>
                        <form onSubmit={ this.handleSubmit }>
                            <FormControl  fullWidth={true} >
                                <InputLabel htmlFor="password">Senha</InputLabel>
                                <Input
                                type="password"
                                id="password"
                                value={ this.state.password }
                                name="password"
                                onChange={this.handleInputChange}
                                aria-describedby="password-text"
                                onChange={ this.handleInputChange }
                                />
                                
                            </FormControl>
                            <FormControl  fullWidth={true} >
                                <InputLabel htmlFor="confirmPassword">Confirmar Senha</InputLabel>
                                <Input
                                type="password"
                                id="confirmPassword"
                                value={ this.state.confirmPassword }
                                name="confirmPassword"
                                onChange={this.handleInputChange}
                                aria-describedby="confirmPassword-text"
                                onChange={ this.handleInputChange }
                                />
                                {this.state.errors && (<FormHelperText id="confirmPassword-text" style={{color: 'red'}}>{this.state.errors}</FormHelperText>)}
                                {this.state.message && (<FormHelperText id="confirmPassword-text"  style={{color: 'green'}}>{this.state.message}</FormHelperText>)}
                            </FormControl>
                        <CardActions>
                           {this.state.isFetching && (
                            <Grid
                                container
                                spacing={0}
                                direction="column"
                                alignItems="center"
                                justify="center"
                                style={{marginTop: 30}}
                               fullWidth={true}
                            >
                                    <CircularProgress />
                                </Grid>
                           )}
                           {!this.state.isFetching && (
                            <Button fullWidth={true} 
                                    variant="contained" color="primary" type="submit"
                                     disabled={this.state.passwordReseted}>
                                    Redefinir Senha
                            </Button>
                            )}
                        </CardActions>
                        </form>
                        </CardContent>
                        
                    </Card>
                </Grid>      
            </Grid>
        );
    }
}