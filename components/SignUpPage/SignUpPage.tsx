'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface RegisterForm {
    userName: string;
    userEmail: string;
    userPassword: string;
    phone: string;
    dob: string;
}

export default function SignUpPage() {
    const router = useRouter();
    const [form, setForm] = useState<RegisterForm>({
        userName: '',
        userEmail: '',
        userPassword: '',
        phone: '',
        dob: '',
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('http://localhost:8080/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Registration failed');

            setMessage('Registration successful!');
            router.push('/login-register');
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="formContainer signUp">
            <form onSubmit={handleSubmit}>
                <h1>Create Account</h1>
                <div className="formIcon">
                    <a><i className="fa-brands fa-square-facebook" /></a>
                    <a><i className="fa-brands fa-twitter" /></a>
                    <a><i className="fa-brands fa-google-plus-g" /></a>
                    <a><i className="fa-brands fa-linkedin" /></a>
                    <a><i className="fa-brands fa-github" /></a>
                </div>
                <span>or use your email for registration</span>

                <input
                    type="text"
                    name="userName"
                    placeholder="Full name"
                    value={form.userName}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="userEmail"
                    placeholder="Email"
                    value={form.userEmail}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="userPassword"
                    placeholder="Password"
                    value={form.userPassword}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="phone"
                    placeholder="Phone number"
                    value={form.phone}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="dob"
                    placeholder="Date of birth"
                    value={form.dob}
                    onChange={handleChange}
                    required
                />

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>

                {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
            </form>
        </div>
    );
}
