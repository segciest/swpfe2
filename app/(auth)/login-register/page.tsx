'use client';
import { useState } from 'react';
import './loginRegister.scss';
import SignUpPage from '@/components/SignUpPage/SignUpPage';
import SignInPage from '@/components/SignInPage/SignInPage';

export default function LoginRegister() {
    const [isActive, setIsActive] = useState<boolean>(false);

    return (
        <div className="body">
            <div className={`containerLayout ${isActive ? 'active' : ''}`}>
                <SignUpPage />
                <SignInPage />
                <div className="toggleContainer">
                    <div className="toggle">
                        <div className="togglePannel toggleLeft">
                            <h1>Welcome Back!</h1>
                            <p className="font-thin">Login to use all of site features</p>
                            <button className="hiddenBtn" onClick={() => setIsActive(false)}>
                                Sign In
                            </button>
                        </div>
                        <div className="togglePannel toggleRight">
                            <h1>Hello!</h1>
                            <p className="font-thin">Register to use all of site features</p>
                            <button className="hiddenBtn" onClick={() => setIsActive(true)}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
