import { useState } from "react";
import axios from "axios";
//import styles from "./styles.module.css";

const Signup = () => {
	const [data, setData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
        confirmPassword: "",
	});
	const [error, setError] = useState("");
	const [msg, setMsg] = useState("");

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
        if (data.password !== data.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
		try {
			const url = "http://localhost:3001/signup";
			const { data: res } = await axios.post(url, data);
			setMsg(res.message);
            alert('Signup successful. Please check your email to activate your account: ' + res.message);
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
    <><div>
            <h1>Welcome Back</h1>
            <button onClick={handleSubmit}>Sign Up</button>
                <form onSubmit={handleSubmit}>
                    <h1>Create Account</h1>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <input
                        type="text"
                        placeholder="First Name"
                        name="firstName"
                        onChange={handleChange}
                        value={data.firstName}
                        required />
                    <input
                        type="text"
                        placeholder="Last Name"
                        name="lastName"
                        onChange={handleChange}
                        value={data.lastName}
                        required />
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
                    <input
                        type="password"
                        name="confirmPassword"
                        value={data.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        required
            />
                    {error && <div>{error}</div>}
                    {msg && <div>{msg}</div>}

                    <button type="submit">
                        Sing Up
                    </button>
                </form>
            </div></>
	);
};

export default Signup;