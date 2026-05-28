import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UploadCloud, Image as ImageIcon, FileText, Video, 
  Trash2, Star, Info, CheckCircle2, AlertCircle,
  Move, PlayCircle
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

const GUIDELINES = [
  { text: 'Use high quality images (min 1280x769px)', ok: true },
  { text: 'Keep text to a minimum (under 20%)', ok: true },
  { text: 'Do not use clickbait or misleading imagery', ok: true },
  { text: 'Never use copyrighted material without rights', ok: false },
  { text: 'Do not include contact info (email, phone)', ok: false },
];

export default function GigGalleryUploadPage() {
  const [images, setImages] = useState([
    { id: 'img1', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80', isCover: true, progress: 100 },
    { id: 'img2', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80', isCover: false, progress: 100 },
  ]);
  const [videos, setVideos] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    // Mocking file upload
    const newId = `img_${Date.now()}`;
    setImages(prev => [...prev, { id: newId, url: '', isCover: prev.length === 0, progress: 0 }]);
    
    // Simulate upload progress
    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setImages(prev => prev.map(img => img.id === newId ? { ...img, progress: p, url: p === 100 ? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80' : '' } : img));
      if (p >= 100) clearInterval(interval);
    }, 300);
  };

  const setAsCover = (id) => {
    setImages(prev => prev.map(img => ({ ...img, isCover: img.id === id })));
  };

  const removeImage = (id) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      // Ensure there's a cover if images exist
      if (filtered.length > 0 && !filtered.some(i => i.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full font-sans">
      
      {/* Main Form Area */}
      <div className="flex-1 w-full space-y-8">
        
        {/* Header Block */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Gig Gallery</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Showcase your services in a Gig gallery. Buyers love visual portfolios. The first image will be used as your Gig cover.
          </p>
        </div>

        {/* Images Upload Section */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-500" /> Images (up to 3)
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Get noticed by the right buyers with visual examples of your services.</p>
            </div>
            <span className="text-sm font-bold text-zinc-400">{images.length}/3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Upload Zone */}
            {images.length < 3 && (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "col-span-1 aspect-[4/3] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors relative overflow-hidden group",
                  isDragging ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-zinc-300 dark:border-zinc-700 bg-surface dark:bg-zinc-800 hover:border-brand-400 dark:hover:border-brand-600"
                )}
              >
                <div className="absolute inset-0 bg-brand-500/0 group-hover:bg-brand-500/5 transition-colors" />
                <UploadCloud className={cn("w-8 h-8 mb-3 transition-colors", isDragging ? "text-brand-500" : "text-zinc-400 group-hover:text-brand-500")} />
                <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Drag & drop</span>
                <span className="text-xs font-medium text-zinc-500 mt-1">or browse files</span>
              </div>
            )}

            {/* Uploaded Images */}
            <AnimatePresence>
              {images.map(img => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  key={img.id}
                  className={cn(
                    "col-span-1 aspect-[4/3] rounded-2xl border-2 relative overflow-hidden group",
                    img.isCover ? "border-brand-500 shadow-md" : "border-zinc-200 dark:border-zinc-700"
                  )}
                >
                  {img.progress < 100 ? (
                    // Upload Progress State
                    <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center p-4">
                      <div className="w-full h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden mb-2">
                        <motion.div className="h-full bg-brand-500 rounded-full" animate={{ width: `${img.progress}%` }} />
                      </div>
                      <span className="text-xs font-bold text-zinc-500">Uploading {img.progress}%</span>
                    </div>
                  ) : (
                    // Completed State
                    <>
                      <img src={img.url} alt="Gig Portfolio" className="w-full h-full object-cover" />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                        <div className="flex justify-between w-full">
                          <button className="p-1.5 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-lg text-white transition-colors cursor-grab">
                            <Move className="w-4 h-4" />
                          </button>
                          <button onClick={() => removeImage(img.id)} className="p-1.5 bg-rose-500/80 hover:bg-rose-500 backdrop-blur-sm rounded-lg text-white transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        {!img.isCover && (
                          <button onClick={() => setAsCover(img.id)} className="w-full py-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-xl text-white text-xs font-bold transition-colors">
                            Set as Cover
                          </button>
                        )}
                      </div>

                      {/* Cover Badge */}
                      {img.isCover && (
                        <div className="absolute top-3 left-3 bg-brand-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" /> Cover
                        </div>
                      )}
                    </>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Video Upload Section */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
           <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <Video className="w-5 h-5 text-violet-500" /> Video (1 only)
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Capture buyers' attention with a video that showcases your service. Gigs with videos get 200% more orders.</p>
            </div>
          </div>

          {videos.length === 0 ? (
            <div className="w-full h-40 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-surface dark:bg-zinc-800 hover:border-violet-400 dark:hover:border-violet-600 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors group">
              <PlayCircle className="w-10 h-10 text-zinc-300 dark:text-zinc-600 mb-3 group-hover:text-violet-500 transition-colors" />
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Add a Video</span>
              <span className="text-xs font-medium text-zinc-500 mt-1">MP4 or AVI, max 50MB, under 75 seconds.</span>
            </div>
          ) : (
            <div>/* Render uploaded video preview here */</div>
          )}
        </div>

        {/* Document Upload Section */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
           <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-500" /> Documents (up to 2)
              </h3>
              <p className="text-xs text-zinc-500 mt-1">Show some of the best work you created in a document (PDF only).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-1 h-32 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-surface dark:bg-zinc-800 hover:border-sky-400 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors group">
              <UploadCloud className="w-6 h-6 text-zinc-300 dark:text-zinc-600 mb-2 group-hover:text-sky-500 transition-colors" />
              <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Browse PDF</span>
            </div>
          </div>
        </div>

      </div>

      {/* Sidebar - Guidelines & Quality */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        
        {/* Important Info */}
        <div className="bg-brand-50 dark:bg-brand-900/10 rounded-3xl border border-brand-100 dark:border-brand-900/30 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-brand-500" />
            <h3 className="font-bold text-brand-900 dark:text-brand-400">Media Policy</h3>
          </div>
          <p className="text-xs text-brand-700 dark:text-brand-300 leading-relaxed mb-4">
            To ensure the quality of our marketplace, all uploaded media must comply with Forte's Terms of Service.
          </p>
          <button className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline">Read full guidelines &rarr;</button>
        </div>

        {/* Guidelines Box */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Do's and Don'ts</h3>
          
          <div className="space-y-4">
            {GUIDELINES.map((guide, i) => (
              <div key={i} className="flex items-start gap-3">
                {guide.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                )}
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{guide.text}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
