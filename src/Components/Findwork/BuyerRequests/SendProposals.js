import React, { useState } from "react";
import { Send, Clock, DollarSign, FileText, AlertCircle, Paperclip, ShieldCheck, ChevronDown } from "lucide-react";

export default function SendProposal({ request, onCancel }) {
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    deliveryTime: "3",
    revisions: "1",
    attachments: null
  });

  // Fiverr logic: 20% Service Fee
  const serviceFee = formData.price ? (parseFloat(formData.price) * 0.20).toFixed(2) : "0.00";
  const netIncome = formData.price ? (parseFloat(formData.price) - serviceFee).toFixed(2) : "0.00";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting to Client:", request.buyer, formData);
    // Logic: Create proposal -> On accept -> Create Client & Draft Invoice
    alert("Offer sent to " + request.buyer);
    onCancel();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden">
      
      {/* 1. Context Header */}
      <div className="bg-[#4A312F] p-8 text-white relative">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#B7E2BF]">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Personalized Offer</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black">{request?.title || "Project Proposal"}</h2>
            <p className="text-sm text-gray-400">Request from <span className="text-white font-bold">{request?.buyer || "Premium Buyer"}</span></p>
          </div>
          <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/10">
            <p className="text-[10px] font-bold text-[#B7E2BF] uppercase tracking-widest">Buyer's Budget</p>
            <p className="text-xl font-black">{request?.budget || "$0.00"}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
        
        {/* 2. Proposal Body */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-lg font-black text-black">Describe your Offer</label>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{formData.description.length} / 2500</span>
          </div>
          <textarea
            className="w-full border-2 border-gray-50 rounded-3xl p-6 min-h-[180px] focus:border-[#B7E2BF] focus:outline-none transition-all placeholder:text-gray-300 text-black font-medium"
            placeholder="Introduce yourself and explain how you will execute this project. Be specific about the value you bring."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        {/* 3. Offer Details & Fee Calculator */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Inputs Column */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Total Price</label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={16} />
                  <input
                    type="number"
                    className="w-full bg-[#F7F9FB] border border-gray-100 rounded-2xl py-4 pl-10 pr-4 font-black text-black outline-none focus:ring-2 focus:ring-[#B7E2BF]"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Delivery</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-black" size={16} />
                  <select
                    className="w-full bg-[#F7F9FB] border border-gray-100 rounded-2xl py-4 pl-10 pr-4 font-black text-black outline-none appearance-none cursor-pointer"
                    value={formData.deliveryTime}
                    onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                  >
                    <option value="1">1 Day</option>
                    <option value="3">3 Days</option>
                    <option value="7">7 Days</option>
                    <option value="14">14 Days</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Attachments</label>
              <div className="group relative border-2 border-dashed border-gray-100 hover:border-[#B7E2BF] rounded-2xl p-6 transition-all text-center cursor-pointer">
                <input type="file" multiple onChange={(e) => setFormData({...formData, attachments: e.target.files})} className="absolute inset-0 opacity-0 cursor-pointer" />
                <Paperclip className="mx-auto mb-2 text-gray-300 group-hover:text-[#B7E2BF]" />
                <p className="text-xs font-bold text-gray-400 uppercase">Drop files or click to upload</p>
              </div>
            </div>
          </div>

          {/* Fee Table Column */}
          <div className="bg-[#B7E2BF]/10 rounded-[2rem] p-8 border border-[#B7E2BF]/20 flex flex-col justify-center">
            <h4 className="text-[10px] font-black text-[#4A312F] uppercase tracking-[0.2em] mb-6 border-b border-[#4A312F]/10 pb-2">Financial Breakdown</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-bold">Total Offer Amount</span>
                <span className="text-black font-black">${formData.price || "0.00"}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-bold">Marketplace Fee (20%)</span>
                <span className="text-red-500 font-bold">-${serviceFee}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-white flex justify-between items-center">
                <span className="text-xs font-black text-[#4A312F] uppercase tracking-widest">You'll Earn</span>
                <span className="text-3xl font-black text-[#4A312F] tracking-tighter">${netIncome}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Submission Footer */}
        <div className="pt-10 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-gray-400">
            <AlertCircle size={18} className="text-[#D34079]" />
            <p className="text-[11px] font-bold uppercase tracking-wider leading-tight max-w-[300px]">
              This offer will be valid for 48 hours. Once accepted, a workspace will be created.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
             <button
              type="button"
              onClick={onCancel}
              className="flex-1 md:flex-none px-8 py-5 rounded-2xl font-black text-gray-400 hover:text-black transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 md:flex-none bg-black hover:bg-[#D34079] text-white px-12 py-5 rounded-2xl font-black shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
              Send Offer <Send size={20} />
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}