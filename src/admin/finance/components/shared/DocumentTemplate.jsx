import React from 'react';
import { Layers, Globe, Mail, MapPin } from 'lucide-react';
import { cn } from '../../../utils/cn';
import useConfigStore from '../../../store/configStore';

/**
 * Enterprise-grade Document Template for Receipts, Invoices, and Statements.
 * Provides a unified marketing header, legal footer, and printable layout structure.
 */
export default function DocumentTemplate({ 
  children, 
  title, 
  documentId, 
  date, 
  className,
  type = 'receipt'
}) {
  const { companyDetails } = useConfigStore();

  return (
    <div className={cn(
      "w-full max-w-2xl mx-auto bg-white text-zinc-900 border border-zinc-200 sm:rounded-xl overflow-hidden shadow-sm flex flex-col sm:m-4 m-0",
      className
    )}>
      
      {/* Marketing & Legal Header */}
      <header className="bg-surface-dark text-white p-6 sm:p-8 border-b-4 border-[#4C1D95]/20">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
          
          {/* Logo & Company Branding */}
          <div className="space-y-4 w-full sm:w-auto">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="p-2 bg-[#4C1D95] rounded-lg">
                <Layers className="text-white" size={20} />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">{companyDetails.name}</h1>
            </div>
            
            <div className="space-y-1 text-[10px] sm:text-xs font-medium text-zinc-400 text-center sm:text-left">
              <p className="flex items-center justify-center sm:justify-start gap-2"><MapPin size={12}/> {companyDetails.address}</p>
              <p className="flex items-center justify-center sm:justify-start gap-2"><Globe size={12}/> {companyDetails.website}</p>
              <p className="flex items-center justify-center sm:justify-start gap-2"><Mail size={12}/> {companyDetails.email}</p>
            </div>
          </div>

          {/* Document Meta */}
          <div className="text-center sm:text-right w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-zinc-800">
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-widest text-zinc-100 mb-2">{title || 'Document'}</h2>
            <div className="space-y-1 text-xs sm:text-sm font-semibold">
              <p className="text-zinc-400">Doc ID: <span className="text-white font-mono">{documentId || 'N/A'}</span></p>
              <p className="text-zinc-400">Date: <span className="text-white">{date || new Date().toLocaleDateString()}</span></p>
              <p className="text-zinc-400">Tax ID: <span className="text-white font-mono">{companyDetails.taxId}</span></p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="p-6 sm:p-8 flex-1 bg-white overflow-x-auto">
        {children}
      </main>

      {/* Marketing Footer */}
      <footer className="p-4 sm:p-6 bg-surface border-t border-zinc-200 text-center space-y-2">
        <h4 className="text-xs sm:text-sm font-black text-zinc-700">Thank you for doing business with {companyDetails.name}!</h4>
        <p className="text-[10px] sm:text-xs font-medium text-zinc-500 max-w-xl mx-auto leading-relaxed px-4">
          {companyDetails.footerMessage}
          <br/>For support regarding this {type}, please contact our finance team at {companyDetails.email}.
        </p>
        <div className="pt-4 mt-4 border-t border-zinc-200">
           <p className="text-[9px] sm:text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
             {companyDetails.name} © {new Date().getFullYear()} • Secure & Audited
           </p>
        </div>
      </footer>
      
    </div>
  );
}


