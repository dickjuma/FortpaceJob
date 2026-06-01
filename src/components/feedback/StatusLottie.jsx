import React from 'react';
import Lottie from 'lottie-react';
import failAnimation from '../../assets/lottie/fail.json';
import successAnimation from '../../assets/lottie/success.json';

const MAP = {
  success: successAnimation,
  error: failAnimation,
  fail: failAnimation,
};

export default function StatusLottie({ variant = 'success', size = 40, loop = false, className = '' }) {
  const data = MAP[variant] || MAP.success;
  return (
    <div className={className} style={{ width: size, height: size }} aria-hidden>
      <Lottie animationData={data} loop={loop} style={{ width: size, height: size }} />
    </div>
  );
}
