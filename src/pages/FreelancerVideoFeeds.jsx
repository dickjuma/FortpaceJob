import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Heart, MessageCircle, Share2, Play, VolumeX, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { workAPI } from '../common/services/api';

function normalizeVideos(response) {
  const raw = response?.data ?? response?.items ?? response ?? [];
  return Array.isArray(raw) ? raw : [];
}

const FreelancerVideoFeeds = () => {
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['video-feed'],
    queryFn: () => workAPI.getVideoFeed(),
    select: normalizeVideos,
    staleTime: 120_000,
  });

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-[#4C1D95]" />
      </div>
    );
  }

  const feed = videos.length ? videos : [];

  return (
    <>
      <div className="bg-black min-h-screen pt-4 pb-20 relative">
        <div className="container mx-auto max-w-md h-[calc(100vh-100px)] relative snap-y snap-mandatory overflow-y-scroll hide-scrollbar">
          {feed.length === 0 ? (
            <div className="flex items-center justify-center h-full text-zinc-400 text-sm">
              No video profiles available yet.
            </div>
          ) : (
            feed.map((video) => (
              <div key={video.id} className="w-full h-full snap-start relative bg-surface-dark border border-zinc-800 rounded-3xl overflow-hidden mb-4">
                <img
                  src={video.videoThumb || video.thumbnail}
                  className="w-full h-full object-cover opacity-80"
                  alt="Video Feed"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none" />

                <div className="absolute top-6 left-0 right-0 flex justify-between px-6 z-10">
                  <div className="bg-black/40 backdrop-blur px-4 py-1.5 rounded-full text-white font-bold text-sm border border-white/10">
                    Following | For You
                  </div>
                  <button className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/10">
                    <VolumeX className="w-5 h-5" />
                  </button>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="w-20 h-20 text-white/50" />
                </div>

                <div className="absolute bottom-32 right-4 flex flex-col gap-6 z-10">
                  <button className="group flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white group-hover:text-rose-500 transition-colors border border-white/10">
                      <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-white text-xs font-bold drop-shadow-md">{video.likes}</span>
                  </button>
                  <button className="group flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white group-hover:text-[#4C1D95] transition-colors border border-white/10">
                      <MessageCircle className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-white text-xs font-bold drop-shadow-md">{video.comments}</span>
                  </button>
                  <button className="group flex flex-col items-center gap-1">
                    <div className="w-12 h-12 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white group-hover:text-success transition-colors border border-white/10">
                      <Share2 className="w-6 h-6" />
                    </div>
                    <span className="text-white text-xs font-bold drop-shadow-md">Share</span>
                  </button>

                  <div className="relative mt-2">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(video.author)}&background=random`}
                      className="w-12 h-12 rounded-full border-2 border-white"
                      alt="avatar"
                    />
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white text-white font-bold cursor-pointer hover:bg-rose-600 transition-colors">
                      +
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-16 p-6 z-10">
                  <Link to={video.profilePath || '/profile'} className="flex items-center gap-2 mb-2">
                    <h3 className="text-white font-black text-xl drop-shadow-lg hover:underline">{video.author}</h3>
                    {video.verified && <ShieldCheck className="w-5 h-5 text-[#4C1D95] drop-shadow-md" />}
                  </Link>
                  <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/20 backdrop-blur rounded text-white text-xs font-bold mb-3 border border-white/20">
                    {video.title || video.role}
                  </div>
                  <p className="text-white text-sm drop-shadow-md line-clamp-3 mb-4 leading-relaxed">
                    {video.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <button className="flex-1 py-3 bg-[#4C1D95] hover:bg-[#22C55E] text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Hire Now
                    </button>
                    <button className="px-6 py-3 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl transition-colors">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default FreelancerVideoFeeds;


