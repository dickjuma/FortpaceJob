import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Shield, Star, ArrowRight, TrendingUp } from 'lucide-react';
import Container from '../common/Container';
import Button from '../common/Button';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-surface">
      {/* Background soft shapes */}
      <div className="absolute top-0 left-1/2 -tranzinc-x-1/2 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-emerald-100/50 blur-3xl opacity-50" />
        <div className="absolute top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand-100/50 blur-3xl opacity-50" />
      </div>

      <Container className="relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Left Column - Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900 mb-6 leading-[1.1]">
              Find the Right Freelancers to Grow Your Business
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 mb-10 leading-relaxed max-w-lg">
              Connect with skilled professionals trusted by startups, businesses, and enterprises around the world.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Button size="lg" fullWidth className="sm:w-auto" onClick={() => navigate('/auth/register')}>
                Hire Talent
              </Button>
              <Button size="lg" variant="outline" fullWidth className="sm:w-auto" onClick={() => navigate('/auth/register')}>
                Become a Freelancer
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 border-t border-zinc-200 pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-zinc-700">Trusted by 100k+ businesses</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                <span className="text-sm font-medium text-zinc-700">Secure payments</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-success fill-emerald-600" />
                <span className="text-sm font-medium text-zinc-700">Verified freelancers</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Image & Floating Cards */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative lg:h-[600px] flex items-center justify-center lg:justify-end"
          >
            {/* Main Image */}
            <div className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl shadow-zinc-200">
              {/* Using a high-quality Unsplash image of professional collaborating */}
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop" 
                alt="Professionals collaborating" 
                className="w-full h-auto object-cover rounded-3xl"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-zinc-900/10 rounded-3xl"></div>
            </div>

            {/* Floating Card 1 */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 -left-6 sm:left-4 bg-white p-4 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Contract Signed</p>
                <p className="text-xs text-zinc-500">UI/UX Design Project</p>
              </div>
            </motion.div>

            {/* Floating Card 2 */}
            <motion.div 
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 -right-4 sm:right-0 bg-white p-4 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop" alt="Avatar" />
                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop" alt="Avatar" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Payment Completed</p>
                <p className="text-xs text-zinc-500">$3,200 via Escrow</p>
              </div>
            </motion.div>

            {/* Floating Card 3 */}
            <motion.div 
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute top-1/2 -tranzinc-y-1/2 -left-10 sm:-left-16 bg-white p-3 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100"
            >
              <div className="flex items-center gap-1 mb-1 text-success">
                <Star className="w-3 h-3 fill-emerald-500" />
                <Star className="w-3 h-3 fill-emerald-500" />
                <Star className="w-3 h-3 fill-emerald-500" />
                <Star className="w-3 h-3 fill-emerald-500" />
                <Star className="w-3 h-3 fill-emerald-500" />
              </div>
              <p className="text-xs font-bold text-zinc-900">Exceptional work!</p>
            </motion.div>

          </motion.div>
        </div>
      </Container>
    </section>
  );
}
