'use client';
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { saveToken } from '@/utils/auth';

interface LoginForm {
    email: string;
    password: string;
}

export default function SignInPage() {
    const router = useRouter();
    const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [remember, setRemember] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            saveToken(data.token, remember);
            const stored = { token: data.token, userId: data.userId };
            localStorage.setItem('userData', JSON.stringify(stored));

            setMessage('Login successful!');
            router.push('/');
            window.dispatchEvent(new Event('storage'));
        } catch (err: any) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="formContainer signIn">
            <form onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                <div className="formIcon">
                    <a><i className="fa-brands fa-square-facebook" /></a>
                    <a><i className="fa-brands fa-twitter" /></a>
                    <a><i className="fa-brands fa-google-plus-g" /></a>
                    <a><i className="fa-brands fa-linkedin" /></a>
                    <a><i className="fa-brands fa-github" /></a>
                </div>
                <span>or use your email password</span>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />

                <label className="flex items-center gap-2 mt-3 text-sm">
                    <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span>Remember me</span>
                </label>

                <button type="submit" className="btn" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                </button>

                {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
            </form>
        </div>
    );
}
