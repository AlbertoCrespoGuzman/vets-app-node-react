import React, { Component } from 'react';
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import './css/carousel.css'
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FindReplace from '@material-ui/icons/FindReplace'
import Pets from '@material-ui/icons/Pets'
import Done from '@material-ui/icons/Done'
import Visibility from '@material-ui/icons/Visibility'
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class Home extends Component {
    constructor(props){
        super(props)
        this.aboutUsRef = React.createRef()
        this.examsRef = React.createRef()
        this.partnersRef = React.createRef()
        this.contactRef = React.createRef()
        
        this.scrollIfNecessary =this.scrollIfNecessary.bind(this)
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
            <div>
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
                <Grid  xs={12} container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        style={{backgroundColor: '#0188FE'}}>
                   
                        <Grid xs={6}
                        justify="center"
                        alignItems="center" style={{padding:180, backgroundColor: '#FFFFFF'}}>
                                <img src='/img/logo_blue.png' height={150} style={{margin:0,
                                display: 'block',
                                maxWidth: '100%',
                                maxHeight: '100%'}} />
                        </Grid>
                        <Grid  xs={6} style={{backgroundColor: '#0188FE', 
                                display: 'block',
                                width: '100%',
                                height: '100%', paddingLeft:20, paddingRight:20}}>
                            
                                <div style={{backgroundColor: '#0188FE', 
                                display: 'block',
                                width: '100%',
                                height: '100%', textAlign:'center',marginTop:0,  fontSize: 20, color: 'white'}}>
                                <div style={{marginTop:20}}>
                                <span className="carousel-title" >SOBRE &nbsp;</span>
                                <span className="carousel-description" style={{marginBottom: 20}}><strong>NÓS</strong></span>
                                </div>
                                < br/>
                                    <div >
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
                        </Grid>
                </Grid>
                   </div>            
                <div  >
                <Grid  xs={12} container
                        direction="row"
                        justify="center"
                        alignItems="center"
                        style={{backgroundColor: '#FFFFFF'}}>
                       
                       <Grid xs={4}
                                justify="center"
                                alignItems="center" container style={{padding:70, backgroundColor: '#FFFFFF', color: '#0188FE'}}>
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
                                </Grid>
                                <Grid xs={4}
                                justify="center"
                                alignItems="center" container style={{padding:70, backgroundColor: '#FFFFFF', color: '#0188FE'}}>
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
                                </Grid>
                                <Grid xs={4}
                                justify="center"
                                alignItems="center" container style={{padding:70,paddingTop:40, backgroundColor: '#FFFFFF', color: '#0188FE'}}>
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
                                </Grid>
                                
                   </Grid>
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
                                <div className="col-md-3" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                        </div>
                        <div className="row" style={{marginTop: 20}}>
                                <div className="col-md-3" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3" >
                                    <div style={{textAlign:'center',backgroundColor: '#0188FE', borderRadius:90, padding:30, color: 'white'}}>
                                            Logo
                                    </div>
                                </div>
                                <div className="col-md-3" >
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
                                <div  className="col-md-12" style={{padding:50}}>
                                    <div style={{backgroundColor: 'white', borderRadius: 30, padding: 50, margin:100, marginTop:10}}>
                                        <input style={{width: '100%', marginBottom:20, borderRadius:30, borderWidth:7, borderColor: '#0188FE',padding:10 }} placeholder={'Nome completo'} />
                                        
                                        <input style={{width: '48%', marginBottom:20, marginRight:10, borderRadius:30, borderWidth:7, borderColor: '#0188FE',padding:10 }} placeholder={'(85) 9 9999-8888'} />
                                        <input style={{width: '50%', marginBottom:20, borderRadius:30, borderWidth:7, borderColor: '#0188FE',padding:10 }} placeholder={'a@a.com.br'} />

                                        <input style={{width: '100%', marginBottom:20, borderRadius:30, borderWidth:7, borderColor: '#0188FE',padding:10 }} placeholder={'Endereço completo (Rua, Número, Bairro)'} />
                                        <textarea rows={6} style={{width: '100%', marginBottom:20, borderRadius:30, borderWidth:7, borderColor: '#0188FE',padding:10 }} placeholder={'Mensagem'}>
                                        </textarea>
                                        <center><button onClick={()=> {console.log('sending') } } className="button">ENVIAR </button></center>
                                    </div>
                                </div>
                                
                        </div>
                </div>
                <div style={{backgroundColor: 'white'}}>
                    <div className="row" style={{color:  '#0188FE', fontSize:20, paddingTop:40,paddingBottom:40}}>
                           <div className="col-md-4">
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
                            <div class=" offset-md-1 col-md-4">
                                <div className="row">
                                    
                                    <div className="col-md-12">
                                        <div style={{fontSize:25, marginTop:50, marginBottom:20}}><strong>CONTATO</strong></div>
                                        <div style={{marginTop:10}}>+55 85 9999-9999</div>
                                        <div style={{marginTop:10}}>atendimento@parapeti.com</div>
                                        <div style={{marginTop:10}}>Rua xxxxx, 000 - Fortaleza, CE.</div>
                                        <div style={{marginTop:10}}>CEP: 00000-000</div>
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
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
