import React, {Fragment,useState} from 'react';
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
import currency_exchange_svg from '../image/currency-exchange.svg'
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
            exchangerate: {},
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

        await axios.post(api_url+`calls`,data)
        .then(res => {
            console.log(res)
            this.setState({forecast: res.data.forecast, exchangerate: res.data.exchangerate, gdp: res.data.gdp})
        })
        .catch(error => {
            notify(error.response.data.message);
        });

        this.setState({loading: false});
    }

    render(){
        const {loading} = this.state;
        const {forecast} = this.state;
        const {exchangerate} = this.state;
        const {gdp} = this.state;
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
                                                                <fieldset> 
                                                                    <input type="text"  required="required"/>
                                                                    <div>
                                                                        <label htmlFor="search" className="block text-sm font-medium leading-6 text-gray-900">
                                                                            Quick search
                                                                        </label>
                                                                        <div className="relative mt-2 flex items-center">
                                                                            <input
                                                                                type="text"
                                                                                name="search"
                                                                                id="search"
                                                                                placeholder="Berlin"
                                                                                className="block w-full rounded-md border-0 py-1.5 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                            />
                                                                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                                                                                <kbd className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-400">
                                                                                    <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                                                    </svg>
                                                                                </kbd>
                                                                            </div>
                                                                        </div>
                                                                    </div>
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
                                            <h4>Destiny condition:</h4>
                                            <div id="form-submit">
                                                <div className="flex justify-between gap-x-4 py-3">
                                                    <dt className="text-gray-500">Forecast</dt>
                                                    <dd className="flex items-start gap-x-2">
                                                        <div className="font-medium text-gray-900">{forecast}</div>
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-x-4 py-3">
                                                    <dt className="text-gray-500">Population</dt>
                                                    <dd className="flex items-start gap-x-2">
                                                        <div className="font-medium text-gray-900">{gdb}</div>
                                                    </dd>
                                                </div>
                                                <div className="row">  
                                                    Forecast: {forecast}
                                                </div> 
                                                <div className="row">  
                                                    Population {gdp}
                                                </div>
                                                <div className="row">  
                                                    GDP {gdp}
                                                </div>            
                                            </div>
                                        </div>
                                    </div>
                                    <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
                                        <li key="exc" className="overflow-hidden rounded-xl border border-gray-200">
                                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                                                <img
                                                    src={currency_exchange_svg}
                                                    alt="exchangerate"
                                                    className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                                                />
                                                <div className="text-sm font-medium leading-6 text-gray-900">Exchange Rate</div>
                                            </div>
                                            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 overflow-y-auto h-60 w-96 overflow-x-auto">
                                                {Object.entries(exchangerate).map(([currency, rate]) => (
                                                    <div className="flex justify-between gap-x-4 py-3">
                                                        <dt className="text-gray-500">{currency}</dt>
                                                        <dd className="flex items-start gap-x-2">
                                                            <div className="font-medium text-gray-900">{rate}</div>
                                                        </dd>
                                                    </div>
                                                ))}
                                            </dl>
                                        </li>
                                    </ul>
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