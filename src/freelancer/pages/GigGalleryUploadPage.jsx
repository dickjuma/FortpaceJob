// src/pages/freelancer/GigGalleryUploadPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, Image as ImageIcon, FileText, Video,
  Trash2, Star, Info, CheckCircle2, AlertCircle,
  Move, PlayCircle, Check
} from 'lucide-react';

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
  const [showSuccess, setShowSuccess] = useState(null);

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

    if (images.length >= 3) {
      setShowSuccess({ message: 'Maximum 3 images allowed', isError: true });
      setTimeout(() => setShowSuccess(null), 2000);
      return;
    }

    const newId = `img_${Date.now()}`;
    setImages(prev => [...prev, { id: newId, url: '', isCover: prev.length === 0, progress: 0 }]);

    let p = 0;
    const interval = setInterval(() => {
      p += 20;
      setImages(prev => prev.map(img => img.id === newId ? { ...img, progress: p, url: p === 100 ? 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80' : '' } : img));
      if (p >= 100) {
        clearInterval(interval);
        setShowSuccess({ message: 'Image uploaded successfully' });
        setTimeout(() => setShowSuccess(null), 2000);
      }
    }, 300);
  };

  const setAsCover = (id) => {
    setImages(prev => prev.map(img => ({ ...img, isCover: img.id === id })));
    setShowSuccess({ message: 'Cover image updated' });
    setTimeout(() => setShowSuccess(null), 1500);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(i => i.isCover)) {
        filtered[0].isCover = true;
      }
      setShowSuccess({ message: 'Image removed' });
      setTimeout(() => setShowSuccess(null), 1500);
      return filtered;
    });
  };

  const handleAddVideo = () => {
    setShowSuccess({ message: 'Video upload would open here' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const handleAddDocument = () => {
    setShowSuccess({ message: 'Document upload would open here' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2 ${
              showSuccess.isError ? 'bg-danger text-white' : 'bg-accent-dark text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            {showSuccess.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form Area */}
      <div className="flex-1 w-full space-y-6">

        {/* Header */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="font-display font-semibold text-lg text-brand-900 mb-1">Gig gallery</h2>
          <p className="text-sm font-body text-ink-secondary">
            Showcase your services with visual examples. The first image will be your gig cover.
          </p>
        </div>

        {/* Images Upload Section */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h3 className="font-body font-semibold text-lg text-ink-primary flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-accent DEFAULT" /> Images (up to 3)
              </h3>
              <p className="text-xs font-body text-ink-tertiary mt-1">
                Get noticed with visual examples of your services
              </p>
            </div>
            <span className="text-sm font-mono font-semibold text-ink-tertiary">{images.length}/3</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Upload Zone */}
            {images.length < 3 && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`aspect-[4/3] rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-accent DEFAULT bg-accent-light"
                    : "border-border bg-surface-soft hover:border-accent DEFAULT hover:bg-accent-light"
                }`}
              >
                <UploadCloud className={`w-8 h-8 mb-2 transition-colors ${
                  isDragging ? "text-accent DEFAULT" : "text-ink-tertiary"
                }`} />
                <span className="text-sm font-body font-medium text-ink-primary">Drag & drop</span>
                <span className="text-xs font-body text-ink-tertiary mt-1">or browse files</span>
              </div>
            )}

            {/* Uploaded Images */}
            <AnimatePresence>
              {images.map(img => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  key={img.id}
                  className={`aspect-[4/3] rounded-xl border-2 relative overflow-hidden group ${
                    img.isCover ? "border-accent DEFAULT shadow-sm" : "border-border"
                  }`}
                >
                  {img.progress < 100 ? (
                    <div className="absolute inset-0 bg-surface-muted flex flex-col items-center justify-center p-4">
                      <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mb-2">
                        <motion.div
                          className="h-full bg-accent DEFAULT rounded-full"
                          animate={{ width: `${img.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-medium text-ink-tertiary">
                        Uploading {img.progress}%
                      </span>
                    </div>
                  ) : (
                    <>
                      <img
                        src={img.url}
                        alt="Gig portfolio"
                        className="w-full h-full object-cover"
                        width={800}
                        height={600}
                      />

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                        <div className="flex justify-between">
                          <button className="p-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white transition-colors cursor-grab">
                            <Move className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => removeImage(img.id)}
                            className="p-1.5 bg-danger/80 hover:bg-danger rounded-lg text-white transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {!img.isCover && (
                          <button
                            onClick={() => setAsCover(img.id)}
                            className="w-full py-1.5 bg-white/20 hover:bg-white/40 rounded-lg text-white text-xs font-body font-medium transition-colors"
                          >
                            Set as cover
                          </button>
                        )}
                      </div>

                      {img.isCover && (
                        <div className="absolute top-2 left-2 bg-accent DEFAULT text-white text-xs font-body font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
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
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h3 className="font-body font-semibold text-lg text-ink-primary flex items-center gap-2">
                <Video className="w-5 h-5 text-accent DEFAULT" /> Video (1 only)
              </h3>
              <p className="text-xs font-body text-ink-tertiary mt-1">
                Gigs with videos get more orders
              </p>
            </div>
          </div>

          {videos.length === 0 ? (
            <div
              onClick={handleAddVideo}
              className="w-full h-32 rounded-xl border-2 border-dashed border-border bg-surface-soft hover:border-accent DEFAULT hover:bg-accent-light flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <PlayCircle className="w-10 h-10 text-ink-tertiary mb-2 group-hover:text-accent DEFAULT transition-colors" />
              <span className="text-sm font-body font-medium text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                Add a video
              </span>
              <span className="text-xs font-body text-ink-tertiary mt-1">MP4, max 50MB, under 75 seconds</span>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-ink-secondary">Video uploaded</p>
            </div>
          )}
        </div>

        {/* Document Upload Section */}
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h3 className="font-body font-semibold text-lg text-ink-primary flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent DEFAULT" /> Documents (up to 2)
              </h3>
              <p className="text-xs font-body text-ink-tertiary mt-1">
                Show your best work in PDF format
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={handleAddDocument}
              className="h-28 rounded-xl border-2 border-dashed border-border bg-surface-soft hover:border-accent DEFAULT hover:bg-accent-light flex flex-col items-center justify-center cursor-pointer transition-all group"
            >
              <UploadCloud className="w-6 h-6 text-ink-tertiary mb-2 group-hover:text-accent DEFAULT transition-colors" />
              <span className="text-sm font-body font-medium text-ink-primary group-hover:text-accent DEFAULT transition-colors">
                Browse PDF
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-5">

        {/* Media Policy */}
        <div className="bg-accent-light border border-accent DEFAULT rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-accent-dark" />
            <h3 className="font-body font-semibold text-accent-dark">Media policy</h3>
          </div>
          <p className="text-xs text-accent-dark leading-relaxed mb-4">
            All uploaded media must comply with Forte's Terms of Service.
          </p>
          <button className="text-xs font-body font-medium text-accent-dark hover:text-accent-dark/80 transition-colors">
            Read full guidelines →
          </button>
        </div>

        {/* Guidelines Box */}
        <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
          <h3 className="font-body font-semibold text-ink-primary mb-4">Do's and don'ts</h3>

          <div className="space-y-3">
            {GUIDELINES.map((guide, i) => (
              <div key={i} className="flex items-start gap-2">
                {guide.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-accent DEFAULT shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-danger shrink-0 mt-0.5" />
                )}
                <span className="text-xs font-body text-ink-secondary">{guide.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tip */}
        <div className="bg-surface-soft border border-border rounded-xl p-4">
          <h4 className="text-sm font-body font-semibold text-ink-primary mb-2">Pro tip</h4>
          <p className="text-xs text-ink-secondary">
            Use high-quality, professional images that accurately represent your work. The first image is your gig's first impression.
          </p>
        </div>
      </div>
    </div>
  );
}
