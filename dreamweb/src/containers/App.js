import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Components
import CardList from '../components/CardList/CardList';
import ErrorBoundary from '../components/ErrorBoundary';
import Header from '../components/Header/Header';
import UserSelectDropdown from '../components/UserSelectDropdown/UserSelectDropdown';
import DiscordCallbackHandler from '../components/DiscordCallbackHandler';
import LandingPage from '../components/LandingPage/LandingPage';
import ValidateSession from '../components/ValidateSession';

class App extends Component {
    // Constructor to initialize the state and methods
    constructor() {
        super()
        this.state = {
            data: [], // holds all data fetched from the api
            filteredData: [], // holds the data filtered by the search field
            searchfield: '', // holds current value of the search field
            user: null, // null when no user is logged in, and holds user data when a user is logged in.
            selectedUser: '' // holds the id of the user selected from the dropdown
        }
    }

    // sets user data for the session
    setUser = (userData) => {
        console.log("Setting user data", userData)
        this.setState({ user: userData });
    }

    // handles the user selection from the dropdown
    handleUserChange = (event) => {
        console.log("User selection changed")
        const selectedUserId = event.target.value;

        this.setState({ selectedUser: selectedUserId }, () => {
            this.filterData();
        });
    }
    
    // TODO: Move this to a separate component (see FetchImages.js)
    // Only call it when grid is actually going to show
    // Fetch default image grid data from the api
    fetchData = () => {
        console.log('Fetching data')
        axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/data`)
        .then(response => {
            // console.log('Data fetched', response.data)
            // sort data by timestamp
            const sortedData = response.data.sort((a, b) => {
                const dateA = new Date(a.dream.timestamp);
                const dateB = new Date(b.dream.timestamp);
                return dateB - dateA; // This will sort in descending order (newest first)
            });
            
            // update the state with the sorted data
            this.setState({ data: sortedData, filteredData: sortedData });
        })
        .catch(error => {
            console.error("Error fetching the data", error);
        });
    }

    // Update the filtered data based on the search field and selected user
    filterData = () => {
        console.log('Filtering data')
        const { data, selectedUser, searchfield } = this.state;

        let filtered = data;

        // First, filter by selected user
        if (selectedUser) {
            filtered = filtered.filter(entry => entry.user.id === selectedUser);
        }

        // Then filter by search field
        if (searchfield) {
            filtered = filtered.filter(entry => {
                // searching in the prompt field
                return entry.dream.prompt.toLowerCase().includes(searchfield);
            })
        }
    
        this.setState({ filteredData: filtered });
    }
    

    // updates list of images to display based on search field contents
    onSearchChange = (event) => {
        console.log('Search field changed')
        const searchValue = event.target.value.toLowerCase();
        this.setState({ searchfield: searchValue }, () => {
            this.filterData();
        });
    }      

    // lifecycle method called once the component is mounted into the DOM
    componentDidMount() {
        console.log('Component did mount')
        this.fetchData()
    //     this.interval = setInterval(this.fetchData, 800000);
    //     does user have an active session when app loads
    }

        // lifecycle method called just before the component is removed from the DOM
    // componentWillUnmount() {
        // clear the data-fetching interval to prevent memory leaks
        // clearInterval(this.interval);
    // }

    // display the component on the screen
    render() {
        console.log('Rendering App component')
        const { filteredData, user, selectedUser } = this.state;

        // get list of potential image submitters to filter grid by
        const uniqueUsers = Array.from(
            this.state.data.reduce((map, item) => map.set(item.user.id, item.user), new Map()).values()
        );

        // const { user } = this.state;
        // console.log(`Rendering App component with user`)
        // display loading message if data is not yet fetched
        // TODO: move this to only show when for grid-display pages, not base level app render
        if (!filteredData.length && !this.state.searchfield) {
            return <h1 className='tc'>Loading</h1>;
        }
        // main component display
        return (
            <div className='tc'>
            <Router>
                {/* Validate the user session */}
                {/* <ValidateSession setUser={this.setUser} /> */}
                <Header 
                    searchChange={this.onSearchChange} 
                    user={user} 
                    setUser={this.setUser} 
                    uniqueUsers={uniqueUsers}
                    selectedUser={selectedUser}
                    handleUserChange={this.handleUserChange}
                    />
                <Routes>
                    {/* Route for the landing page */}
                    <Route path="/" element={
                        <div>
                        {filteredData.length 
                            ? <ErrorBoundary>
                                <CardList data={filteredData} openModal={this.openModal}/></ErrorBoundary> 
                            : <h3>No results found</h3>}
                        </div>
                    } />
                    {/* Route for the login page */}
                    {/* <Route path="/login" element={<LandingPage user={user} setUser={this.setUser} />} /> */}
                    {/* <Route path="/login" element={<h1>Login</h1>} /> */}
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