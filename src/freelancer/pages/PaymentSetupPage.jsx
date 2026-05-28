import React, { useState } from 'react';
import { 
  Phone, ShieldCheck, Check, Key, Loader2, Sparkles, AlertCircle, RefreshCcw, CreditCard, HelpCircle
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';

export default function PaymentSetupPage() {
  const [mpesaStatus, setMpesaStatus] = useState('Not setup'); // 'Not setup' | 'Pending verification' | 'Active'
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [otp, setOtp] = useState('');
  const [pin, setPin] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [payoutSchedule, setPayoutSchedule] = useState('Immediate');

  const handleSendOTP = (e) => {
    e.preventDefault();
    if (!phone.startsWith('07') && !phone.startsWith('01') && !phone.startsWith('+254')) {
      toast.error('Please enter a valid Safaricom phone number.');
      return;
    }
    if (!fullName || !nationalId) {
      toast.error('Please complete your full legal name and national ID.');
      return;
    }

    setOtpSent(true);
    toast.success('Safaricom OTP verification token dispatched successfully! 📲');
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otp !== '4832') {
      toast.error('Incorrect OTP code. Use "4832" for verified simulation.');
      return;
    }
    if (pin.length !== 4) {
      toast.error('Please set a secure 4-digit withdrawal PIN.');
      return;
    }

    setMpesaStatus('Active');
    toast.success('M-Pesa Connected & Verified successfully! 💳');
  };

  const handleDisconnect = () => {
    setMpesaStatus('Not setup');
    setPhone('');
    setFullName('');
    setNationalId('');
    setOtp('');
    setPin('');
    setOtpSent(false);
    toast.success('Payment method disconnected.');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border pb-6 mb-8">
        <div className="p-2.5 bg-accent-purple/20 text-accent-purple rounded-xl shadow-sm border border-accent-purple/20">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight">Payment Setup</h1>
          <p className="text-sm text-text-secondary font-medium mt-1">
            Configure secure withdrawal routing keys, link Safaricom M-Pesa, and verify identity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main setup form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6 border border-border bg-white shadow-sm space-y-6">
            <h3 className="font-black text-text-primary text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-3">
              <Phone className="w-5 h-5 text-accent-purple animate-pulse" /> Connect Safaricom M-Pesa
            </h3>

            {mpesaStatus === 'Active' ? (
              <div className="p-5 bg-success/5 border border-success/20 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-success">
                  <ShieldCheck className="w-5 h-5 animate-bounce" />
                  <span className="text-xs font-black uppercase tracking-wider">M-Pesa Verified Active</span>
                </div>
                
                <div className="text-xs font-bold text-text-secondary space-y-1.5">
                  <div>Verified Owner: <strong className="text-text-primary uppercase">{fullName}</strong></div>
                  <div>Phone number: <strong className="text-text-primary">{phone}</strong></div>
                  <div>Payout Schedule: <strong className="text-text-primary capitalize">{payoutSchedule}</strong></div>
                </div>

                <div className="pt-2 border-t border-border flex gap-3">
                  <Button variant="outline" size="sm" onClick={handleDisconnect} className="text-accent-red hover:text-accent-red/90 rounded-xl font-bold">
                    Disconnect Account
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={otpSent ? handleVerifyOTP : handleSendOTP} className="space-y-4 text-xs font-bold text-text-secondary">
                <div>
                  <label className="block mb-1.5 uppercase tracking-widest text-[9px]">Safaricom Mobile Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 0712345678" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={otpSent}
                    className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-accent-purple outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 uppercase tracking-widest text-[9px]">Legal Full Name (Matches KYC/National ID)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. ALEX MORGAN" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={otpSent}
                    className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-accent-purple outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 uppercase tracking-widest text-[9px]">National ID Number</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 33445566" 
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    disabled={otpSent}
                    className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-accent-purple outline-none transition-all"
                  />
                </div>

                {otpSent ? (
                  <div className="space-y-4 pt-2 border-t border-border animate-in fade-in duration-200">
                    <div>
                      <label className="block mb-1.5 uppercase tracking-widest text-[9px]">Safaricom OTP verification token (Use "4832")</label>
                      <input 
                        type="text" 
                        placeholder="OTP Verification Token" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-accent-purple outline-none transition-all animate-pulse"
                      />
                    </div>

                    <div>
                      <label className="block mb-1.5 uppercase tracking-widest text-[9px]">Create Secure 4-Digit Payout PIN</label>
                      <input 
                        type="password" 
                        maxLength="4"
                        placeholder="Security PIN" 
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-text-primary focus:bg-white focus:border-accent-purple outline-none transition-all"
                      />
                    </div>

                    <Button type="submit" variant="primary" className="w-full py-3 bg-accent-purple hover:bg-accent-purple/95 font-bold rounded-xl text-xs">
                      Verify & Activate connected M-Pesa
                    </Button>
                  </div>
                ) : (
                  <Button type="submit" variant="primary" className="w-full py-3 bg-accent-purple hover:bg-accent-purple/95 font-bold rounded-xl text-xs">
                    Dispatch Verification OTP Handshake
                  </Button>
                )}
              </form>
            )}
          </Card>
        </div>

        {/* Right side status column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6 border border-border bg-light-gray rounded-3xl space-y-4">
            <h4 className="font-black text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-accent-purple" /> Payout Settings
            </h4>
            <p className="text-[10px] font-semibold text-text-secondary leading-relaxed">
              Configure preferred frequency timings to route cleared ledger balances directly to M-Pesa.
            </p>
            
            <div className="space-y-2 text-[10px] font-bold text-text-secondary">
              {['Immediate', 'Weekly Sunday Payout', 'Monthly First Payout'].map(sch => (
                <label key={sch} className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="schedule" 
                    checked={payoutSchedule === sch}
                    onChange={() => setPayoutSchedule(sch)}
                    className="w-3.5 h-3.5 text-accent-purple" 
                  />
                  <span>{sch}</span>
                </label>
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-border bg-white shadow-sm space-y-3">
            <h4 className="font-black text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-warning" /> Payout Security Rules
            </h4>
            <p className="text-[10px] font-semibold text-text-secondary leading-relaxed">
              For anti-money laundering compliance, connected M-Pesa mobile number registered names must align strictly with verification database ledgers.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}
