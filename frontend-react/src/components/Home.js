import React, { Component } from 'react';
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import './css/carousel.css'
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress' 
import Paper from '@material-ui/core/Paper';
import FindReplace from '@material-ui/icons/FindReplace'
import Pets from '@material-ui/icons/Pets'
import Done from '@material-ui/icons/Done'
import Visibility from '@material-ui/icons/Visibility'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import axios from 'axios'
import dotenv from 'dotenv'
import {
    BrowserView,
    MobileView,
    isBrowser,
    isMobile
  } from "react-device-detect";

dotenv.config()


class Home extends Component {
    constructor(props){
        super(props)
        this.aboutUsRef = React.createRef()
        this.examsRef = React.createRef()
        this.partnersRef = React.createRef()
        this.contactRef = React.createRef()
        this.sendEmail = this.sendEmail.bind(this)
        this.scrollIfNecessary =this.scrollIfNecessary.bind(this)
        this.state = {
            isSending: false,
            sent: false,
            name: '',
            email: '',
            phone: '',
            address: '',
            message: '',
            errors: { }
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.sendEmail = this.sendEmail.bind(this)
    }
    
    componentDidMount(){
        if(this.props.auth){
            console.log(this.props.auth)
            if(this.props.auth.isAuthenticated) {
                if(this.props.auth.user.admin){
                    this.props.history.push('/users');
                }else{
                    this.props.history.push('/exams');
                }
                
            }
        }
        else{
            this.scrollIfNecessary()  
        }
    }
    componentDidUpdate(){
        this.scrollIfNecessary()
    }
    scrollIfNecessary(){
        if(window.location.href.includes('#about-us')){
            console.log('estoy dentro about us')
            this.aboutUsRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
        }else if(window.location.href.includes('#exams')){
            console.log('estoy dentro exams')
            this.examsRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
        }else if(window.location.href.includes('#contact')){
            console.log('estoy dentro contact')
            this.contactRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
        }
        else if(window.location.href.includes('#partners')){
            console.log('estoy dentro contact')
            this.partnersRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
        }
    }
    handleInputChange(e) {
        const varName = e.target.name
        
        this.setState({
            [varName]: e.target.value
        })
    }
    sendEmail(){
        console.log(this.state)
        let ok = true
        this.state.errors = {}

        if(!this.state.email 
            || this.state.email.length < 6 
            || !this.state.email.includes('@')
            || !this.state.email.includes('.')
            || this.state.email.includes(',')
            || this.state.email.includes('<')
            || this.state.email.includes('script')
            || this.state.email.includes('>')){
                ok = false
                this.state.errors['email'] = 'O email é incorreto'
            }
        if(!this.state.name 
            || this.state.name.length < 3 
            || this.state.name.includes(',')
            || this.state.name.includes('<')
            || this.state.name.includes('script')
            || this.state.name.includes('>')){
                ok = false
                this.state.errors['name'] = 'O nome é incorreto'
            }
        if(!this.state.phone 
            || this.state.phone.length < 3 
            || this.state.phone.includes(',')
            || this.state.phone.includes('<')
            || this.state.phone.includes('script')
            || this.state.phone.includes('>')){
                ok = false
                this.state.errors['phone'] = 'O telephone é incorreto'
            }
        if(!this.state.message 
            || this.state.message.length < 3 
            || this.state.message.includes('<')
            || this.state.message.includes('script')
            || this.state.message.includes('>')){
                ok = false
                this.state.errors['message'] = 'A mensagem é muito curta ou tem carateres não permitidos'
            }
        if(!this.state.address 
            || this.state.address.length < 3 
            || this.state.address.includes('<')
            || this.state.address.includes('script')
            || this.state.address.includes('>')){
                ok = false
                this.state.errors['address'] = 'O endereço é incorreto'
            }
        if(ok){
            this.setState({
                isSending: true
            })
            axios.post(process.env.REACT_APP_API_HOST + '/api/send_email/', 
                {   name: this.state.name,
                    email: this.state.email,
                    address: this.state.address,
                    phone: this.state.phone,
                    message: this.state.message
                })
                    .then(res => {
                        this.setState({
                            isSending: false,
                            sent: true
                        })
                    })
                    .catch(err => {
                        this.setState({
                            isSending: false
                        })
                    if(err && err.response){
                    this.setState({
                        errors: JSON.stringify(err.response),
                        isSending: false
                    })
                    }
                    })
        }else{
            this.setState({})
        }
    }
    render() {

        const content = [
            {
                title: 'CONSULTE',
                description:
                'SEU EXAME',
                button: 'CONSULTA',
                image: '/img/carousel1.jpg'
            },
            {
                title: 'CONSULTE',
                description:
                'SEU EXAME',
                button: 'CONSULTA',
                image: '/img/carousel2.jpg'
            }
        ];
        const content2 = [
            {
                title: 'EXAMES',
                description:
                'HEMATOLÓGICOS',
                button: 'AGENDAR',
                image: '/img/carousel2.jpg'
            }
        ];
        return (
            <div style={{width:'100%'}}>
               <div  style={{marginTop:90}}>
                    <Slider className="slider-wrapper" >
                            {content.map((item, index) => (
                                <div
                                    key={index}
                                    className="slider-content"
                                    style={{ background: `url('${item.image}') no-repeat center center` }}
                                >
                                    <div className="inner" style={{textAlign: 'right'}}>
                                        <div className="carousel-title" >{item.title}</div>
                                        <div className="carousel-description"><strong>{item.description}</strong></div>
                                        <a href="/login" className="button" >{item.button} &nbsp;&nbsp;&nbsp; <i style={{fontWeight: 'light'}} className="fas fa-angle-right"></i></a>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                </div>
                <div ref={this.aboutUsRef} style={{minHeight:400}}>
                <div  class="row"
                        style={{backgroundColor: '#0188FE'}}>
                   
                        <div 
                        className="col-md-6 col-lg-6 col-sm-12 col-xs-12"
                        style={isMobile ? 
                                {margin: 'auto',  backgroundColor: '#FFFFFF',minHeight:400} : {padding:180, backgroundColor: '#FFFFFF',minHeight:400}}>
                                <img src='/img/logo_blue.png' height={150} 
                                style={
                                    isMobile ?
                                    {margin:'auto', marginTop:110, display: 'block', maxWidth: '100%', maxHeight: '100%'}
                                   : {margin:0, display: 'block', maxWidth: '100%', maxHeight: '100%'}} />
                        </div>
                        <div  
                        className="col-md-6 col-lg-6 col-sm-12 col-xs-12"
                        style={{backgroundColor: '#0188FE', 
                                display: 'block',
                                width: '100%',
                                height: '100%', paddingLeft:20, paddingRight:20}}>
                            
                                <div style={{backgroundColor: '#0188FE', 
                                display: 'block',
                                width: '100%',
                                height: '100%', textAlign:'center',marginTop:0,  fontSize: 20, color: 'white'}}>
                                <div style={{marginTop:100}}>
                                <span className="carousel-title" >SOBRE &nbsp;</span>
                                <span className="carousel-description" style={{marginBottom: 20}}><strong>NÓS</strong></span>
                                </div>
                                < br/>
                                    <div style={isMobile ? {margin:40} : {margin:'auto'}}>
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation ullamco laboris nisi
                                        ut aliquip ex ea commodo consequat.
                                        Duis aute irure dolor in reprehenderit in
                                        voluptate velit esse cillum dolore eu
                                        fugiat nulla pariatur.
                                    </div>
                                </div>
                        </div>
                </div>
                   </div>            
                <div  >
                <div   className="row"
                        style={{backgroundColor: '#FFFFFF'}}>
                       
                       <div 
                       className="col-md-4 col-lg-4 col-sm-12 col-xs-12"
                       style={{padding:70, backgroundColor: '#FFFFFF', color: '#0188FE'}}>
                                <div class="row">
                                        <div className="col-md-2">
                                            <FindReplace   style={{fontSize:30, marginTop:5}}/>
                                        </div>
                                        <div className="col-md-10">
                                            <div style={{fontSize:30}}>
                                                MISSÃO
                                            </div>
                                          
                                        </div>
                                        <div className="offset-md-2 col-md-10">
                                                <div style={{color: 'black'}}>
                                                    Lorem ipsum dolor sit amet,
                                                    consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut
                                                    labore et dolore magna aliqua. Ut
                                                    enim ad minim veniam, quis
                                                    nostrud exercitation ullamco
                                                    laboris nisi ut aliquip
                                                    quis
                                                    nostrud exercitation ullamco
                                                    laboris nisi ut aliquip
                                                    quis
                                                    nostrud exercitation ullamco
                                                    laboris nisi ut aliquip</div>
                                                
                                        </div>
                                        </div>
                                </div>
                        <div
                        className="col-md-4 col-lg-4 col-sm-12 col-xs-12"
                        style={{padding:70, backgroundColor: '#FFFFFF', color: '#0188FE'}}>
                        <div class="row">
                                        <div className="col-md-2">
                                            <Visibility   style={{fontSize:30, marginTop:5}}/>
                                        </div>
                                        <div className="col-md-10">
                                            <div style={{fontSize:30}}>
                                                VISÃO
                                            </div>
                                          
                                        </div>
                                        <div className="offset-md-2 col-md-10">
                                                <div style={{color: 'black'}}>
                                                    Lorem ipsum dolor sit amet,
                                                    consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut
                                                    labore et dolore magna aliqua. Ut
                                                    enim ad minim veniam, quis
                                                    nostrud exercitation ullamco
                                                    laboris nisi ut aliquip
                                                    quis
                                                    nostrud exercitation ullamco
                                                    laboris nisi ut aliquip
                                                    quis
                                                    nostrud exercitation ullamco
                                                    laboris nisi ut aliquip</div>
                                                
                                        </div>
                                        </div>
                        </div>
                        <div 
                        className="col-md-4 col-lg-4 col-sm-12 col-xs-12"
                        style={{padding:70,backgroundColor: '#FFFFFF', color: '#0188FE'}}>
                                    <div class="row" >
                                        <div className="col-md-2">
                                            <Pets   style={{fontSize:30, marginTop:5}}/>
                                        </div>
                                        <div className="col-md-10">
                                            <div style={{fontSize:30}}>
                                                VALORES
                                            </div>
                                            
                                        </div>
                                        <div className="offset-md-2 col-md-10">
                                                <div><Done /> <span style={{color:'black'}} >Simplicidade</span></div>
                                                <div><Done /> <span style={{color:'black'}} >Tecnológica</span></div>
                                                <div><Done /> <span style={{color:'black'}} >Para Pessoas</span></div>
                                                <div><Done /> <span style={{color:'black'}} >Atenção aos dados</span></div>
                                                <div><Done /> <span style={{color:'black'}} >Data Driver</span></div>
                                                <div><Done /> <span style={{color:'black'}} >Beta Forever</span></div>
                                                <div><Done /> <span style={{color:'black'}} >Agilidade</span></div>
                                                
                                        </div>
                                    </div>
                        </div>
                                
                   </div>
                </div>
                <div ref={this.examsRef} >
                <Slider className="slider-wrapper" >
                            {content2.map((item, index) => (
                                <div
                                    key={index}
                                    className="slider-content"
                                    style={{ background: `url('${item.image}') no-repeat center center` }}
                                >
                                    <div className="inner" style={{textAlign: 'right'}}>
                                        <div className="carousel-title" >{item.title}</div>
                                        <div className="carousel-description"><strong>{item.description}</strong></div>
                                        <div className="offset-md-5 col-md-7">
                                        <div style={{color: 'white', fontSize:20,}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                                    sed do eiusmod tempor incididunt ut commodo
                                                    consequat. nulla pariatur.</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </Slider>
                </div>
                <div ref={this.partnersRef} style={{minHeight:500, width:'100%', padding: 40}}>
                        <div className="row" style={{width:'100%'}}>
                                <div className="col-md-12">
                                <center><h1 style={{margin:'auto', fontSize: 50, marginBottom: 40, color: '#0188FE'}}>PARCEIROS</h1></center>
                                </div>
                        </div>
                        <div className="row">
                                <div className="col-md-3 col-xs-12 col-sm-12" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3 col-xs-12 col-sm-12" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3 col-xs-12 col-sm-12" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3 col-xs-12 col-sm-12" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                        </div>
                        <div className="row" style={{marginTop: 20}}>
                                <div className="col-md-3  col-xs-12 col-sm-12" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3  col-xs-12 col-sm-12" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3  col-xs-12 col-sm-12" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3  col-xs-12 col-sm-12" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                        </div>
                </div>
                <div ref={this.contactRef} style={{minHeight:500, backgroundColor: '#0188FE'}}>
                
                        <div className="row" style={{width:'100%'}}>
                                <div className="col-md-12">
                                    <center><h1 style={{margin:'auto',marginTop: 60,  fontSize: 50, color: 'white'}}>CONTATO</h1></center>
                                </div>
                        </div>
                        <div className="row">
                                <div  className="col-md-12" style={isMobile ? {padding:0} : {padding:50}}>
                                    <div 
                                    style={isMobile ?
                                        {backgroundColor: 'white', borderRadius: 30, padding: 50, margin:40, marginTop:10}
                                        : {backgroundColor: 'white', borderRadius: 30, padding: 50, margin:100, marginTop:10}}>
                                        <input style={{width: '100%', marginBottom:20, borderRadius:30, borderWidth:7, borderColor: '#0188FE',padding:10 }} placeholder={'Nome completo'} id="name" name="name" value={this.state.name} onChange={this.handleInputChange}/>
                                        {this.state.errors && this.state.errors.name && (
                                            <p style={{color: 'red', marginLeft:5}}>
                                                {this.state.errors.name}
                                            </p>
                                            )}
                                            <div class="row">
                                                <div class="col-md-6 col-lg-6 col-sm-12">
                                                    <input style={{width: '100%', marginBottom:20, marginRight:10, borderRadius:30, borderWidth:7, borderColor: '#0188FE',padding:10 }} placeholder={'(85) 9 9999-8888'} id="phone" name="phone" value={this.state.phone} onChange={this.handleInputChange} />
                                                        {this.state.errors && this.state.errors.phone && (
                                                            <div style={{color: 'red', marginLeft:5, width: '48%'}}>
                                                                {this.state.errors.phone}
                                                            </div>
                                                            )}
                                                </div>
                                                <div class="col-md-6 col-lg-6 col-sm-12">
                                                <input style={{width: '100%', marginBottom:20, borderRadius:30, borderWidth:7, borderColor: '#0188FE',padding:10 }} placeholder={'a@a.com.br'}  id="email" name="email" value={this.state.email} onChange={this.handleInputChange}/>
                                                    {this.state.errors && this.state.errors.email && (
                                                        <span style={{color: 'red', marginLeft:5, width: '50%'}}>
                                                            {this.state.errors.email}
                                                        </span>
                                                        )}
                                                </div>
                                            </div>
                                        
                                        
                                        <input style={{width: '100%', marginBottom:20, borderRadius:30, borderWidth:7, borderColor: '#0188FE',padding:10 }} placeholder={'Endereço completo (Rua, Número, Bairro)'}  id="address" name="address" value={this.state.address} onChange={this.handleInputChange}/>
                                        {this.state.errors && this.state.errors.address && (
                                            <p style={{color: 'red', marginLeft:5}}>
                                                {this.state.errors.address}
                                            </p>
                                            )}
                                        <textarea rows={6} style={{width: '100%', marginBottom:20, borderRadius:30, borderWidth:7, borderColor: '#0188FE',padding:10 }} placeholder={'Mensagem'}  id="message" name="message" value={this.state.message} onChange={this.handleInputChange}>
                                        </textarea>
                                        {this.state.errors && this.state.errors.message && (
                                            <p style={{color: 'red', marginLeft:5}}>
                                                {this.state.errors.message}
                                            </p>
                                            )}
                                        <center>
                                            {!this.state.isSending && !this.state.sent && (
                                            <button onClick={()=> { this.sendEmail() } } className="button" disabled={this.state.sent}>ENVIAR </button>
                                            )}
                                            {this.state.isSending && (
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
                                            {!this.state.isSending && this.state.sent && (
                                            <p style={{color:'green'}}>Mensagem enviada com sucesso. Em breve entraremos em contato </p>
                                            )}
                                        </center>
                                    </div>
                                </div>
                                
                        </div>
                </div>
                <div style={{backgroundColor: 'white'}}>
                    <div className="row" 
                    style={isMobile ? 
                        {color:  '#0188FE',  marginLeft:50, fontSize:20, paddingTop:40,paddingBottom:40}
                        : {color:  '#0188FE',fontSize:20, paddingTop:40,paddingBottom:40}}>
                           <div className="col-md-4 col-sm-12 col-xs-12">
                                <div className="row">
                                    <div className="offset-md-2 col-md-8">
                                        <img src='/img/logo_blue.png'  height={100} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-2">
                                        <center>
                                        <div style={{height:'100%', width:5, backgroundColor: '#0188FE'}}>
                                        </div>
                                        </center>
                                    </div>
                                    <div className="col-md-10" style={{marginTop:20}}>
                                        <div>Conheça a Parapeti</div>
                                        <div>Como funcionam os exames?</div>
                                        <div>Nossos parceiros</div>
                                        <div>Consulte seu exame</div>
                                    </div>
                                </div>
                            </div>
                            <div class=" offset-md-1 col-md-4  col-sm-12 col-xs-12">
                                <div className="row">
                                    
                                    <div className="col-md-12">
                                        <div style={{fontSize:25, marginTop:50, marginBottom:20}}><strong>CONTATO</strong></div>
                                        <div style={{marginTop:10}}>+55 85 9999-9999</div>
                                        <div style={{marginTop:10}}>parapeticontato@gmail.com</div>
                                        <div style={{marginTop:10}}>Rua xxxxx, 000 - Fortaleza, CE.</div>
                                        <div style={{marginTop:10}}>CEP: 00000-000</div>
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3  col-sm-12 col-xs-12">
                                <div className="row">
                                    
                                    <div className="col-md-12">
                                        <div style={{fontSize:25, marginTop:50, marginBottom:20}}><strong>REDES SOCIAIS</strong></div>
                                        
                                        <div >
                                            <a href="#" style={{fontSize:40, marginRight:10}}><i class="fab fa-instagram"></i></a>
                                            <a href="#" style={{fontSize:40, marginRight:10}}><i class="fab fa-facebook-square"></i></a>
                                            <a href="#" style={{fontSize:40, marginRight:10}}><i class="fab fa-twitter"></i></a>
                                            <a href="#" style={{fontSize:40, marginRight:10}}><i class="fab fa-linkedin"></i></a>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                    </div>
                </div>
            </div>
        );
    }
    
}
Home.propTypes = {
        
    auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth
})

export  default connect(mapStateToProps)(Home)
