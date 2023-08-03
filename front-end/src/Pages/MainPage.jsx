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

const api_url = process.env.REACT_APP_API//env.REACT_APP_API

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
        const { value } = event.target;

        this.setState({ search: value });
    }
 
    handleSubmit = async event => {
        
        event.preventDefault();

        this.setState({loading: true});

        const data = {
            search: this.state.search,
        }

        await axios({
            method: 'post',
            url: api_url+`calls`,
            headers: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            withCredentials: true, 
            data: data
        })
        .then(res => {
            console.log("done")
            console.log(res)
            this.setState({forecast: res.data.forecast, loading: res.data.exchangerate, gdp: res.data.gdp})
        })
        .catch(error => {
            console.log(error)
            notify(error);
        });

        this.setState({loading: false});
    }

    render(){
        const {loading} = this.state;
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
                                        <h4>Choose Your Destination:</h4>
                                        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
                                            <form method="POST" onSubmit={this.handleSubmit} onChange={this.handleChange}>
                                                <div className="col-md-6">
                                                    <div className="city" id="city">
                                                        <div className="row" id="city">
                                                            <div className="col-md-4 col-sm-5 col-xs-6">
                                                                <label htmlFor="search">Search</label>
                                                                <fieldset> 
                                                                    <input type="text" placeholder="London" name="search" id="search" required="required"/>
                                                                    {!loading && (
                                                                        <button type="submit" id="form-submit" className="btn">
                                                                            Submit
                                                                        </button>
                                                                    )}
                                                                    {loading && (
                                                                        <button className="btn" disabled>
                                                                            <i className="fas fa-spinner fa-spin"></i> Processing...
                                                                        </button>
                                                                    )}
                                                                </fieldset>
                                                            </div>
                                                        </div>
                                                    </div>
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
                                                    Population
                                                </div>
                                                <div className="row">  
                                                    GDP
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