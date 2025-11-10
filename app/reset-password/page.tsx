'use client';

import React, { useState } from 'react';
import EmailForm from './EmailForm';
import OtpForm from './OtpForm';
import ResetForm from './ResetForm';

export default function ResetPasswordPage() {
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-6 space-y-4">
                <h1 className="text-xl font-semibold text-center mb-4">
                    {step === 1 && '🔐 Quên mật khẩu'}
                    {step === 2 && '📩 Xác minh OTP'}
                    {step === 3 && '🔑 Đặt lại mật khẩu'}
                    {step === 4 && '✅ Hoàn tất'}
                </h1>

                {message && (
                    <div className="p-2 text-sm text-center bg-blue-50 text-blue-600 rounded-md">
                        {message}
                    </div>
                )}

                {step === 1 && <EmailForm setStep={setStep} setMessage={setMessage} />}
                {step === 2 && <OtpForm setStep={setStep} setMessage={setMessage} />}
                {step === 3 && <ResetForm setStep={setStep} setMessage={setMessage} />}
                {step === 4 && (
                    <div className="text-center text-green-600 font-semibold">
                        🎉 Mật khẩu đã được đặt lại thành công!
                    </div>
                )}
            </div>
        </div>
    );
}
