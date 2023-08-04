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
            population: "",
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
            this.setState({forecast: res.data.forecast, exchangerate: res.data.exchangerate, population: res.data.population, gdp: res.data.gdp})
        })
        .catch(error => {
            notify("Sorry! We could'nt find any results at the moment");
            //notify(error.response.data.message);
        });

        this.setState({loading: false});
    }

    render(){
        const {loading} = this.state;
        const {forecast} = this.state;
        const {exchangerate} = this.state;
        const {population} = this.state;
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
                                                <fieldset> 
                                                    <div class="w-50">
                                                        <label htmlFor="search" className="block text-sm font-medium leading-6 text-gray-900">
                                                            Search for destination city
                                                        </label>
                                                        <div className="relative mt-2 flex items-center">
                                                            <label for="search" class="mb-2 text-sm font-medium text-gray-900 sr-only">Search</label>
                                                            <div class="relative w-50">
                                                                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                                    <svg class="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                                                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                                                    </svg>
                                                                </div>
                                                                <input type="search" id="search" placeholder="Berlin" class="block w-full p-6 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" required/>
                                                                {!loading && (
                                                                    <button type="submit" class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
                                                                        Search
                                                                    </button>
                                                                )}
                                                                {loading && (
                                                                    <button disabled class="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2">
                                                                        <i className="fas fa-spinner fa-spin"></i> Processing...
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </fieldset>
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
                                                        <div className="font-medium text-gray-900">{population}</div>
                                                    </dd>
                                                </div>
                                                <div className="flex justify-between gap-x-4 py-3">
                                                    <dt className="text-gray-500">GDP</dt>
                                                    <dd className="flex items-start gap-x-2">
                                                        <div className="font-medium text-gray-900">{gdp}</div>
                                                    </dd>
                                                </div>       
                                            </div>
                                        </div>
                                    </div>
                                    <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8 w-90">
                                        <li key="exc" className="overflow-hidden rounded-xl border border-gray-200 w-90">
                                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6 w-90">
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