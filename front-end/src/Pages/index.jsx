import React from 'react';
import '../css/style_login.css';//
import bg from '../image/logo.svg';
import rw from '../image/rw.jpg';
import Login from '../components/Login.jsx'
import SignUp from '../components/SignUp.jsx';

export default class index extends React.Component{
    
    constructor(props){
        super(props);
        this.state = {
            isCorrect: false
        };
        this.handleSucessfulAuth = this.handleSucessfulAuth.bind(this)
    }

    handleSucessfulAuth(a)
    {   this.props.history.push("/")
    }

    render(){
        return( 
            <div className="contain">
                <img className="rw" src={rw} alt="rw"/>
                <div className="img">
                    <img src={bg} alt="bg"/>
                </div>
                
                <input type="radio" id="showNovaConta" name="group"/>
                <input type="radio" id="showLogin" name="group"/>

                <Login handleSucessfulAuth={this.handleSucessfulAuth}/>
                <SignUp />
                
            </div>
        );
    }
}