'use client';

import { useState } from 'react';
import NameInput from './auth/NameInput';
import PhoneInput from './auth/PhoneInput';
import OTPVerification from './auth/OTPVerification';

type AuthStep = 'name' | 'phone' | 'otp';

export default function AuthFlow() {
  const [step, setStep] = useState<AuthStep>('name');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationId, setVerificationId] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent via-secondary to-primary flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8 card-premium bg-white p-8">
          <p className="text-7xl mb-4">🥟</p>
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-primary to-red-600 bg-clip-text mb-2">
            Uncle's Chinese
          </h1>
          <p className="text-xl text-dark font-semibold">Momo Festival Challenge</p>
          <p className="text-sm text-gray-600 mt-2">Catch momos. Win rewards. Play daily!</p>
        </div>

        {step === 'name' && (
          <NameInput
            onNext={(inputName) => {
              setName(inputName);
              setStep('phone');
            }}
          />
        )}

        {step === 'phone' && (
          <PhoneInput
            name={name}
            onBack={() => setStep('name')}
            onPhoneSubmitted={(inputPhone, verId) => {
              setPhone(inputPhone);
              setVerificationId(verId);
              setStep('otp');
            }}
          />
        )}

        {step === 'otp' && (
          <OTPVerification
            phone={phone}
            name={name}
            verificationId={verificationId}
            onBack={() => setStep('phone')}
          />
        )}
      </div>
    </div>
  );
}
