import React, { Component } from 'react';

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
        return (
            <div>
                <div  style={{backgroundColor: 'yellow',minHeight:500 , marginTop:100}}>
                    Home Component 
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