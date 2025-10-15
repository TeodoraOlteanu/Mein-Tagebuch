import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link for routing

function ABCModel() {
    const [formData, setFormData] = useState({
        name: '',
        activating_event: '',
        beliefs: '',
        consequences: '',
        disputation: '',
        new_beliefs: ''
    });
    const [abcList, setAbcList] = useState([]);  // State to store the list of ABCs

    useEffect(() => {
        const fetchAbcs = async () => {
            const token = localStorage.getItem('token');  // Retrieve the token from local storage
            try {
                const response = await axios.get('http://localhost:3001/abc', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAbcList(response.data);  // Set fetched data to state
            } catch (error) {
                console.error('Failed to fetch ABCs:', error.response ? error.response.data : 'No response');
            }
        };

        fetchAbcs();  // Fetch ABCs on component mount
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');  // Retrieve the token from local storage
        try {
            const response = await axios.post('http://localhost:3001/abc', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Form submitted successfully:', response.data);
            setAbcList([...abcList, response.data]);  // Add the new ABC to the list

            // Optionally clear form or handle next steps
        } catch (error) {
            console.error('Failed to submit form:', error.response ? error.response.data : 'No response');
        }
    };


    return (
        <div>
        <form onSubmit={handleSubmit}>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
            <input type="text" name="activating_event" value={formData.activating_event} onChange={handleChange} placeholder="Activating Event" />
            <input type="text" name="beliefs" value={formData.beliefs} onChange={handleChange} placeholder="Beliefs" />
            <input type="text" name="consequences" value={formData.consequences} onChange={handleChange} placeholder="Consequences" />
            <input type="text" name="disputation" value={formData.disputation} onChange={handleChange} placeholder="Disputation" />
            <input type="text" name="new_beliefs" value={formData.new_beliefs} onChange={handleChange} placeholder="New Beliefs" />
            <button type="submit">Submit</button>
        </form>
        <div>
        <h2>My ABC Entries</h2>
        <ul>
            {abcList.map(abc => (
                <li key={abc._id}>
                    <Link to={`/abc/${abc._id}`}>{abc.name}</Link>
                </li>
            ))}
        </ul>
    </div>
    </div>
    );
}

export default ABCModel;
