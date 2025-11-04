import { useEffect, useState } from 'react';

/**
 * 移动端检测Hook
 * 支持响应式检测和用户代理检测
 */
export const useIsMobile = (breakpoint: number = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // 基于屏幕宽度的检测
      const isScreenMobile = window.innerWidth < breakpoint;
      
      // 基于用户代理的检测（可选）
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
      
      // 检测触摸设备
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // 综合判断
      setIsMobile(isScreenMobile || (isMobileUserAgent && isTouchDevice));
    };

    // 初始检测
    checkDevice();
    
    // 监听窗口大小变化
    window.addEventListener('resize', checkDevice);
    
    // 监听方向变化
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, [breakpoint]);

  return isMobile;
};

/**
 * 移动端屏幕方向检测
 */
export const useOrientation = () => {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');

  useEffect(() => {
    const checkOrientation = () => {
      if (screen.orientation) {
        setOrientation(screen.orientation.angle === 0 || screen.orientation.angle === 180 ? 'portrait' : 'landscape');
      } else {
        // 兼容性检测
        setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
      }
    };

    checkOrientation();
    
    window.addEventListener('orientationchange', checkOrientation);
    window.addEventListener('resize', checkOrientation);

    return () => {
      window.removeEventListener('orientationchange', checkOrientation);
      window.removeEventListener('resize', checkOrientation);
    };
  }, []);

  return orientation;
};

/**
 * 设备信息检测
 */
export const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isIOS: false,
    isAndroid: false,
    supportsPWA: false,
    supportsVibration: false
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)|tablet/i.test(userAgent);
    const isDesktop = !isMobile && !isTablet;
    const isIOS = /ipad|iphone|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const supportsPWA = 'serviceWorker' in navigator && 'PushManager' in window;
    const supportsVibration = 'vibrate' in navigator;

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      isIOS,
      isAndroid,
      supportsPWA,
      supportsVibration
    });
  }, []);

  return deviceInfo;
};

export default useIsMobile;
