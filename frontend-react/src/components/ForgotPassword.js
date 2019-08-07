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

export default class ForgotPassword extends Component {
    constructor(props){
        super(props)
        this.state = {
            username: '',
            message: false,
            errors: false,
            isFetching: false,
            emailSent: false
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }
    handleSubmit(e){
        e.preventDefault()
        if(this.state.username && this.state.username.length > 4 
            && this.state.username.indexOf('@') != -1 && this.state.username.indexOf('.') != -1 ){
                this.setState({
                    isFetching: true
                })
                axios.post('/api/users/forgot', {username: this.state.username })
                        .then(res => {
                            this.setState({
                                message: res.data.msg,
                                errors: false,
                                isFetching: false,
                                emailSent: true
                            })
                        })
                        .catch(err => {
                            this.setState({
                                errors: err && err.response && err.response.data ? JSON.stringify(err.response.data.msg) : 'Erro desconhecido, tente mais tarde',
                                isFetching: false
                            })
                        })

        }else{
            this.setState({
                errors: 'email invalido',
                isFetching: false
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
                            Recuperar Senha
                        </Typography>
                        <form onSubmit={ this.handleSubmit }>
                            <FormControl  fullWidth={true} >
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
                                {this.state.errors && (<FormHelperText id="username-text" style={{color: 'red'}}>{this.state.errors}</FormHelperText>)}
                                {this.state.message && (<FormHelperText id="username-text"  style={{color: 'green'}}>{this.state.message}</FormHelperText>)}
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
                            <Button 
                            disabled={this.state.emailSent}
                            fullWidth={true} variant="contained" color="primary" type="submit" >
                                    Enviar E-mail de Recuperação de Senha
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