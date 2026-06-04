import React, { useState } from 'react';
import { 
  Settings, Sun, Moon, Laptop, Layout, Check, Palette, Sparkles
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function AppearanceSettingsPage() {
  const [theme, setTheme] = useState('system'); // 'light' | 'dark' | 'system'
  const [sidebarLayout, setSidebarLayout] = useState('expanded'); // 'expanded' | 'collapsed'
  const [accentColor, setAccentColor] = useState('purple'); // 'purple' | 'blue' | 'green' | 'red'

  const handleSelectTheme = (mode) => {
    setTheme(mode);
    toast.success(`Theme updated to: ${mode.toUpperCase()} mode! 🌓`);
  };

  const handleSelectAccent = (color) => {
    setAccentColor(color);
    toast.success(`Primary accent color updated: ${color.toUpperCase()}! 🎨`);
  };

  const handleSave = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: 'Syncing aesthetic workspace configurations...',
        success: 'Visual environment preferences saved! ✨',
        error: 'Failed to update aesthetics.'
      }
    );
  };

  const accentColors = [
    { key: 'purple', label: 'Royal Purple', class: 'bg-success border-success' },
    { key: 'blue', label: 'Deep Blue', class: 'bg-[#2bb75c] border-[#2bb75c]/20' },
    { key: 'green', label: 'Emerald Green', class: 'bg-success border-success' },
    { key: 'red', label: 'Sunset Red', class: 'bg-[#e63946] border-[#e63946]' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Palette className="w-8 h-8 text-success" />
            Appearance Configurator
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Customize the look and feel of your workspace portal environment, select accent palettes, and toggle dark frames.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<Check size={18} />}
          onClick={handleSave}
        >
          Save Appearance
        </Button>
      </div>

      <div className="space-y-6">
        
        {/* Theme configuration */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Sun className="w-5 h-5 text-success" />
            Theme Color Settings
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'light', label: 'Light Theme', icon: Sun, desc: 'Optimized workspace framework with clean white panels.' },
              { key: 'dark', label: 'Dark Slate Theme', icon: Moon, desc: 'Sleek dark interface tailored for low-light environment builds.' },
              { key: 'system', label: 'Automatic Sync', icon: Laptop, desc: 'Syncs slate layouts automatically with operating system settings.' }
            ].map(opt => (
              <div 
                key={opt.key}
                onClick={() => handleSelectTheme(opt.key)}
                className={cn(
                  "p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[140px]",
                  theme === opt.key 
                    ? "border-success bg-success/5 shadow-sm" 
                    : "border-border bg-light-gray hover:border-border-hover hover:bg-white"
                )}
              >
                <div className="flex justify-between items-start">
                  <div className={cn("p-2.5 rounded-xl border border-border bg-white text-text-primary", theme === opt.key && "text-success")}>
                    <opt.icon size={18} />
                  </div>
                  {theme === opt.key && <span className="w-5 h-5 bg-success rounded-full flex items-center justify-center text-white"><Check size={12} /></span>}
                </div>
                <div className="mt-4">
                  <h4 className="font-black text-sm text-text-primary">{opt.label}</h4>
                  <p className="text-[10px] text-text-secondary font-medium leading-relaxed mt-0.5">{opt.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Accent Selector */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Sparkles className="w-5 h-5 text-success" />
            Primary Accent Color
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {accentColors.map(color => (
              <div 
                key={color.key}
                onClick={() => handleSelectAccent(color.key)}
                className={cn(
                  "p-4 rounded-xl border cursor-pointer flex items-center gap-3 transition-all hover:scale-102",
                  accentColor === color.key ? "border-border shadow-sm bg-light-gray" : "border-border/60 hover:border-border-hover"
                )}
              >
                <span className={cn("w-5 h-5 rounded-full border border-white/20 shrink-0", color.class)}></span>
                <span className="font-bold text-xs text-text-primary">{color.label}</span>
                {accentColor === color.key && <Check size={14} className="ml-auto text-success" />}
              </div>
            ))}
          </div>
        </Card>

        {/* Sidebar layouts */}
        <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
          <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
            <Layout className="w-5 h-5 text-success" />
            Navigation Layout Grid
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'expanded', label: 'Standard Sidebar Expanded', desc: 'Displays descriptive headers alongside icon marks.' },
              { key: 'collapsed', label: 'Minimal Sidebar Icon Drawer', desc: 'Saves screenspace by showing clean minimal icons only.' }
            ].map(opt => (
              <div 
                key={opt.key}
                onClick={() => setSidebarLayout(opt.key)}
                className={cn(
                  "p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between min-h-[120px]",
                  sidebarLayout === opt.key 
                    ? "border-success bg-success/5 shadow-sm" 
                    : "border-border bg-light-gray hover:border-border-hover hover:bg-white"
                )}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-sm text-text-primary">{opt.label}</h4>
                  {sidebarLayout === opt.key && <span className="w-5 h-5 bg-success rounded-full flex items-center justify-center text-white"><Check size={12} /></span>}
                </div>
                <p className="text-xs text-text-secondary font-medium mt-2 leading-relaxed">{opt.desc}</p>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}

