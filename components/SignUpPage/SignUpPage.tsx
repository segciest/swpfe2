'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebook,
    faTwitter,
    faGooglePlusG,
    faLinkedin,
    faGithub,
} from "@fortawesome/free-brands-svg-icons";

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
            // const [year, month, day] = form.dob.split("-");
            // const formattedDob = `${day}-${month}-${year}`;

            // const payload = { ...form, dob: formattedDob };
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
                    <a><FontAwesomeIcon icon={faFacebook} /></a>
                    <a><FontAwesomeIcon icon={faTwitter} /></a>
                    <a><FontAwesomeIcon icon={faGooglePlusG} /></a>
                    <a><FontAwesomeIcon icon={faLinkedin} /></a>
                    <a><FontAwesomeIcon icon={faGithub} /></a>
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
                {/* <input
                    type="text"
                    name="dob"
                    placeholder="Date of birth"
                    value={form.dob}
                    onChange={handleChange}
                    required
                /> */}
                <label style={{ width: '100%' }}>
                    <span style={{ display: 'block', fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                        Date of Birth
                    </span>
                    <input
                        type="date"
                        name="dob"
                        value={form.dob}
                        onChange={handleChange}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '5px',
                            border: '1px solid #ccc',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#333',
                        }}
                    />
                </label>


                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Signing up...' : 'Sign Up'}
                </button>

                {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
            </form>
        </div>
    );
}
