import React, { Component } from 'react';
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import './css/carousel.css'
import Link from '@material-ui/core/Link';

class Home extends Component {
    constructor(props){
        super(props)
        this.aboutUsRef = React.createRef()
        this.examsRef = React.createRef()
        this.contactRef = React.createRef()

        this.scrollIfNecessary =this.scrollIfNecessary.bind(this)
    }
    
    componentDidMount(){
        this.scrollIfNecessary()
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
                                        <div className="carousel-description">{item.description}</div>
                                        <a href="/login" className="button" >{item.button} &nbsp;&nbsp;&nbsp; <i style={{fontWeight: 'light'}} className="fas fa-angle-right"></i></a>
                                    </div>
                                    
                                </div>
                            ))}
                        </Slider>
                </div>
                <div ref={this.aboutUsRef} style={{backgroundColor: 'green',minHeight:500}}>
                   </div>            
                <div ref={this.examsRef} style={{backgroundColor: 'pink',minHeight:500 , marginTop:100}}>
                    this is Exams
                </div>
                <div ref={this.contactRef} style={{backgroundColor: 'orange',minHeight:500 , marginTop:100}}>
                    this is Contacts
                </div>
            </div>
        );
    }
    
}
export default Home