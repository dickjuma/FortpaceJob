import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Play, VolumeX, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_VIDEOS = [
  {
    id: 1,
    author: 'Sarah W.',
    title: 'Senior React Developer',
    role: 'Frontend Engineering',
    videoThumb: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&w=600&q=80',
    description: 'Hi! I build scalable React applications for Enterprise clients. Available for onsite work in NY.',
    likes: '12.4k',
    comments: '342',
    verified: true
  },
  {
    id: 2,
    author: 'TechFlow Agency',
    title: 'Full Stack Development Team',
    role: 'SME Agency',
    videoThumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&w=600&q=80',
    description: 'We are a team of 15 engineers specialized in Node.js and AWS. We just completed a huge fintech migration.',
    likes: '8.2k',
    comments: '128',
    verified: true
  },
  {
    id: 3,
    author: 'Marcus T.',
    title: 'Master Electrician',
    role: 'Onsite Services',
    videoThumb: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&w=600&q=80',
    description: '10 years experience in commercial wiring. I travel within 50km of Austin, TX. Available for emergency dispatch.',
    likes: '45.1k',
    comments: '1.2k',
    verified: false
  }
];

const FreelancerVideoFeeds = () => {
  const [activeVideo, setActiveVideo] = useState(0);

  return (
    <>
      <div className="bg-black min-h-screen pt-4 pb-20 relative">
        <div className="container mx-auto max-w-md h-[calc(100vh-100px)] relative snap-y snap-mandatory overflow-y-scroll hide-scrollbar">
          
          {MOCK_VIDEOS.map((video, index) => (
            <div key={video.id} className="w-full h-full snap-start relative bg-surface-dark border border-zinc-800 rounded-3xl overflow-hidden mb-4">
              
              {/* Mock Video Player */}
              <img src={video.videoThumb} className="w-full h-full object-cover opacity-80" alt="Video Feed" />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90 pointer-events-none"></div>
              
              {/* Top Controls */}
              <div className="absolute top-6 left-0 right-0 flex justify-between px-6 z-10">
                <div className="bg-black/40 backdrop-blur px-4 py-1.5 rounded-full text-white font-bold text-sm border border-white/10">
                  Following | For You
                </div>
                <button className="w-10 h-10 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white border border-white/10">
                  <VolumeX className="w-5 h-5" />
                </button>
              </div>

              {/* Play Button Overlay (Mock) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
                <Play className="w-20 h-20 text-white/50" />
              </div>

              {/* Right Sidebar Actions */}
              <div className="absolute bottom-32 right-4 flex flex-col gap-6 z-10">
                <button className="group flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white group-hover:text-rose-500 transition-colors border border-white/10">
                    <Heart className="w-6 h-6 fill-current" />
                  </div>
                  <span className="text-white text-xs font-bold drop-shadow-md">{video.likes}</span>
                </button>
                <button className="group flex flex-col items-center gap-1">
                  <div className="w-12 h-12 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white group-hover:text-brand-500 transition-colors border border-white/10">
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
                
                {/* Profile Pic Action */}
                <div className="relative mt-2">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(video.author)}&background=random`} className="w-12 h-12 rounded-full border-2 border-white" alt="avatar" />
                  <div className="absolute -bottom-2 left-1/2 -tranzinc-x-1/2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white text-white font-bold cursor-pointer hover:bg-rose-600 transition-colors">
                    +
                  </div>
                </div>
              </div>

              {/* Bottom Info Section */}
              <div className="absolute bottom-0 left-0 right-16 p-6 z-10">
                <Link to="/profile" className="flex items-center gap-2 mb-2">
                  <h3 className="text-white font-black text-xl drop-shadow-lg hover:underline">{video.author}</h3>
                  {video.verified && <ShieldCheck className="w-5 h-5 text-brand-400 drop-shadow-md" />}
                </Link>
                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-white/20 backdrop-blur rounded text-white text-xs font-bold mb-3 border border-white/20">
                  {video.role}
                </div>
                <p className="text-white text-sm drop-shadow-md line-clamp-3 mb-4 leading-relaxed">
                  {video.description}
                </p>
                <div className="flex items-center gap-3">
                  <button className="flex-1 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-900/50 flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Hire Now
                  </button>
                  <button className="px-6 py-3 bg-white/10 backdrop-blur border border-white/20 hover:bg-white/20 text-white font-bold rounded-xl transition-colors">
                    Save
                  </button>
                </div>
              </div>

            </div>
          ))}

        </div>
      </div>
    </>
  );
};

export default FreelancerVideoFeeds;
