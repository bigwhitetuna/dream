import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import throttle from 'lodash/throttle';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Components
import CardList from '../components/CardList';
import ErrorBoundary from '../components/ErrorBoundary';
import Header from '../components/Header';
import DiscordCallbackHandler from '../components/DiscordCallbackHandler';
import LandingPage from '../components/LandingPage';
import ValidateSession from '../components/ValidateSession';
import './App.css';

class App extends Component {
    // Constructor to initialize the state and methods
    constructor() {
        super()
        this.state = {
            data: [], // holds all data fetched from the api
            filteredData: [], // holds the data filtered by the search field
            searchfield: '', // holds current value of the search field
            user: null // null when no user is logged in, and holds user data when a user is logged in.
        }
        // Throttle the search function to only execute once every X milliseconds
        // this.onSearchChange = throttle(this.onSearchChange.bind(this), 300);
    }

    setUser = (userData) => {
        console.log("Setting user data", userData)
        this.setState({ user: userData });
    }

    // TODO: Move this to a separate component (see FetchImages.js)
    // Only call it when grid is actually going to show
    // Fetch default image grid data from the api
    // fetchData = () => {
    //     axios.get('http://127.0.0.1:8000/api/data')
    //     .then(response => {
    //         console.log('Data fetched', response.data)
    //         // sort data by timestamp
    //         const sortedData = response.data.sort((a, b) => {
    //             const dateA = new Date(a.dream.timestamp);
    //             const dateB = new Date(b.dream.timestamp);
    //             return dateB - dateA; // This will sort in descending order (newest first)
    //         });
            
    //         // update the state with the sorted data
    //         this.setState({ data: sortedData, filteredData: sortedData });
    //     })
    //     .catch(error => {
    //         console.error("Error fetching the data", error);
    //     });
    // }

    // whenever search field changes, update the state with the new value
    // onSearchChange = (event) => {
    //     const searchValue = event.target.value.toLowerCase();
    //     const filtered = this.state.data.filter(entry => entry[5].toLowerCase().includes(searchValue));
    //     this.setState({ searchfield: searchValue, filteredData: filtered });
    // }
    // lifecycle method called once the component is mounted into the DOM
    // componentDidMount() {
        // this.fetchData()
        // this.interval = setInterval(this.fetchData, 800000);
        // does user have an active session when app loads
    // }

        // lifecycle method called just before the component is removed from the DOM
    // componentWillUnmount() {
        // clear the data-fetching interval to prevent memory leaks
        // clearInterval(this.interval);
    // }

    // display the component on the screen
    render() {
        // const { filteredData, user } = this.state;
        const { user } = this.state;
        console.log(`Rendering App component with user`)
        // display loading message if data is not yet fetched
        // TODO: move this to only show when for grid-display pages, not base level app render
        // if (!filteredData.length && !this.state.searchfield) {
        //     return <h1 className='tc'>Loading</h1>;
        // }
        // main component display
        return (
            <div className='tc'>
            <Router>
                {/* Validate the user session */}
                <ValidateSession setUser={this.setUser} />
                {/* <Header searchChange={this.onSearchChange} user={user} setUser={this.setUser} /> */}
                <Routes>
                    {/* Route for the landing page */}
                    <Route path="/" element={<h1>Marketing page</h1>} />
                    {/* Route for the login page */}
                    {/* <Route path="/login" element={<LandingPage user={user} setUser={this.setUser} />} /> */}
                    <Route path="/login" element={<h1>Login</h1>} />
                    {/* Routes for logged in users */}
                    {/* <Route path="/grid" element={
                        <div>
                        {filteredData.length 
                            ? <ErrorBoundary>
                                <CardList data={filteredData} openModal={this.openModal}/></ErrorBoundary> 
                            : <h3>No results found</h3>}
                        </div>
                    } /> */}
                    {/* <Route path="/favorites" element={<h1>Favorites?</h1>} /> */}
                    {/* Handling routes */}
                    {/* <Route path="/auth/callback" element={<DiscordCallbackHandler setUser={this.setUser} />} /> */}
                    {/* <Route path="/unauthorized" element={<h1>You are not authorized to view this page</h1>} /> */}
                    {/* <Route path="/*" element={<h1>404: Page not found</h1>} /> */}
                </Routes>
            </Router>
            </div>
        );
    }
}

export default App