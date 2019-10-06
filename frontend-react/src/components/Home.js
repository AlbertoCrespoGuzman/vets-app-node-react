import React, { Component } from 'react';
import Slider from 'react-animated-slider';
import 'react-animated-slider/build/horizontal.css';
import './css/carousel.css'

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
                image: 'https://i.imgur.com/ZXBtVw7.jpg',
                user: 'Luan Gjokaj',
                userProfile: 'https://i.imgur.com/JSW6mEk.png'
            },
            {
                title: 'Tortor Dapibus Commodo Aenean Quam',
                description:
                'Nullam id dolor id nibh ultricies vehicula ut id elit. Cras mattis consectetur purus sit amet fermentum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Donec sed odio dui.',
                button: 'Discover',
                image: 'https://i.imgur.com/DCdBXcq.jpg',
                user: 'Erich Behrens',
                userProfile: 'https://i.imgur.com/0Clfnu7.png'
            },
            {
                title: 'Phasellus volutpat metus',
                description:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Duis mollis, est non commodo luctus, nisi erat porttitor ligula.',
                button: 'Buy now',
                image: 'https://i.imgur.com/DvmN8Hx.jpg',
                user: 'Bruno Vizovskyy',
                userProfile: 'https://i.imgur.com/4KeKvtH.png'
            }
        ];

        return (
            <div>
               <div  style={{backgroundColor: 'yellow', marginTop:90}}>
                    <Slider className="slider-wrapper" >
                            {content.map((item, index) => (
                                <div
                                    key={index}
                                    className="slider-content"
                                    style={{ background: `url('${item.image}') no-repeat center center` }}
                                >
                                    <div className="inner" style={{textAlign: 'right'}}>
                                        <div fontWeight='fontWeightLight' style={{fontWeight: '300 !important', fontSize: 50, lineHeight:0.7, color: 'white'}}>{item.title}</div>
                                        <div fontWeight='fontWeightMedium' style={{fontWeight: 'bold', fontSize: 50, color: 'white'}}>{item.description}</div>
                                        <button>{item.button} &nbsp;&nbsp;&nbsp; <i style={{fontWeight: 'light'}} class="fas fa-angle-right"></i></button>
                                    </div>
                                    
                                </div>
                            ))}
                        </Slider>
                </div>
                <div ref={this.aboutUsRef} style={{backgroundColor: 'green',minHeight:500 , marginTop:100}}>
                    this is about us
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