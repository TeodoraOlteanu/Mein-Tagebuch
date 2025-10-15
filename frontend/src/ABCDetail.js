import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function ABCDetail() {
    const { abcId } = useParams();
    const navigate = useNavigate();
    const [abc, setAbc] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        activating_event: '',
        beliefs: '',
        consequences: '',
        disputation: '',
        new_beliefs: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAbcDetail = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:3001/abc/${abcId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAbc(response.data);
                setFormData(response.data);
            } catch (error) {
                console.error('Error fetching ABC details:', error);
            }
        };

        fetchAbcDetail();
    }, [abcId]);

    const downloadPDF = () => {
        const input = document.getElementById('abc-detail');
        if (!input) {
            console.error('No element found with ID "abc-detail"');
            return;
        }

        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                pdf.addImage(imgData, 'JPEG', 0, 0);
                pdf.save(`${abc.name}.pdf`);
            })
            .catch((error) => console.error('Error generating PDF:', error));
    };

    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3001/abc/${abcId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('ABC model deleted successfully');
            navigate('/'); // Redirect to home or another page
        } catch (error) {
            console.error('Error deleting ABC model:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const response = await axios.put(`http://localhost:3001/abc/${abcId}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAbc(response.data);
            alert('ABC model updated successfully');
        } catch (error) {
            console.error('Error updating ABC model:', error);
            setError(error.response ? error.response.data : 'Failed to update');
        }
    };

    if (!abc) return <div>Loading...</div>;

    return (
        <div>
            <div id="abc-detail">
                <h1>{abc.name}</h1>
                <p>Activating Event: {abc.activating_event}</p>
                <p>Beliefs: {abc.beliefs}</p>
                <p>Consequences: {abc.consequences}</p>
                <p>Disputation: {abc.disputation}</p>
                <p>New Beliefs: {abc.new_beliefs}</p>
            </div>
            <button onClick={downloadPDF}>Download as PDF</button>
            <button onClick={handleDelete} style={{ marginLeft: '10px', color: 'red' }}>Delete ABC</button>

            <h2>Edit ABC Model</h2>
            <form onSubmit={handleUpdate}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" required />
                <input type="text" name="activating_event" value={formData.activating_event} onChange={handleChange} placeholder="Activating Event" />
                <input type="text" name="beliefs" value={formData.beliefs} onChange={handleChange} placeholder="Beliefs" />
                <input type="text" name="consequences" value={formData.consequences} onChange={handleChange} placeholder="Consequences" />
                <input type="text" name="disputation" value={formData.disputation} onChange={handleChange} placeholder="Disputation" />
                <input type="text" name="new_beliefs" value={formData.new_beliefs} onChange={handleChange} placeholder="New Beliefs" />
                <button type="submit">Update ABC</button>
            </form>
        </div>
    );
}

export default ABCDetail;
