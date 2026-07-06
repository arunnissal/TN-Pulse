import { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Check } from 'lucide-react';

interface LiveCameraProps {
  onCapture: (base64Image: string) => void;
}

export default function LiveCamera({ onCapture }: LiveCameraProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      setStream(mediaStream);
      setIsActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsActive(false);
  };

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const base64Data = canvas.toDataURL('image/jpeg', 0.8);
        setPhoto(base64Data);
        stopCamera();
      }
    }
  };

  const confirmPhoto = () => {
    if (photo) {
      onCapture(photo);
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Assign stream to video element when it becomes active
  useEffect(() => {
    if (isActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isActive, stream]);

  if (photo) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black aspect-video flex items-center justify-center group">
        <img src={photo} alt="Captured proof" className="w-full h-full object-contain" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
          <button 
            type="button" 
            onClick={retakePhoto}
            className="p-3 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
          >
            <RefreshCw className="w-6 h-6" />
          </button>
          <button 
            type="button" 
            onClick={confirmPhoto}
            className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-colors"
          >
            <Check className="w-6 h-6" />
          </button>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black aspect-video flex flex-col">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-6">
          <button 
            type="button"
            onClick={stopCamera}
            className="p-3 bg-red-500/80 hover:bg-red-500 text-white rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <button 
            type="button"
            onClick={takePhoto}
            className="w-16 h-16 bg-white/30 border-4 border-white rounded-full hover:bg-white/50 transition-colors"
          ></button>
          <div className="w-11"></div> {/* Spacer to center the capture button */}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={startCamera}
      className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2"
    >
      <Camera className="w-8 h-8 text-slate-400" />
      <span className="text-sm font-medium text-primary-600">Add Proof (Live Camera)</span>
      <span className="text-xs text-slate-500">Take a live photo of the issue</span>
    </div>
  );
}
