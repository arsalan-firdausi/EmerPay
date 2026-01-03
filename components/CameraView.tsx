import React, { useEffect, useRef } from 'react';

interface CameraViewProps {
  type: 'front' | 'rear';
  isActive: boolean;
  overlayText?: string;
  onError?: (error: string) => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ type, isActive, overlayText, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      // In a real app we would requestPermissions
      // For demo, we try to access or fallback to a placeholder color
      navigator.mediaDevices.getUserMedia({ video: { facingMode: type === 'front' ? 'user' : 'environment' } })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play().catch(e => console.log("Auto-play prevented", e));
          }
        })
        .catch(err => {
          console.warn("Camera access denied or unavailable", err);
          if (onError) onError("Camera access denied. Please enable permissions.");
        });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, type, onError]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 z-0 bg-black overflow-hidden">
       <video 
        ref={videoRef} 
        className={`w-full h-full object-cover opacity-80 ${type === 'front' ? 'scale-x-[-1]' : ''}`} 
        playsInline 
        muted 
      />
      {/* Fallback styling if camera doesn't load */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none"></div>
      
      {/* Overlay UI */}
      {overlayText && (
        <div className="absolute top-20 left-0 w-full text-center pointer-events-none">
          <p className="inline-block px-4 py-2 rounded-full bg-black/50 text-emerald-300 text-sm font-medium backdrop-blur-md border border-emerald-500/30">
            {overlayText}
          </p>
        </div>
      )}

      {/* Grid Lines for "Scanning" vibe */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-1/3 border-b border-white/30"></div>
        <div className="w-full h-1/3 top-1/3 absolute border-b border-white/30"></div>
        <div className="h-full w-1/3 left-1/3 absolute border-r border-white/30 top-0"></div>
        <div className="h-full w-1/3 right-1/3 absolute border-r border-white/30 top-0"></div>
      </div>
    </div>
  );
};