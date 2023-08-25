import { useEffect } from "react";
import axios from 'axios';

const FetchImages = ({ setState }) => {
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/data', { withCredentials: true })
        .then(response => {
            console.log('Data fetched', response.data)
            // sort data by timestamp
            const sortedData = response.data.sort((a, b) => {
                const dateA = new Date(a.dream.timestamp);
                const dateB = new Date(b.dream.timestamp);
                return dateB - dateA; // This will sort in descending order (newest first)
            });
            
            // update the state with the sorted data
            this.setState({ data: sortedData, filteredData: sortedData });
        }), [setState]
    }
}