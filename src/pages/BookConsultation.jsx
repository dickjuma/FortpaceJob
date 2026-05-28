import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, FileText, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookConsultation = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('Wed, Oct 18');
  const [selectedTime, setSelectedTime] = useState('');

  const TIME_SLOTS = [
    '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM',
    '01:00 PM', '02:30 PM', '04:00 PM', '05:00 PM'
  ];

  return (
    <>
      <div className="bg-surface min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <div className="bg-white rounded-3xl shadow-xl border border-zinc-200 overflow-hidden flex flex-col md:flex-row">
            
            {/* LEFT: Freelancer Info Sidebar */}
            <div className="w-full md:w-1/3 bg-surface-dark text-white p-8">
              <h2 className="text-xl font-bold mb-8">Consultation Details</h2>
              
              <div className="flex items-center gap-4 mb-6">
                <img src="https://ui-avatars.com/api/?name=Sarah+Wanjiku&background=0D8ABC&color=fff" className="w-16 h-16 rounded-full border-2 border-white/20" alt="Sarah" />
                <div>
                  <div className="font-bold text-lg">Sarah Wanjiku</div>
                  <div className="text-brand-300 text-sm">Senior React Developer</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex gap-3 text-zinc-300">
                  <Clock className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white mb-1">30 Minute Call</div>
                    <div className="text-sm">Brief intro and project scope review.</div>
                  </div>
                </div>
                
                <div className="flex gap-3 text-zinc-300">
                  <Video className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white mb-1">Video Meeting</div>
                    <div className="text-sm">Link provided upon confirmation.</div>
                  </div>
                </div>

                <div className="flex gap-3 text-zinc-300">
                  <FileText className="w-5 h-5 text-brand-400 flex-shrink-0" />
                  <div>
                    <div className="font-bold text-white mb-1">Cost: $45</div>
                    <div className="text-sm">Deducted from first milestone if hired.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Booking Flow */}
            <div className="w-full md:w-2/3 p-8">
              {step === 1 && (
                <div>
                  <h3 className="text-2xl font-black text-zinc-900 mb-6">Select a Date & Time</h3>
                  
                  {/* Mock Calendar Header */}
                  <div className="flex items-center justify-between mb-6">
                    <button className="p-2 border border-zinc-200 rounded-lg hover:bg-surface"><ChevronLeft className="w-5 h-5" /></button>
                    <div className="font-bold text-lg">October 2026</div>
                    <button className="p-2 border border-zinc-200 rounded-lg hover:bg-surface"><ChevronRight className="w-5 h-5" /></button>
                  </div>

                  {/* Mock Date Selector */}
                  <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                    {['Mon 16', 'Tue 17', 'Wed 18', 'Thu 19', 'Fri 20'].map(date => (
                      <button 
                        key={date}
                        onClick={() => setSelectedDate(date)}
                        className={`flex-1 min-w-[80px] py-4 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${selectedDate === date ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-md ring-2 ring-brand-500/20' : 'border-zinc-200 bg-white hover:border-brand-300'}`}
                      >
                        <span className="text-xs uppercase font-bold">{date.split(' ')[0]}</span>
                        <span className="text-xl font-black">{date.split(' ')[1]}</span>
                      </button>
                    ))}
                  </div>

                  <h4 className="font-bold text-zinc-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-zinc-400" /> Available Slots for {selectedDate}
                  </h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    {TIME_SLOTS.map(time => (
                      <button 
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-3 rounded-lg border font-bold text-sm transition-all ${selectedTime === time ? 'border-brand-500 bg-brand-600 text-white shadow-md' : 'border-zinc-200 bg-white text-zinc-700 hover:border-brand-300 hover:bg-surface'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-end">
                    <button 
                      disabled={!selectedTime}
                      onClick={() => setStep(2)}
                      className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${selectedTime ? 'bg-surface-dark hover:bg-zinc-800 text-white' : 'bg-zinc-100 text-zinc-400 cursor-not-allowed'}`}
                    >
                      Next Step <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-2xl font-black text-zinc-900 mb-6">Confirm Details</h3>
                  
                  <div className="bg-brand-50 border border-brand-100 p-4 rounded-xl mb-6 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-brand-600 font-bold border border-brand-200">
                      <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-900">{selectedDate}</div>
                      <div className="text-sm text-zinc-600">{selectedTime} - {selectedTime.replace('00', '30')}</div>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">What do you want to discuss?</label>
                      <input type="text" placeholder="e.g. E-commerce frontend rebuild" className="w-full border border-zinc-200 rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-brand-500 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Estimated Budget (Optional)</label>
                      <input type="text" placeholder="$5k - $10k" className="w-full border border-zinc-200 rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-brand-500 focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-zinc-700 mb-1">Additional Notes</label>
                      <textarea rows="3" placeholder="Any links or documents..." className="w-full border border-zinc-200 rounded-xl px-4 py-3 bg-surface focus:outline-none focus:border-brand-500 focus:bg-white"></textarea>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button onClick={() => setStep(1)} className="px-6 py-3 border border-zinc-200 rounded-xl font-bold text-zinc-600 hover:bg-surface">Back</button>
                    <button onClick={() => setStep(3)} className="px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-bold transition-all shadow-lg">Confirm & Pay $45</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-emerald-100 text-success rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-zinc-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-zinc-600 mb-8 max-w-md mx-auto">
                    Your meeting with Sarah is confirmed for {selectedDate} at {selectedTime}. You will receive a calendar invite and video link shortly.
                  </p>
                  <Link to="/messages" className="px-8 py-3 bg-surface-dark hover:bg-zinc-800 text-white rounded-xl font-bold transition-all shadow-md inline-block">
                    View Messages
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookConsultation;
