import React, { useState, useEffect } from 'react';
import { 
  Wallet, ArrowUpRight, ArrowDownRight, RefreshCcw, Download, Clock, 
  CheckCircle2, ChevronDown, ChevronUp, AlertCircle, ShieldCheck, 
  Send, DollarSign, Users, Award, Percent, Key, Phone, Check, Loader2, BarChart2, Smartphone
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import notify from '../../common/utils/notify';
import { walletAPI } from '../../common/services/api';
import { websocketService } from '../../common/services/websocket.service';
import KraComplianceBanner from '../../components/compliance/KraComplianceBanner';

// --- Reusable SVG Chart Component ---
const TinyFintechChart = ({ data }) => {
  const values = Array.isArray(data) && data.length > 0 ? data : [];
  const maxVal = Math.max(...values, 1);

  return (
    <div className="h-32 w-full flex items-end gap-1.5 pt-4">
      {values.length === 0 ? (
        <div className="flex h-full w-full items-center justify-center text-text-secondary text-xs font-bold">
          No chart data yet
        </div>
      ) : (
        values.map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer h-full justify-end">
            <div
              className="w-full bg-success/20 group-hover:bg-success rounded-t-md transition-all duration-300 relative"
              style={{ height: `${(val / maxVal) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#222222] text-white text-[9px] font-black px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow z-35 pointer-events-none">
                +{val} KES
              </div>
            </div>
            <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest">{idx + 1}h</span>
          </div>
        ))
      )}
    </div>
  );
};

export default function WalletPage() {
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState({
    available: 0,
    pending: 0,
    escrow: 0,
    monthly: 0
  });

  const [activeTab, setActiveTab] = useState('Overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState([]);
  
  // M-Pesa Setup States
  const [mpesaStatus, setMpesaStatus] = useState('Not setup'); // 'Not setup' | 'Pending verification' | 'Active'
  const [mpesaPhone, setMpesaPhone] = useState('');
  const [mpesaName, setMpesaName] = useState('');
  const [mpesaPin, setMpesaPin] = useState('');
  const [mpesaOtp, setMpesaOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [payoutSchedule, setPayoutSchedule] = useState('Immediate');

  // Withdrawal & Deposit Wizard
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositPhone, setDepositPhone] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  useEffect(() => {
    loadWalletData();
    
    // Wire up real-time Socket.io signaling
    const handleBalanceUpdate = (data) => {
      console.log('Real-time ledger balance update received:', data);
      setWallet(prev => ({
        ...prev,
        available: data.availableBalance !== undefined ? data.availableBalance : prev.available,
        escrow: data.lockedBalance !== undefined ? data.lockedBalance : prev.escrow
      }));
      notify.success('Wallet balance updated in real time.', { id: 'wallet-ws' });
      loadTransactions();
    };

    const unsubscribe = websocketService.subscribe('wallet:balance_update', handleBalanceUpdate);
    websocketService.connect();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const loadWalletData = async () => {
    setLoading(true);
    try {
      const data = await walletAPI.getWallet();
      setWallet({
        available: data.availableBalance || 0,
        pending: data.pendingBalance || 0,
        escrow: data.lockedBalance || 0,
        monthly: data.monthlyGrowth ?? data.monthlyEarnings ?? 0
      });
      await loadTransactions();
    } catch (err) {
      notify.error('Failed to load real-time ledger wallet balance.');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    try {
      const txData = await walletAPI.getTransactions();
      setTransactions(txData.transactions || txData.data || txData || []);
    } catch (err) {
      console.error('Failed to load transaction history', err);
    }
  };

  const handleSendOTP = () => {
    if (!mpesaPhone.startsWith('07') && !mpesaPhone.startsWith('01') && !mpesaPhone.startsWith('+254')) {
      notify.error('Please enter a valid Safaricom phone number.');
      return;
    }
    setOtpSent(true);
    notify.success('Safaricom OTP verification token dispatched.');
  };

  const handleVerifyOTP = async () => {
    if (!mpesaOtp || mpesaOtp.trim().length < 4) {
      notify.error('Please enter a valid OTP sent to your phone.');
      return;
    }
    try {
      const result = await walletAPI.verifyMpesaOtp({ otp: mpesaOtp, phone: mpesaPhone });
      setMpesaStatus('Active');
      setDepositPhone(mpesaPhone);
      setOtpSent(false);
      notify.success('M-Pesa verified & connected successfully.');
    } catch (err) {
      notify.error(err?.message || 'OTP verification failed.');
    }
  };

  const handleWithdrawFunds = async (e) => {
    e.preventDefault();

    if (isWithdrawing) return;

    if (mpesaStatus !== 'Active') {
      notify.error('Please configure your connected M-Pesa account before withdrawing.');
      return;
    }
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0 || amt > wallet.available) {
      notify.error('Insufficient available balance or invalid input amount.');
      return;
    }

    setIsWithdrawing(true);
    const toastId = notify.loading('Processing real-time Safaricom B2C payout trigger...');

    try {
      const result = await walletAPI.requestWithdrawal(amt, mpesaPhone);
      notify.success(`KES ${amt.toLocaleString()} successfully transferred to M-Pesa.`, { id: toastId });
      setWithdrawAmount('');
      await loadWalletData();
    } catch (err) {
      notify.error(err.message || 'Payout failed. Anti-fraud thresholds triggered.', { id: toastId });
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleMpesaDeposit = async (e) => {
    e.preventDefault();

    if (isDepositing) return;

    if (!depositPhone) {
      notify.error('Please enter a valid Safaricom number for STK Push top-up.');
      return;
    }
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) {
      notify.error('Please enter a valid deposit amount.');
      return;
    }

    setIsDepositing(true);
    const toastId = notify.loading('Sending Safaricom M-Pesa STK Push request…');

    try {
      const response = await walletAPI.depositMpesa(amt, depositPhone);
      notify.success(response.message || 'STK Push sent successfully! Check your phone.', { id: toastId });
      setDepositAmount('');

      // Auto poll payment status as fallback for real-time WebSockets
      if (response.checkoutRequestId) {
        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          try {
            const status = await walletAPI.getMpesaStatus(response.checkoutRequestId);
            const statusVal = status.status || status.data?.status;
            if (statusVal === 'COMPLETED') {
              clearInterval(interval);
              notify.success('M-Pesa STK Push payment verified successfully!', { id: 'stk-poll' });
              await loadWalletData();
            } else if (statusVal === 'FAILED') {
              clearInterval(interval);
              notify.error('STK Push payment failed or cancelled.', { id: 'stk-poll' });
            }
          } catch (e) {
            console.error('Error polling STK status', e);
          }
          if (attempts > 10) clearInterval(interval);
        }, 3000);
      }
    } catch (err) {
      notify.error(err.message || 'Failed to trigger M-Pesa STK Push.', { id: toastId });
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">

      <div className="mb-6">
        <KraComplianceBanner />
      </div>

      {/* Top Header Grid */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-6 border-b border-border pb-8 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-success/20 text-success rounded-xl border border-success/20">
              <Wallet className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Fintech Wallet Dashboard</h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 font-semibold">
            Track multi-currency revenue splits, manage M-Pesa payouts, and audit escrow ledger clearances.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={() => {
              loadWalletData();
              notify.success('Ledger balance refreshed!');
            }}
            variant="outline" 
            className="rounded-xl font-bold text-xs" 
            icon={<RefreshCcw size={14} />}
          >
            Sync Ledger
          </Button>
          <Button 
            onClick={() => notify.success('Financial ledger statements exported.')}
            variant="outline" 
            className="rounded-xl font-bold text-xs" 
            icon={<Download size={14} />}
          >
            Download CSV Statement
          </Button>
        </div>
      </div>

      {/* Wallet Balance Cards Header widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-none bg-[#222222] text-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-success/20 blur-[50px] rounded-full"></div>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Available Payout Balance</p>
          <h2 className="text-3xl font-black mt-2">KES {wallet.available.toLocaleString()}</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Instant Payout Active
          </span>
        </Card>

        <Card className="p-6 border border-border bg-white shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Pending Clearance</p>
          <h2 className="text-3xl font-black text-text-primary mt-2">KES {wallet.pending.toLocaleString()}</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-warning mt-4 block flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 animate-pulse" /> Clears in 3 days
          </span>
        </Card>

        <Card className="p-6 border border-border bg-white shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Secured Escrow</p>
          <h2 className="text-3xl font-black text-text-primary mt-2">KES {wallet.escrow.toLocaleString()}</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <LockIcon className="w-3.5 h-3.5" /> Contract Milestones Locked
          </span>
        </Card>

        <Card className="p-6 border border-border bg-white shadow-sm relative overflow-hidden">
          <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Monthly Net Growth</p>
          <h2 className="text-3xl font-black text-success mt-2">KES {wallet.monthly.toLocaleString()}</h2>
          <span className="text-[9px] uppercase tracking-wider font-bold text-success mt-4 block flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +15.8% vs last month
          </span>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Mini Sidebar Navigator */}
        <div className="lg:col-span-1 space-y-3">
          {['Overview', 'Transactions', 'Payment Setup', 'Shared Split Config'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all",
                activeTab === tab 
                  ? "bg-[#222222] text-white shadow" 
                  : "text-text-secondary hover:text-text-primary hover:bg-light-gray"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'Overview' && (
            <>
              {/* Earnings chart */}
              <Card className="p-6 border border-border bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-border pb-4 mb-4">
                  <div>
                    <h3 className="font-black text-text-primary text-sm uppercase tracking-wider">Revenue Stream Live</h3>
                    <p className="text-[10px] font-semibold text-text-secondary">Recent payment velocity chart</p>
                  </div>
                  <BarChart2 className="w-5 h-5 text-success" />
                </div>
                <TinyFintechChart data={transactions.slice(0, 12)} />
              </Card>

              {/* Recent Transactions List */}
              <Card className="p-6 border border-border bg-white shadow-sm">
                <h3 className="font-black text-text-primary text-sm uppercase tracking-wider border-b border-border pb-3 mb-4">
                  Ledger Transactions feed
                </h3>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <p className="text-xs text-text-secondary font-bold text-center py-4">No recent ledger transactions detected.</p>
                  ) : (
                    transactions.map(tx => (
                      <div key={tx.id} className="flex justify-between items-center text-xs p-3.5 bg-light-gray/40 rounded-2xl hover:bg-light-gray/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-xl text-white",
                            tx.amount > 0 || tx.type === 'CREDIT' ? "bg-success" : "bg-[#e63946]"
                          )}>
                            {tx.amount > 0 || tx.type === 'CREDIT' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <h4 className="font-bold text-text-primary">{tx.description || tx.reference || 'Reconciled Ledger Entry'}</h4>
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mt-0.5">{tx.type} • {tx.id || tx.entryType}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-text-primary">KES {Math.abs(tx.amount).toLocaleString()}</span>
                          <span className="block text-[8px] font-bold text-text-secondary uppercase tracking-wider mt-0.5">
                            {new Date(tx.createdAt || tx.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </>
          )}

          {activeTab === 'Payment Setup' && (
            <Card className="p-6 border border-border bg-white shadow-sm space-y-6">
              <h3 className="font-black text-text-primary text-base uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-3">
                <Phone className="w-5 h-5 text-success" /> Safaricom M-Pesa Connectivity
              </h3>
              
              {mpesaStatus === 'Active' ? (
                <div className="p-5 bg-success/5 border border-success/20 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-success">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-wider">M-Pesa Verified Active</span>
                  </div>
                  <div className="text-xs font-bold text-text-secondary">
                    <div>Recipient Name: <strong className="text-text-primary font-bold">{mpesaName}</strong></div>
                    <div>Phone Number: <strong className="text-text-primary font-bold">{mpesaPhone}</strong></div>
                    <div>Payout Schedule: <strong className="text-text-primary font-bold">{payoutSchedule}</strong></div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setMpesaStatus('Not setup')} className="mt-2 text-[#e63946] hover:text-[#e63946]/90">
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-light-gray/40 rounded-2xl border border-warning/10 flex gap-2.5">
                    <AlertCircle className="w-5 h-5 text-warning shrink-0" />
                    <p className="text-[10px] font-semibold text-text-secondary leading-relaxed">
                      KYC Compliance: Ensure your connected Safaricom phone matches your registered profile identity alex morgan to avoid escrow freezes.
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Safaricom phone number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 0712345678" 
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-xs font-bold text-text-primary focus:bg-white focus:border-success outline-none transition-all"
                    />
                  </div>

                  {otpSent ? (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Enter OTP Token (Use "4832")</label>
                        <input 
                          type="text" 
                          placeholder="Verification OTP" 
                          value={mpesaOtp}
                          onChange={(e) => setMpesaOtp(e.target.value)}
                          className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-xs font-bold text-text-primary focus:bg-white focus:border-success outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-widest mb-1.5">Create Withdrawal Security PIN</label>
                        <input 
                          type="password" 
                          placeholder="4-Digit Secure PIN" 
                          value={mpesaPin}
                          onChange={(e) => setMpesaPin(e.target.value)}
                          className="w-full rounded-xl border border-border bg-light-gray px-4 py-3 text-xs font-bold text-text-primary focus:bg-white focus:border-success outline-none transition-all"
                        />
                      </div>
                      <Button variant="primary" onClick={handleVerifyOTP} className="w-full py-3 bg-success hover:bg-success/95 font-bold rounded-xl text-xs">
                        Complete Handshake & Activate
                      </Button>
                    </div>
                  ) : (
                    <Button variant="primary" onClick={handleSendOTP} className="w-full py-3 bg-success hover:bg-success/95 font-bold rounded-xl text-xs">
                      Verify Safaricom ID Details
                    </Button>
                  )}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'Shared Split Config' && (
            <Card className="p-6 border border-border bg-white shadow-sm space-y-4">
              <h3 className="font-black text-text-primary text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-border pb-3">
                <Users className="w-5 h-5 text-success" /> Team Shared Wallet Revenue Splits
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed font-semibold">
                Configure automatic micro-commission transfers and payroll distributions directly upon invoice clearance.
              </p>
              
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs font-bold p-3 bg-light-gray/40 rounded-xl">
                  <span>Lead Developer (Alex Morgan)</span>
                  <span className="text-success font-black">70% Split</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold p-3 bg-light-gray/40 rounded-xl">
                  <span>UI/UX Partner (Sarah Jenkins)</span>
                  <span className="text-success font-black">20% Split</span>
                </div>
                <div className="flex justify-between items-center text-xs font-bold p-3 bg-light-gray/40 rounded-xl">
                  <span>Platform Commission Reserve</span>
                  <span className="text-text-secondary font-black">10% Split</span>
                </div>
              </div>
            </Card>
          )}

        </div>

        {/* Right Sidebar Financial Insights */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick Payout Widget */}
          <Card className="p-6 border border-border bg-white shadow-md space-y-4">
            <h4 className="font-black text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-4 h-4 text-success" /> Initiate Cashout
            </h4>
            
            <form onSubmit={handleWithdrawFunds} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Amount (KES)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 5000" 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-light-gray px-3 py-2 text-xs font-bold text-text-primary focus:bg-white focus:border-success outline-none transition-all"
                />
              </div>

              <div className="text-[10px] font-bold text-text-secondary space-y-1.5 py-1">
                <div className="flex justify-between">
                  <span>Platform Payout Fee</span>
                  <span>KES 50.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Safaricom Network Cost</span>
                  <span>Free</span>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isWithdrawing}
                className="w-full py-2.5 bg-success hover:bg-success/95 text-white font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {isWithdrawing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Transfer to M-Pesa
              </button>
            </form>
          </Card>

          {/* Quick M-Pesa Top-Up (STK Push) Widget */}
          <Card className="p-6 border border-border bg-white shadow-md space-y-4">
            <h4 className="font-black text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-green-600" /> M-Pesa Top-Up (STK Push)
            </h4>
            
            <form onSubmit={handleMpesaDeposit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Phone Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. 0712345678" 
                  value={depositPhone}
                  onChange={(e) => setDepositPhone(e.target.value)}
                  className="w-full rounded-xl border border-border bg-light-gray px-3 py-2 text-xs font-bold text-text-primary focus:bg-white focus:border-success outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-1">Amount (KES)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 25000" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full rounded-xl border border-border bg-light-gray px-3 py-2 text-xs font-bold text-text-primary focus:bg-white focus:border-success outline-none transition-all"
                />
              </div>

              <button 
                type="submit"
                disabled={isDepositing}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5"
              >
                {isDepositing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Deposit via STK Push
              </button>
            </form>
          </Card>

          {/* Verification Status info */}
          <Card className="p-6 border border-border bg-light-gray rounded-3xl space-y-3">
            <h4 className="font-black text-text-primary text-xs uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-warning" /> Compliance Audit
            </h4>
            <p className="text-[10px] font-semibold text-text-secondary leading-relaxed">
              M-Pesa connectivity matches strictly with your KYC verification name to prevent anti-fraud transaction freezes.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);
