'use client';

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";

interface ImageOption {
  id: string;
  title: string;
  url: string;
  category: string;
}

const ImageBackground = () => {
  const locale = useLocale();
  
  const imageOptions: ImageOption[] = [
    {
      id: "1",
      title: locale === 'zh' ? "城市天际线" : "City Skyline",
      url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&h=1080&fit=crop&crop=center",
      category: "urban"
    },
    {
      id: "2",
      title: locale === 'zh' ? "自然风光" : "Natural Landscape",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&crop=center",
      category: "nature"
    },
    {
      id: "3",
      title: locale === 'zh' ? "抽象艺术" : "Abstract Art",
      url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1920&h=1080&fit=crop&crop=center",
      category: "abstract"
    },
    {
      id: "4",
      title: locale === 'zh' ? "科技未来" : "Tech Future",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1920&h=1080&fit=crop&crop=center",
      category: "tech"
    },
    {
      id: "5",
      title: locale === 'zh' ? "海洋深处" : "Ocean Depths",
      url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1920&h=1080&fit=crop&crop=center",
      category: "ocean"
    },
    {
      id: "6",
      title: locale === 'zh' ? "星空宇宙" : "Starry Universe",
      url: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop&crop=center",
      category: "space"
    },
    {
      id: "7",
      title: locale === 'zh' ? "森林秘境" : "Forest Mystery",
      url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&crop=center",
      category: "forest"
    },
    {
      id: "8",
      title: locale === 'zh' ? "现代建筑" : "Modern Architecture",
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop&crop=center",
      category: "architecture"
    }
  ];

  const [activeImage, setActiveImage] = useState<ImageOption>(imageOptions[0]);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const categories = [
    { id: 'all', name: locale === 'zh' ? '全部' : 'All' },
    { id: 'urban', name: locale === 'zh' ? '城市' : 'Urban' },
    { id: 'nature', name: locale === 'zh' ? '自然' : 'Nature' },
    { id: 'abstract', name: locale === 'zh' ? '抽象' : 'Abstract' },
    { id: 'tech', name: locale === 'zh' ? '科技' : 'Tech' },
    { id: 'ocean', name: locale === 'zh' ? '海洋' : 'Ocean' },
    { id: 'space', name: locale === 'zh' ? '宇宙' : 'Space' },
    { id: 'forest', name: locale === 'zh' ? '森林' : 'Forest' },
    { id: 'architecture', name: locale === 'zh' ? '建筑' : 'Architecture' }
  ];

  const filteredImages = selectedCategory === 'all' 
    ? imageOptions 
    : imageOptions.filter(img => img.category === selectedCategory);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlay && !showGallery) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
        setActiveImage(filteredImages[(currentIndex + 1) % filteredImages.length]);
      }, 5000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isAutoPlay, showGallery, filteredImages, currentIndex]);

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(nextIndex);
    setActiveImage(filteredImages[nextIndex]);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setActiveImage(filteredImages[prevIndex]);
  };

  const handleImageSelect = (image: ImageOption, index: number) => {
    setActiveImage(image);
    setCurrentIndex(index);
    setShowGallery(false);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  return (
    <>
      {/* Fullscreen Image Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${activeImage.url})` }}
        />
        
        {/* Image Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        
        {/* Image Info Overlay */}
        <div className="absolute bottom-6 left-6 z-20">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
            <h3 className="text-white font-medium text-sm">{activeImage.title}</h3>
            <p className="text-white/70 text-xs">
              {currentIndex + 1} / {filteredImages.length}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute top-1/2 left-6 z-30 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={prevImage}
          className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40 w-10 h-10 p-0"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
      </div>

      <div className="absolute top-1/2 right-6 z-30 transform -translate-y-1/2">
        <Button
          variant="ghost"
          size="sm"
          onClick={nextImage}
          className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40 w-10 h-10 p-0"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Top Controls */}
      <div className="absolute top-6 right-6 z-30 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleAutoPlay}
          className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40"
        >
          {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowGallery(!showGallery)}
          className="bg-black/20 backdrop-blur-sm border border-white/20 text-white hover:bg-black/40 px-3"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          {locale === 'zh' ? '更换背景' : 'Change Background'}
        </Button>
      </div>

      {/* Image Gallery Panel */}
      {showGallery && (
        <div className="absolute top-20 right-6 z-40 bg-black/80 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-96 max-h-[600px] overflow-hidden">
          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`text-xs px-3 py-1 h-8 ${
                    selectedCategory === category.id
                      ? 'bg-golden/20 text-golden border border-golden/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto custom-scrollbar">
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className={`relative cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 ${
                  activeImage.id === image.id 
                    ? 'ring-2 ring-golden shadow-golden' 
                    : 'hover:ring-1 hover:ring-white/50'
                }`}
                onClick={() => handleImageSelect(image, index)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-24 object-cover"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                  <ImageIcon className="w-6 h-6 text-white" />
                </div>
                
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <p className="text-white text-xs font-medium truncate">
                    {image.title}
                  </p>
                </div>
                
                {/* Active Indicator */}
                {activeImage.id === image.id && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-golden rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {/* Gallery Info */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between text-white/70 text-sm">
              <span>
                {locale === 'zh' ? '显示' : 'Showing'} {filteredImages.length} {locale === 'zh' ? '张图片' : 'images'}
              </span>
              <span>
                {isAutoPlay ? (locale === 'zh' ? '自动播放' : 'Auto Play') : (locale === 'zh' ? '手动模式' : 'Manual')}
              </span>
            </div>
          </div>
          
          {/* Close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowGallery(false)}
            className="absolute -top-2 -right-2 w-6 h-6 p-0 bg-black/60 text-white hover:bg-black/80 rounded-full"
          >
            ×
          </Button>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="absolute bottom-6 right-6 z-20">
        <div className="flex items-center gap-2">
          {filteredImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-golden w-6' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ImageBackground;