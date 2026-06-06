// src/pages/freelancer/GigVideoUploadPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video, UploadCloud, PlayCircle, Settings,
  Wand2, Subtitles, CheckCircle2, AlertCircle,
  Clock, Trash2, Maximize2, Check
} from 'lucide-react';

export default function GigVideoUploadPage() {
  const [video, setVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnail, setThumbnail] = useState(0);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [showSuccess, setShowSuccess] = useState(null);

  const handleUpload = () => {
    setVideo('uploading');
    let p = 0;
    const interval = setInterval(() => {
      p += 10;
      setUploadProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setVideo({
          url: 'https://example.com/mock-video.mp4',
          name: 'promotional_video_final.mp4',
          duration: '01:14'
        });
        setShowSuccess({ message: 'Video uploaded successfully' });
        setTimeout(() => {
          setAiAnalysis({
            quality: '1080p HD',
            lighting: 'Good',
            audio: 'Clear',
            pacing: 'Optimal'
          });
        }, 1500);
        setTimeout(() => setShowSuccess(null), 3000);
      }
    }, 200);
  };

  const removeVideo = () => {
    setVideo(null);
    setUploadProgress(0);
    setAiAnalysis(null);
    setShowSuccess({ message: 'Video removed' });
    setTimeout(() => setShowSuccess(null), 2000);
  };

  const thumbnails = [
    'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80',
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80'
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full">

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-4 z-50 bg-accent-dark text-white px-4 py-3 rounded-lg shadow-md font-body text-sm flex items-center gap-2"
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
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-accent-light rounded-xl">
              <Video className="w-5 h-5 text-accent DEFAULT" />
            </div>
            <h2 className="font-display font-semibold text-lg text-brand-900">Promotional video</h2>
          </div>
          <p className="text-sm font-body text-ink-secondary">
            A promotional video can increase your gig's conversion rate by up to 200%. It's your chance to personally pitch your services.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">

          {/* Main Video Area */}
          <div className="p-6 border-b border-border bg-surface-soft">
            {!video ? (
              <div
                onClick={handleUpload}
                className="aspect-video w-full rounded-xl border-2 border-dashed border-border bg-white flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-accent DEFAULT group transition-all"
              >
                <div className="w-16 h-16 bg-surface-soft rounded-full flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-8 h-8 text-ink-tertiary group-hover:text-accent DEFAULT transition-colors" />
                </div>
                <h3 className="font-body font-semibold text-lg text-ink-primary mb-1">Upload video</h3>
                <p className="text-sm text-ink-secondary max-w-sm mb-4">Drag & drop your video file here or browse</p>
                <div className="flex items-center gap-4 text-xs font-body font-medium text-ink-tertiary">
                  <span>MP4 or AVI</span>
                  <span>Max 50MB</span>
                  <span>Under 75 seconds</span>
                </div>
              </div>
            ) : video === 'uploading' ? (
              <div className="aspect-video w-full rounded-xl border border-border bg-brand-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-800 to-transparent" />
                <div className="relative z-10 w-full max-w-sm">
                  <h3 className="text-white font-body font-semibold mb-3">Processing video...</h3>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden mb-2">
                    <motion.div className="h-full bg-accent DEFAULT rounded-full" animate={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span className="text-xs font-mono text-accent-light">{uploadProgress}% complete</span>
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full rounded-xl border border-border bg-black relative group overflow-hidden shadow-sm">
                <img
                  src={thumbnails[thumbnail]}
                  alt="Video preview"
                  className="w-full h-full object-cover opacity-80"
                  width={800}
                  height={450}
                />

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button className="w-14 h-14 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-transform hover:scale-105">
                    <PlayCircle className="w-7 h-7 text-white ml-0.5" />
                  </button>
                </div>

                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={removeVideo} className="p-1.5 bg-danger/80 hover:bg-danger rounded-lg text-white transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/60 px-2 py-1 rounded-md text-white text-xs font-body flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {video.duration}
                  </div>
                  <button className="p-1 bg-black/60 rounded-md text-white transition-colors">
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Video Settings */}
          <AnimatePresence>
            {video && video !== 'uploading' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-6"
              >
                <h3 className="font-body font-semibold text-lg text-ink-primary mb-5 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-accent DEFAULT" /> Video settings
                </h3>

                <div className="space-y-6">

                  {/* Thumbnails */}
                  <div>
                    <label className="text-sm font-body font-medium text-ink-primary block mb-3">Select thumbnail</label>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {thumbnails.map((url, idx) => (
                        <div
                          key={idx}
                          onClick={() => setThumbnail(idx)}
                          className={`w-32 aspect-video rounded-lg border-2 overflow-hidden cursor-pointer shrink-0 transition-all ${
                            thumbnail === idx
                              ? "border-accent DEFAULT shadow-sm"
                              : "border-border opacity-60 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={url}
                            alt={`Thumbnail ${idx + 1}`}
                            className="w-full h-full object-cover"
                            width={128}
                            height={72}
                          />
                        </div>
                      ))}
                      <div className="w-32 aspect-video rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-ink-tertiary cursor-pointer hover:border-accent DEFAULT hover:text-accent DEFAULT shrink-0 transition-all">
                        <UploadCloud className="w-5 h-5 mb-1" />
                        <span className="text-xs font-body">Custom</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtitles Toggle */}
                  <div className="flex items-center justify-between p-4 bg-surface-soft rounded-xl border border-border">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-accent-light rounded-lg shrink-0">
                        <Subtitles className="w-5 h-5 text-accent DEFAULT" />
                      </div>
                      <div>
                        <h4 className="text-sm font-body font-semibold text-ink-primary">Auto-generate subtitles</h4>
                        <p className="text-xs text-ink-tertiary">Increase engagement for viewers watching on mute</p>
                      </div>
                    </div>
                    <div
                      onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                      className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer shrink-0 ${
                        subtitlesEnabled ? "bg-accent DEFAULT" : "bg-border"
                      }`}
                    >
                      <motion.div
                        className="w-4 h-4 bg-white rounded-full shadow-sm"
                        animate={{ x: subtitlesEnabled ? 20 : 0 }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0 space-y-5">

        {/* AI Analysis */}
        <div className="bg-white border border-border rounded-2xl p-5 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-2 mb-5">
            <Wand2 className="w-5 h-5 text-accent DEFAULT" />
            <h3 className="font-body font-semibold text-ink-primary">Video analysis</h3>
          </div>

          {!video || video === 'uploading' ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-border animate-spin flex items-center justify-center mx-auto mb-3">
                <Wand2 className="w-4 h-4 text-ink-tertiary" />
              </div>
              <p className="text-xs font-body text-ink-tertiary">Upload a video to get feedback on quality and audio</p>
            </div>
          ) : !aiAnalysis ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-5 w-full bg-surface-muted rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-xs font-body text-ink-secondary">Resolution</span>
                <span className="text-xs font-body font-medium text-accent-dark bg-accent-light px-2 py-0.5 rounded-full">
                  {aiAnalysis.quality}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-xs font-body text-ink-secondary">Lighting</span>
                <span className="text-xs font-body font-medium text-accent-dark bg-accent-light px-2 py-0.5 rounded-full">
                  {aiAnalysis.lighting}
                </span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-xs font-body text-ink-secondary">Audio clarity</span>
                <span className="text-xs font-body font-medium text-accent-dark bg-accent-light px-2 py-0.5 rounded-full">
                  {aiAnalysis.audio}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-body text-ink-secondary">Pacing</span>
                <span className="text-xs font-body font-medium text-accent-dark bg-accent-light px-2 py-0.5 rounded-full">
                  {aiAnalysis.pacing}
                </span>
              </div>

              <div className="mt-4 p-3 bg-accent-light rounded-lg border border-accent DEFAULT">
                <p className="text-xs text-accent-dark font-body">
                  Your video meets marketplace standards and is optimized for conversion.
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Guidelines */}
        <div className="bg-surface-soft border border-border rounded-2xl p-5">
          <h3 className="text-sm font-body font-semibold text-ink-primary mb-3">Video guidelines</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warn shrink-0 mt-0.5" />
              <p className="text-xs text-ink-secondary">Keep it between <strong className="text-ink-primary">30 to 75 seconds</strong></p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warn shrink-0 mt-0.5" />
              <p className="text-xs text-ink-secondary">Show your face for <strong className="text-ink-primary">40% better conversion</strong></p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-warn shrink-0 mt-0.5" />
              <p className="text-xs text-ink-secondary">Use good lighting and clear audio</p>
            </div>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="bg-accent-light border border-accent DEFAULT rounded-xl p-4">
          <h4 className="text-sm font-body font-semibold text-accent-dark mb-1">Pro tip</h4>
          <p className="text-xs text-accent-dark">
            Videos with a personal introduction and clear demonstration of your skills get the most orders.
          </p>
        </div>
      </div>
    </div>
  );
}
