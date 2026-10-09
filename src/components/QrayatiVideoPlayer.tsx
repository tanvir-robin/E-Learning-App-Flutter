import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Loader2,
  BookmarkCheck,
  CheckCircle,
  Eye,
  Radio,
  Download,
  WifiOff
} from "lucide-react";
import { PlaybackAuthorizationToken, LessonItem, CourseModel } from "../types";
import { playbackAuthorizationService } from "../services/PlaybackAuthorizationService";

interface QrayatiVideoPlayerProps {
  course: CourseModel;
  lesson: LessonItem;
  authResult: {
    authorized: boolean;
    token?: PlaybackAuthorizationToken;
    errorCode?: string;
    errorMessage?: string;
  };
  onEnded?: () => void;
  onProgress?: (progressSeconds: number, totalSeconds: number) => void;
  initialTime?: number;
  onRefreshAuth?: () => void;
  onRequestEnroll?: () => void;
}

const PLAYBACK_SPEEDS = [0.75, 1.0, 1.25, 1.5, 2.0];
const QUALITY_OPTIONS = ["تلقائي (Adaptive)", "1080p FHD", "720p HD", "480p SD", "360p Data Saver"];

export const QrayatiVideoPlayer: React.FC<QrayatiVideoPlayerProps> = ({
  course,
  lesson,
  authResult,
  onEnded,
  onProgress,
  initialTime = 0,
  onRefreshAuth,
  onRequestEnroll,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Video State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [bufferedTime, setBufferedTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [selectedQuality, setSelectedQuality] = useState<string>("تلقائي (Adaptive)");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<string | null>(null);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [showSettingsMenu, setShowSettingsMenu] = useState<boolean>(false);

  // Dynamic Anti-Piracy Watermark State (Floating)
  const [watermarkPos, setWatermarkPos] = useState({ top: 25, left: 25 });

  // Unpredictable dynamic floating watermark relocation (7-14 seconds jitter, subtle red tint)
  useEffect(() => {
    let timeoutId: any;
    const scheduleNextJump = () => {
      // Random interval between 7000ms and 14000ms
      const delay = Math.floor(Math.random() * 7000) + 7000;
      timeoutId = setTimeout(() => {
        const top = Math.floor(Math.random() * 70) + 12;
        const left = Math.floor(Math.random() * 70) + 12;
        setWatermarkPos({ top, left });
        scheduleNextJump();
      }, delay);
    };
    scheduleNextJump();
    return () => clearTimeout(timeoutId);
  }, []);

  // Controls fade-out timer on mouse inactivity
  const controlsTimeoutRef = useRef<any>(null);
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettingsMenu(false);
      }
    }, 3500);
  };

  // Keep-alive heartbeat to service
  useEffect(() => {
    if (!authResult.token?.watermarkContent.userUid) return;
    const interval = setInterval(() => {
      playbackAuthorizationService.pingPlaybackSession(
        authResult.token?.watermarkContent.userUid || "",
        lesson.id
      );
    }, 10000);
    return () => clearInterval(interval);
  }, [authResult.token, lesson.id]);

  // Video Event Handlers
  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(curr);
    setDuration(dur);

    // Calculate buffer
    if (videoRef.current.buffered.length > 0) {
      setBufferedTime(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
    }

    if (onProgress && dur > 0) {
      onProgress(curr, dur);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        Math.max(videoRef.current.currentTime + seconds, 0),
        duration
      );
    }
  };

  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    setVolume(newVol);
    videoRef.current.volume = newVol;
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.7;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Keyboard Shortcuts (Space: Play/Pause, Arrows: Seek, F: Fullscreen, M: Mute)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleSkip(-10);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleSkip(10);
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === "m" || e.key === "M") {
        e.preventDefault();
        toggleMute();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay]);

  // Authorization Denial Fallback Screen
  if (!authResult.authorized || !authResult.token) {
    return (
      <div className="relative w-full aspect-16/9 bg-slate-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col items-center justify-center p-6 text-center select-none border border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center mb-4 animate-pulse">
          <Lock size={32} />
        </div>
        <h3 className="text-white text-lg font-black mb-2">
          المحتوى التعليمي محمي بتصريح تشغيل رسمي
        </h3>
        <p className="text-slate-300 text-xs sm:text-sm max-w-md mb-6 leading-relaxed">
          {authResult.errorMessage ||
            "لا يمكن تشغيل هذا الدرس قبل التحقق من صلاحية الحساب واشتراك الدورة ومطابقة بصمة الجهاز المعتمد."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {authResult.errorCode === "NOT_ENROLLED" && onRequestEnroll && (
            <button
              onClick={onRequestEnroll}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle size={16} />
              <span>الاشتراك في الدورة الآن ({course.price} دج)</span>
            </button>
          )}

          {onRefreshAuth && (
            <button
              onClick={onRefreshAuth}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck size={16} />
              <span>إعادة التحقق من التصريح الأمني</span>
            </button>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-900 text-[11px] text-slate-400 flex items-center gap-2 font-mono">
          <Radio size={12} className="text-amber-500 animate-ping" />
          <span>بوابة الحماية المشفرة: Qrayati DRM Gateway DZ-2026</span>
        </div>
      </div>
    );
  }

  const { watermarkContent, allowedPlaybackUrl, drmLicenseGranted, sourceType } = authResult.token;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-16/9 bg-black rounded-3xl overflow-hidden shadow-2xl select-none group font-sans"
    >
      {/* Native HTML5 Video Element */}
      <video
        ref={videoRef}
        src={allowedPlaybackUrl}
        preload="metadata"
        playsInline
        controlsList="nodownload nofullscreen"
        onContextMenu={(e) => e.preventDefault()}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {
          setIsLoading(false);
          if (videoRef.current && initialTime > 0) {
            videoRef.current.currentTime = initialTime;
          }
        }}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        onError={() => {
          setIsLoading(false);
          setHasError("تعذر تشغيل مصدر الفيديو. يرجى التأكد من اتصال الإنترنت.");
        }}
        className="w-full h-full object-contain cursor-pointer"
      />

      {/* Dynamic Floating Watermark - Professional fine red tone, non-predictable, strictly Name & Phone */}
      <div
        className="absolute pointer-events-none transition-all duration-1000 ease-out z-25 select-none font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-rose-500/40 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] border border-rose-500/20 bg-rose-950/20 backdrop-blur-[1px] px-2.5 py-1 rounded-lg"
        style={{
          top: `${watermarkPos.top}%`,
          left: `${watermarkPos.left}%`,
        }}
      >
        <span>{watermarkContent.userName}</span>
        <span className="mx-1.5 text-rose-400/30">•</span>
        <span dir="ltr" className="font-mono">{watermarkContent.userPhone}</span>
      </div>
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs pointer-events-none z-30">
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={42} className="text-emerald-500 animate-spin" />
            <span className="text-white text-xs font-bold drop-shadow">جاري البث الآمن...</span>
          </div>
        </div>
      )}

      {/* Playback Error Overlay */}
      {hasError && (
        <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center z-35">
          <AlertTriangle size={36} className="text-amber-500 mb-2" />
          <p className="text-white text-xs sm:text-sm font-bold mb-4">{hasError}</p>
          <button
            onClick={() => {
              setHasError(null);
              setIsLoading(true);
              if (videoRef.current) {
                videoRef.current.load();
                videoRef.current.play().catch(() => {});
              }
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition"
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {/* Center Play/Pause Indicator when clicking video */}
      {!isPlaying && !isLoading && !hasError && (
        <button
          onClick={togglePlay}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-600/90 hover:bg-emerald-600 text-white flex items-center justify-center shadow-2xl transition-all scale-100 hover:scale-110 z-20 cursor-pointer backdrop-blur-sm"
          aria-label="تشغيل"
        >
          <Play size={32} className="translate-x-0.5 fill-white" />
        </button>
      )}

      {/* Video Overlay Top Bar (Title & Security Status) */}
      <div
        className={`absolute top-0 inset-x-0 p-4 bg-linear-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 z-20 flex items-center justify-between pointer-events-auto ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="text-white">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
              {lesson.isPreview ? "معاينة مجانية" : "محمي بتصريح"}
            </span>
            {drmLicenseGranted && (
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Lock size={10} />
                <span>Widevine DRM</span>
              </span>
            )}
          </div>
          <h2 className="text-xs sm:text-sm font-bold text-white mt-1 drop-shadow-md truncate max-w-sm sm:max-w-md">
            {lesson.title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-slate-300 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-mono">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>جلسة نشطة: #{authResult.token.sessionId.slice(-6)}</span>
          </div>
        </div>
      </div>

      {/* Video Overlay Bottom Controls Bar */}
      <div
        className={`absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-linear-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 z-20 flex flex-col gap-2 ${
          showControls ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Progress Timeline with Buffer indication */}
        <div className="relative group/timeline w-full flex items-center">
          <div className="absolute h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            {/* Buffered progress */}
            <div
              className="h-full bg-white/30 transition-all duration-300"
              style={{ width: `${(bufferedTime / (duration || 1)) * 100}%` }}
            />
          </div>
          {/* Active Played progress */}
          <div
            className="absolute h-1.5 bg-emerald-500 rounded-full pointer-events-none"
            style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
          />
          {/* Range input slider */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="relative w-full h-3 opacity-0 group-hover/timeline:opacity-100 cursor-pointer accent-emerald-500 z-10 transition-opacity"
          />
        </div>

        {/* Action Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs">
          {/* Left Controls (Play, Skip, Volume, Timer) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={togglePlay}
              className="p-1.5 hover:text-emerald-400 transition cursor-pointer"
              title={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            {/* Skip -10s */}
            <button
              onClick={() => handleSkip(-10)}
              className="p-1 hover:text-emerald-400 transition cursor-pointer hidden sm:block"
              title="رجوع 10 ثواني"
            >
              <RotateCcw size={16} />
            </button>

            {/* Skip +10s */}
            <button
              onClick={() => handleSkip(10)}
              className="p-1 hover:text-emerald-400 transition cursor-pointer hidden sm:block"
              title="تقديم 10 ثواني"
            >
              <RotateCw size={16} />
            </button>

            {/* Volume & Mute */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 hover:text-emerald-400 transition cursor-pointer"
                title={isMuted ? "تشغيل الصوت" : "كتم الصوت"}
              >
                {isMuted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-14 sm:w-18 h-1 accent-emerald-500 cursor-pointer hidden sm:block"
              />
            </div>

            {/* Current / Duration Timer */}
            <div className="text-[11px] font-mono text-slate-300 font-bold ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-slate-500">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls (Speed, Quality, Settings, Fullscreen) */}
          <div className="flex items-center gap-2 sm:gap-3 relative">
            {/* Speed selection quick buttons */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-mono font-bold flex items-center gap-1 transition cursor-pointer"
                title="إعدادات السرعة والجودة"
              >
                <Settings size={13} />
                <span>{playbackSpeed}x</span>
              </button>

              {/* Settings Dropdown Menu */}
              {showSettingsMenu && (
                <div className="absolute bottom-10 left-0 bg-slate-900 border border-slate-700/80 rounded-2xl p-3 shadow-2xl w-52 text-slate-200 z-50 animate-in fade-in zoom-in-95 text-xs font-sans">
                  <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    سرعة التشغيل
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {PLAYBACK_SPEEDS.map((sp) => (
                      <button
                        key={sp}
                        onClick={() => handleSpeedSelect(sp)}
                        className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold cursor-pointer transition ${
                          playbackSpeed === sp
                            ? "bg-emerald-600 text-white"
                            : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                        }`}
                      >
                        {sp}x
                      </button>
                    ))}
                  </div>

                  <div className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    جودة البث الرقمي
                  </div>
                  <div className="space-y-1">
                    {QUALITY_OPTIONS.map((q) => (
                      <div
                        key={q}
                        onClick={() => {
                          setSelectedQuality(q);
                          setShowSettingsMenu(false);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center justify-between ${
                          selectedQuality === q
                            ? "bg-emerald-950/80 text-emerald-400 border border-emerald-500/30"
                            : "hover:bg-slate-800 text-slate-300"
                        }`}
                      >
                        <span>{q}</span>
                        {selectedQuality === q && <CheckCircle size={12} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 hover:text-emerald-400 transition cursor-pointer"
              title={isFullscreen ? "تصغير الشاشة" : "ملء الشاشة"}
            >
              {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
