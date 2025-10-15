import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Login = () => {
    const [data, setData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', data);
            console.log('Login successful', response.data);
            if (response.data.token) {
                localStorage.setItem('token', response.data.token); // Save the token
            } else {
                console.error('Token not received');
            }
        } catch (error) {
            console.error('Login failed', error.response ? error.response.data : 'No server response');
        }
    };
    

    return (
        <><div>
            <form onSubmit={handleSubmit}>
                <h1>Login to Your Account</h1>
                <input
                    type="email"
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={data.email}
                    required />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    onChange={handleChange}
                    value={data.password}
                    required />
                {error && <div>{error}</div>}
                <button type="submit">
                    Sing In
                </button>
            </form>
        </div><div>
                <h1>New Here ?</h1>
                <Link to="/signup">
                    <button type="button">
                        Sing Up
                    </button>
                </Link>
            </div></>
    );
};

export default Login;
