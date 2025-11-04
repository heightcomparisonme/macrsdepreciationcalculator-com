'use client';

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

interface VideoOption {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string;
}

const VideoBackground = () => {
  const locale = useLocale();
  
  const videoOptions: VideoOption[] = [
    {
      id: "1",
      title: locale === 'zh' ? "超现实主义梦境世界" : "Surrealist Dream World",
      thumbnail: "https://meterial.dreamega.ai/meterial/showcase/video/veo3/z0JMiIuTPISCSTmhGgwKyODoUZvFKy.avif",
      videoUrl: "https://static.supermaker.ai/banner-2.mp4"
    },
    {
      id: "2", 
      title: locale === 'zh' ? "抽象视觉" : "Abstract Vision",
      thumbnail: "https://meterial.dreamega.ai/meterial/showcase/video/veo3/p2Wb3cSjpQOqR5E8YpViLKVvR0xAxp.avif",
      videoUrl: "https://static.supermaker.ai/banner-2.mp4"
    },
    {
      id: "3",
      title: locale === 'zh' ? "宇宙之旅" : "Cosmic Journey",
      thumbnail: "https://meterial.dreamega.ai/meterial/showcase/video/veo3/oAmj6jo7wmOsK9wVR9m6qvrfxHoiLO.avif", 
      videoUrl: "https://static.supermaker.ai/banner-2.mp4"
    },
    {
      id: "4",
      title: locale === 'zh' ? "自然交响曲" : "Nature Symphony",
      thumbnail: "https://meterial.dreamega.ai/meterial/showcase/video/veo3/lzPI5al9svesl9JiFfoRU9GpOX9YAm.avif",
      videoUrl: "https://static.supermaker.ai/banner-2.mp4"
    },
    {
      id: "5",
      title: locale === 'zh' ? "都市梦想" : "Urban Dreams",
      thumbnail: "https://meterial.dreamega.ai/meterial/showcase/video/veo3/gqamg6XMoNszR2P7b2OORYwkvDLtpl.avif",
      videoUrl: "https://static.supermaker.ai/banner-2.mp4"
    },
    {
      id: "6",
      title: locale === 'zh' ? "海洋深处" : "Ocean Depths",
      thumbnail: "https://meterial.dreamega.ai/meterial/showcase/video/veo3/bpCvQHZiZHbMHhBplERKNpcwDrbp8p.avif",
      videoUrl: "https://static.supermaker.ai/banner-2.mp4"
    }
  ];

  const [activeVideo, setActiveVideo] = useState<VideoOption>(videoOptions[0]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [isPlaying, activeVideo]);

  const handleVideoSelect = (video: VideoOption) => {
    setActiveVideo(video);
    setShowPreview(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  return (
    <>
      {/* Fullscreen Video Background */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          key={activeVideo.id}
        >
          <source src={activeVideo.videoUrl} type="video/mp4" />
        </video>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-hero-bg/40 via-hero-bg/60 to-hero-bg/90" />
      </div>

      {/* Video Controls - Top Right */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={togglePlay}
          className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleMute}
          className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
          className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40 px-3"
        >
          {locale === 'zh' ? '更换背景' : 'Change Background'}
        </Button>
      </div>

      {/* Video Preview Panel */}
      {showPreview && (
        <div className="absolute top-20 right-6 z-40 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-80">
          <div className="grid grid-cols-2 gap-3">
            {videoOptions.map((video) => (
              <div
                key={video.id}
                className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  activeVideo.id === video.id 
                    ? 'ring-2 ring-golden shadow-golden' 
                    : 'hover:ring-1 hover:ring-white/50'
                }`}
                onClick={() => handleVideoSelect(video)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-20 object-cover"
                />
                
                {/* Play Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <Play className="w-6 h-6 text-white" />
                </div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-xs font-medium truncate">
                    {video.title}
                  </p>
                </div>
                
                {/* Active Indicator */}
                {activeVideo.id === video.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-golden rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(false)}
            className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-black/60 text-white hover:bg-black/80 rounded-full"
          >
            ×
          </Button>
        </div>
      )}
    </>
  );
};

export default VideoBackground;
