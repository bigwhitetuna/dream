import React, { Component } from 'react';
import axios from 'axios';
import throttle from 'lodash/throttle';
import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import ErrorBoundary from '../components/ErrorBoundary';
import './App.css';

class App extends Component {
    // Constructor to initialize the state and methods
    constructor() {
        super()
        this.state = {
            data: [], // holds all data fetched from the api
            filteredData: [], // holds the data filtered by the search field
            searchfield: '' // holds current value of the search field
        }
        // Throttle the search function to only execute once every X milliseconds
        this.onSearchChange = throttle(this.onSearchChange.bind(this), 300);
    }

    // Fetch data from the api
    fetchData = () => {
        axios.get('http://127.0.0.1:8000/api/data')
        .then(response => {
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

    // whenever search field changes, update the state with the new value
    onSearchChange = (event) => {
        const searchValue = event.target.value.toLowerCase();
        const filtered = this.state.data.filter(entry => entry[5].toLowerCase().includes(searchValue));
        this.setState({ searchfield: searchValue, filteredData: filtered });
    }

    // lifecycle method called once the component is mounted into the DOM
    componentDidMount() {
        this.fetchData()
        this.interval = setInterval(this.fetchData, 300000);
    }

        // lifecycle method called just before the component is removed from the DOM
    componentWillUnmount() {
        // clear the data-fetching interval to prevent memory leaks
        clearInterval(this.interval);
    }

    // display the component on the screen
    render() {
        const { filteredData } = this.state;
        
        // display loading message if data is not yet fetched
        if (!filteredData.length && !this.state.searchfield) {
            return <h1 className='tc'>Loading</h1>;
        }
        
        // main component display
        return (
            <div className='tc'>
                <div className='header flex justify-between items-center pa3'>
                    <h1 className='f1 ma0'>DreamBot</h1>
                    <div className='search-container'>
                        <SearchBox searchChange={this.onSearchChange}/>
                    </div>
                </div>
            <div> 
                <ErrorBoundary>
                    {filteredData.length 
                        ? <CardList data={filteredData} /> 
                        : <h3>No results found</h3>}
                </ErrorBoundary>
            </div>
            </div>
        );
    }
}

export default App