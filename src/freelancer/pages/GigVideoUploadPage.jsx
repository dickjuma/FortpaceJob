import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Video, UploadCloud, PlayCircle, Settings, 
  Wand2, Subtitles, CheckCircle2, AlertCircle,
  Clock, Trash2, Maximize2
} from 'lucide-react';
import { cn } from '../../admin/utils/cn';

export default function GigVideoUploadPage() {
  const [video, setVideo] = useState(null); // null, 'uploading', { url, name, duration }
  const [uploadProgress, setUploadProgress] = useState(0);
  const [thumbnail, setThumbnail] = useState(0); // index 0, 1, 2
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

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
        
        // Simulate AI analysis delay
        setTimeout(() => {
          setAiAnalysis({
            quality: '1080p HD',
            lighting: 'Good',
            audio: 'Clear',
            pacing: 'Optimal'
          });
        }, 1500);
      }
    }, 200);
  };

  const removeVideo = () => {
    setVideo(null);
    setUploadProgress(0);
    setAiAnalysis(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start w-full font-sans">
      
      {/* Main Form Area */}
      <div className="flex-1 w-full space-y-8">
        
        {/* Header Block */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Promotional Video</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            A promotional video can increase your gig's visibility and conversion rate by up to 200%. It's your chance to personally pitch your services.
          </p>
        </div>

        {/* Studio Upload Section */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          
          {/* Main Video Area */}
          <div className="p-8 border-b border-zinc-100 dark:border-zinc-800 bg-surface/50 dark:bg-surface-dark/50">
            {!video ? (
              <div 
                onClick={handleUpload}
                className="aspect-video w-full rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex flex-col items-center justify-center p-6 text-center cursor-pointer hover:border-#14a800] group transition-all"
              >
                <div className="w-16 h-16 bg-zinc-100 dark:bg-surface-dark rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-#14a800] transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-1">Upload Video</h3>
                <p className="text-sm text-zinc-500 max-w-sm mb-4">Drag & drop your video file here or browse from your computer.</p>
                <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                  <span>MP4 or AVI</span>
                  <span>Max 50MB</span>
                  <span>Under 75 seconds</span>
                </div>
              </div>
            ) : video === 'uploading' ? (
              <div className="aspect-video w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-surface-dark flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/40 to-transparent" />
                <div className="relative z-10 w-full max-w-sm">
                  <h3 className="text-white font-bold mb-4">Processing Video...</h3>
                  <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                    <motion.div className="h-full bg-#14a800] rounded-full" animate={{ width: `${uploadProgress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-violet-300">{uploadProgress}% complete</span>
                </div>
              </div>
            ) : (
              <div className="aspect-video w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-black relative group overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=1200&q=80" alt="Video Preview" className="w-full h-full object-cover opacity-80" />
                
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button className="w-16 h-16 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-transform hover:scale-110">
                    <PlayCircle className="w-8 h-8 text-white ml-1" />
                  </button>
                </div>

                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={removeVideo} className="p-2 bg-rose-500/80 hover:bg-rose-500 backdrop-blur-md rounded-lg text-white transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-white text-xs font-bold flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" /> {video.duration}
                  </div>
                  <button className="p-1.5 bg-black/60 backdrop-blur-md rounded-lg text-white transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Video Settings (Only show if video uploaded) */}
          <AnimatePresence>
            {video && video !== 'uploading' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="p-8">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-zinc-400" /> Video Settings
                </h3>

                <div className="space-y-8">
                  
                  {/* Thumbnails */}
                  <div>
                    <label className="text-sm font-bold text-zinc-700 dark:text-zinc-300 block mb-3">Select Thumbnail</label>
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                      {[
                        'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=400&q=80',
                        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
                        'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80'
                      ].map((url, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setThumbnail(idx)}
                          className={cn(
                            "w-40 aspect-video rounded-xl border-2 overflow-hidden cursor-pointer shrink-0 transition-all",
                            thumbnail === idx ? "border-#14a800] shadow-md scale-105" : "border-transparent opacity-60 hover:opacity-100"
                          )}
                        >
                          <img src={url} alt={`Thumbnail ${idx+1}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                      <div className="w-40 aspect-video rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex flex-col items-center justify-center text-zinc-400 cursor-pointer hover:border-violet-400 hover:text-#14a800] shrink-0">
                        <UploadCloud className="w-5 h-5 mb-1" />
                        <span className="text-xs font-bold">Custom</span>
                      </div>
                    </div>
                  </div>

                  {/* Subtitles Toggle */}
                  <div className="flex items-center justify-between p-4 bg-surface dark:bg-zinc-800/50 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-violet-100 dark:bg-#14a800]/20 rounded-lg shrink-0">
                        <Subtitles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900 dark:text-white">Auto-generate Subtitles</h4>
                        <p className="text-xs text-zinc-500">Increase engagement for viewers watching on mute. (English only)</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
                      className={cn(
                        "w-12 h-6 rounded-full transition-colors relative flex items-center p-1 cursor-pointer shrink-0",
                        subtitlesEnabled ? "bg-#14a800]" : "bg-zinc-200 dark:bg-zinc-700"
                      )}
                    >
                      <motion.div layout className="w-4 h-4 bg-white rounded-full shadow-sm" animate={{ x: subtitlesEnabled ? 24 : 0 }} />
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Sidebar - AI Analysis & Tips */}
      <div className="w-full lg:w-80 shrink-0 space-y-6">
        
        {/* AI Video Quality Analysis */}
        <div className="bg-white dark:bg-surface-dark rounded-3xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-#14a800]/10 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-center gap-2 mb-6">
            <Wand2 className="w-5 h-5 text-#14a800]" />
            <h3 className="font-bold text-zinc-900 dark:text-white">AI Studio Analysis</h3>
          </div>

          {!video || video === 'uploading' ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-200 dark:border-zinc-700 animate-[spin_3s_linear_infinite] flex items-center justify-center mx-auto mb-3">
                <Wand2 className="w-4 h-4 text-zinc-300 dark:text-zinc-600 animate-pulse" />
              </div>
              <p className="text-xs font-medium text-zinc-500">Upload a video to get instant AI feedback on quality, lighting, and audio.</p>
            </div>
          ) : !aiAnalysis ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-6 w-full bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-500">Resolution</span>
                <span className="text-xs font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {aiAnalysis.quality}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-500">Lighting</span>
                <span className="text-xs font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {aiAnalysis.lighting}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <span className="text-xs font-semibold text-zinc-500">Audio Clarity</span>
                <span className="text-xs font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {aiAnalysis.audio}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-500">Pacing</span>
                <span className="text-xs font-bold text-success flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> {aiAnalysis.pacing}</span>
              </div>

              <div className="mt-4 p-3 bg-violet-50 dark:bg-#14a800]/10 rounded-xl border border-violet-100 dark:border-#14a800]/20">
                <p className="text-xs text-violet-700 dark:text-violet-300 font-medium">Your video meets all marketplace standards and is optimized for high conversion.</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Studio Guidelines */}
        <div className="bg-surface dark:bg-zinc-800/50 rounded-3xl p-6 border border-zinc-200 dark:border-zinc-700/50">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-white mb-4">Video Guidelines</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Keep it between <strong className="text-zinc-900 dark:text-white">30 to 75 seconds</strong>.</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Mention <strong className="text-zinc-900 dark:text-white">Forte Marketplace</strong> directly to build trust.</p>
            </div>
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Show your face! Videos with a personal intro convert <strong className="text-zinc-900 dark:text-white">40% better</strong>.</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
