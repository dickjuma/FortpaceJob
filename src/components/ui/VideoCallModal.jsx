import React, { useEffect, useRef, useState } from 'react';
import { useSocket } from '../../common/context/SocketContext';
import { Phone, Video, Mic, MicOff, VideoOff, PhoneOff, Maximize, Minimize, User } from 'lucide-react';
import toast from 'react-hot-toast';

export default function VideoCallModal({
  isOpen,
  onClose,
  isIncoming,
  callerName,
  callerId,
  receiverId,
  conversationId,
  incomingCallId,
  callType = 'VIDEO'
}) {
  const { socket, isConnected } = useSocket();
  const [callStatus, setCallStatus] = useState(isIncoming ? 'INCOMING' : 'INITIATING'); // INCOMING, INITIATING, RINGING, CONNECTED
  const [callId, setCallId] = useState(incomingCallId || null);
  
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(callType === 'VIDEO');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  useEffect(() => {
    if (!isOpen) {
      cleanupCall();
      return;
    }

    if (isOpen && !isIncoming) {
      startCall();
    }
    
    return () => {
      cleanupCall();
    };
    // eslint-disable-next-line
  }, [isOpen]);

  // Socket Event Listeners
  useEffect(() => {
    if (!socket || !isConnected || !isOpen) return;

    const handleCallAccepted = async () => {
      setCallStatus('CONNECTED');
      await createOffer();
    };

    const handleCallRejected = () => {
      toast.error('Call declined');
      onClose();
    };

    const handleCallOffer = async ({ offer, callId: cId }) => {
      if (cId !== callId) return;
      await handleOffer(offer);
    };

    const handleCallAnswer = async ({ answer, callId: cId }) => {
      if (cId !== callId) return;
      await handleAnswer(answer);
    };

    const handleIceCandidate = async ({ candidate, callId: cId }) => {
      if (cId !== callId) return;
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('Error adding ICE candidate:', e);
        }
      }
    };

    const handleCallEnded = () => {
      toast('Call ended', { icon: '📞' });
      onClose();
    };

    socket.on('call_accepted', handleCallAccepted);
    socket.on('call_rejected', handleCallRejected);
    socket.on('call_offer', handleCallOffer);
    socket.on('call_answer', handleCallAnswer);
    socket.on('call_ice_candidate', handleIceCandidate);
    socket.on('call_ended', handleCallEnded);

    return () => {
      socket.off('call_accepted', handleCallAccepted);
      socket.off('call_rejected', handleCallRejected);
      socket.off('call_offer', handleCallOffer);
      socket.off('call_answer', handleCallAnswer);
      socket.off('call_ice_candidate', handleIceCandidate);
      socket.off('call_ended', handleCallEnded);
    };
    // eslint-disable-next-line
  }, [socket, isConnected, isOpen, callId]);

  // Setup Peer Connection & Media
  const setupMediaAndPeer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: callType === 'VIDEO', 
        audio: true 
      });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const peer = new RTCPeerConnection(iceServers);
      peerConnectionRef.current = peer;

      stream.getTracks().forEach(track => {
        peer.addTrack(track, stream);
      });

      peer.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
      };

      peer.onicecandidate = (event) => {
        if (event.candidate && callId) {
          socket.emit('call_ice_candidate', {
            callId,
            candidate: event.candidate,
            toUserId: isIncoming ? callerId : receiverId
          });
        }
      };

      return peer;
    } catch (err) {
      console.error('Media access error:', err);
      toast.error('Could not access camera/microphone');
      onClose();
    }
  };

  const startCall = async () => {
    await setupMediaAndPeer();
    setCallStatus('RINGING');
    
    // Initiate signaling
    socket.emit('call_initiate', { conversationId, receiverId, type: callType }, (res) => {
      if (res.success) {
        setCallId(res.callId);
      } else {
        toast.error('Failed to initiate call');
        onClose();
      }
    });
  };

  const acceptCall = async () => {
    await setupMediaAndPeer();
    setCallStatus('CONNECTED');
    socket.emit('call_accept', { callId, toUserId: callerId });
  };

  const rejectCall = () => {
    if (callId && callerId) {
      socket.emit('call_reject', { callId, toUserId: callerId });
    }
    onClose();
  };

  const endCall = () => {
    if (callId) {
      socket.emit('call_end', { callId, toUserId: isIncoming ? callerId : receiverId });
    }
    onClose();
  };

  const createOffer = async () => {
    try {
      const peer = peerConnectionRef.current;
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      socket.emit('call_offer', { callId, offer, toUserId: receiverId });
    } catch (err) {
      console.error('Error creating offer:', err);
    }
  };

  const handleOffer = async (offer) => {
    try {
      const peer = peerConnectionRef.current;
      await peer.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit('call_answer', { callId, answer, toUserId: callerId });
    } catch (err) {
      console.error('Error handling offer:', err);
    }
  };

  const handleAnswer = async (answer) => {
    try {
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    } catch (err) {
      console.error('Error handling answer:', err);
    }
  };

  const cleanupCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setCallStatus('INITIATING');
    setCallId(null);
  };

  const toggleMic = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
        setIsMicOn(!isMicOn);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className={`w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl relative transition-all duration-300 ${isFullscreen ? 'fixed inset-0 max-w-none rounded-none border-none' : ''}`}>
        
        {/* Call Header */}
        <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-start z-20 bg-gradient-to-b from-black/80 to-transparent">
          <div>
            <h3 className="text-xl font-black text-white">{isIncoming ? callerName : 'Freelancer'}</h3>
            <p className="text-sm font-bold text-zinc-300">{callStatus === 'CONNECTED' ? '00:00' : callStatus}</p>
          </div>
          <button onClick={() => setIsFullscreen(!isFullscreen)} className="w-10 h-10 rounded-full bg-zinc-800/80 backdrop-blur flex items-center justify-center text-white hover:bg-zinc-700 transition-colors">
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>

        {/* Video Area */}
        <div className="relative w-full aspect-video bg-zinc-900 flex items-center justify-center">
          
          {callStatus === 'INCOMING' ? (
            <div className="text-center animate-pulse">
              <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-success/30">
                {callType === 'VIDEO' ? <Video className="w-10 h-10 text-success" /> : <Phone className="w-10 h-10 text-success" />}
              </div>
              <h2 className="text-2xl font-black text-white">{callerName} is calling...</h2>
            </div>
          ) : callStatus === 'RINGING' ? (
            <div className="text-center">
              <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-success/30 animate-pulse">
                {callType === 'VIDEO' ? <Video className="w-10 h-10 text-success" /> : <Phone className="w-10 h-10 text-success" />}
              </div>
              <h2 className="text-2xl font-black text-white">Calling...</h2>
            </div>
          ) : (
            <>
              {/* Remote Video (Main) */}
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className={`w-full h-full object-cover ${!remoteStream && 'hidden'}`}
              />
              {!remoteStream && (
                <div className="text-center">
                  <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-zinc-500" />
                  </div>
                  <p className="text-zinc-500 font-bold">Waiting for video...</p>
                </div>
              )}

              {/* Local Video (PiP) */}
              <div className="absolute bottom-24 right-6 w-48 aspect-video bg-black rounded-xl overflow-hidden border-2 border-zinc-700 shadow-xl z-20">
                <video 
                  ref={localVideoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className={`w-full h-full object-cover ${!isVideoOn && 'hidden'}`}
                />
                {!isVideoOn && (
                  <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                    <User className="w-8 h-8 text-zinc-500" />
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        {/* Call Controls */}
        <div className="absolute bottom-0 inset-x-0 p-6 flex justify-center items-center gap-6 z-20 bg-gradient-to-t from-black/80 to-transparent">
          
          {callStatus === 'INCOMING' ? (
            <>
              <button onClick={rejectCall} className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                <PhoneOff className="w-6 h-6" />
              </button>
              <button onClick={acceptCall} className="w-14 h-14 rounded-full bg-success hover:bg-green-600 text-black flex items-center justify-center shadow-lg transition-transform hover:scale-110 animate-bounce">
                {callType === 'VIDEO' ? <Video className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
              </button>
            </>
          ) : (
            <>
              <button onClick={toggleMic} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${isMicOn ? 'bg-zinc-800/80 text-white hover:bg-zinc-700' : 'bg-red-500/80 text-white hover:bg-red-600'}`}>
                {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>
              <button onClick={endCall} className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/20 transition-transform hover:scale-110">
                <PhoneOff className="w-6 h-6" />
              </button>
              {callType === 'VIDEO' && (
                <button onClick={toggleVideo} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${isVideoOn ? 'bg-zinc-800/80 text-white hover:bg-zinc-700' : 'bg-red-500/80 text-white hover:bg-red-600'}`}>
                  {isVideoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
