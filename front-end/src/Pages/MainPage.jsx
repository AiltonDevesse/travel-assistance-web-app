import React, {useState} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NavBar from '../components/NavBar.jsx';
import Map from '../components/Map.jsx'
import Footer from '../components/Footer.jsx'

import '../css/bootstrap.min.a.css' //
import '../css/bootstrap-theme.min.css'
import '../css/fontAwesome.css'
import '../css/hero-slider.css'
import '../css/owl-carousel.css'
import '../css/tooplate-style.css'
import plane from '../image/airplane_red.png'
import env from "react-dotenv";

const api_url = env.REACT_APP_API

toast.configure()

const notify = (message) => {
    toast(message)
}
    
export default class MainPage extends React.Component{

    constructor(props){
        super(props);
        
        this.state = {
            search: "",
            loading: false,
            forecast: "",
            exchangerate: "",
            gdp: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target;

        this.setState({ [name]: value }, () => console.log(this.state));
    }
 
    handleSubmit = async event => {
        
        event.preventDefault();

        this.setLoading({loading: true});

        const data = {
            token: localStorage.getItem('token'),    
            search: this.state.search,
        }

        console.log(data)

        await axios.post(api_url+`calls`, data)
            .then(res => {
                console.log("done")
                console.log(res)
                this.setState({forecast: res.data.forecast, loading: res.data.exchangerate, gdp: res.data.gdp})
            })
            .catch(errors => {
                console.log(errors)
                notify(errors.data.message);
            });

        this.setLoading({loading: false});
    }

    render(){
        return( 
            <div>
                <NavBar />
                <section className="banner" id="top">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-5">
                                <div className="left-side">
                                    <div className="logo">
                                        <img src={plane}/>
                                    </div>
                                    <div className="tabs-content">
                                        <h4>Choose Your Direction:</h4>
                                        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                            <form onSubmit={this.handleSubmit} >
                                                <div className="col-md-6">
                                                    <div className="radio-select" id="trips">
                                                        <div className="row" id="trips">
                                                            <div className="col-md-4 col-sm-5 col-xs-6">
                                                                <label htmlFor="round">Search</label>
                                                                <input type="text" name="search" id="search" value="" required="required"onChange={this.handleChange}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-12">    
                                                    <fieldset> 
                                                        <label htmlFor="card">Credit Card:</label>                           
                                                        {!this.state.loading && (
                                                            <button type="submit" id="form-submit" className="btn">
                                                                Submit
                                                            </button>
                                                        )}
                                                        {this.state.loading && (
                                                            <button className="btn" disabled>
                                                                <i className="fas fa-spinner fa-spin"></i> Processing...
                                                            </button>
                                                        )}
                                                    </fieldset>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5 col-md-offset-1">
                                <section id="first-tab-group" className="tabgroup">
                                    <div id="tab1">
                                        <div className="submit-form">
                                            <h4>Check availability for <em>direction</em>:</h4>
                                            <div id="form-submit">
                                                <div className="row">  
                                                    Forecast:
                                                </div> 
                                                <div className="row">
                                                    Exchange rate:
                                                </div>
                                                <div className="row">  
                                                    dgggg
                                                </div>            
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="contact-us">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="section-heading">
                                    <h2>World Map</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Map />
                <Footer />
            </div>
        )
    }
}