import React, { useState, useEffect } from "react";
import { walletAPI, paymentAPI } from "../services/api";
import { toast } from "sonner";
import { Wallet, ArrowUpRight, ArrowDownRight, CreditCard, Smartphone, Building } from "lucide-react";
import { motion } from "framer-motion";

const WalletPage = () => {
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      const response = await paymentAPI.deposit(
        parseFloat(amount),
        paymentMethod,
        phoneNumber
      );
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        toast.success("Deposit initiated successfully!");
      }
    } catch (error) {
      toast.error(error.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);
    try {
      await walletAPI.requestWithdrawal(parseFloat(withdrawAmount));
      toast.success("Withdrawal request submitted successfully!");
      setWithdrawAmount("");
    } catch (error) {
      toast.error(error.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Wallet Balance Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#14a800] to-[#118a00] rounded-2xl p-8 text-white"
      >
        <div className="flex items-center gap-3 mb-4">
          <Wallet size={32} />
          <h2 className="text-2xl font-bold">My Wallet</h2>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[#14a800] text-sm">Available Balance</p>
            <p className="text-4xl font-bold">$2,450.00</p>
          </div>
          <div>
            <p className="text-[#14a800] text-sm">Escrow Balance</p>
            <p className="text-4xl font-bold">$1,200.00</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Deposit Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <ArrowUpRight className="text-green-600" size={24} />
            <h3 className="text-xl font-bold">Deposit Funds</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#14a800]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod("mpesa")}
                  className={`p-3 rounded-lg border text-center transition ${
                    paymentMethod === "mpesa"
                      ? "border-[#14a800]/50 bg-[#14a800]/5"
                      : "border-gray-200 hover:bg-surface"
                  }`}
                >
                  <Smartphone size={20} className="mx-auto mb-1" />
                  <span className="text-xs">M-Pesa</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("airtel")}
                  className={`p-3 rounded-lg border text-center transition ${
                    paymentMethod === "airtel"
                      ? "border-[#14a800]/50 bg-[#14a800]/5"
                      : "border-gray-200 hover:bg-surface"
                  }`}
                >
                  <Smartphone size={20} className="mx-auto mb-1" />
                  <span className="text-xs">Airtel</span>
                </button>
                <button
                  onClick={() => setPaymentMethod("card")}
                  className={`p-3 rounded-lg border text-center transition ${
                    paymentMethod === "card"
                      ? "border-[#14a800]/50 bg-[#14a800]/5"
                      : "border-gray-200 hover:bg-surface"
                  }`}
                >
                  <CreditCard size={20} className="mx-auto mb-1" />
                  <span className="text-xs">Card</span>
                </button>
              </div>
            </div>

            {(paymentMethod === "mpesa" || paymentMethod === "airtel") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254712345678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#14a800]"
                />
              </div>
            )}

            <button
              onClick={handleDeposit}
              disabled={loading || !amount}
              className="w-full py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Deposit Now"}
            </button>
          </div>
        </motion.div>

        {/* Withdraw Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl p-6 border border-gray-200"
        >
          <div className="flex items-center gap-3 mb-6">
            <ArrowDownRight className="text-[#14a800]" size={24} />
            <h3 className="text-xl font-bold">Withdraw Funds</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (USD)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="0.00"
                max="2450"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-#14a800]"
              />
            </div>

            <div className="bg-surface rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Available:</span> $2,450.00
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Minimum withdrawal: $10.00
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Withdrawal Method
              </label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-lg">
                <option>M-Pesa (+254712345678)</option>
                <option>Airtel Money</option>
                <option>Bank Transfer</option>
              </select>
            </div>

            <button
              onClick={handleWithdraw}
              disabled={loading || !withdrawAmount}
              className="w-full py-3 bg-[#14a800] text-white rounded-lg font-semibold hover:bg-[#118a00] disabled:opacity-50"
            >
              {loading ? "Processing..." : "Withdraw Now"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Transaction History */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold">Recent Transactions</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    i % 2 === 0 ? "bg-green-100" : "bg-[#14a800]/10"
                  }`}>
                    {i % 2 === 0 ? (
                      <ArrowUpRight className="text-green-600" size={20} />
                    ) : (
                      <ArrowDownRight className="text-[#14a800]" size={20} />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {i % 2 === 0 ? "Deposit" : "Payment for Job"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {i % 2 === 0 ? "M-Pesa" : "Project #1234"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    i % 2 === 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {i % 2 === 0 ? "+" : "-"}$500.00
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WalletPage;