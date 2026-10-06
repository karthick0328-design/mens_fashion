import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Volume2, VolumeX, Play, Pause, Film, Image as ImageIcon } from 'lucide-react';

export interface HeroStat {
  value: string;
  label: string;
}

export interface HeroConfig {
  badge: {
    brand: string;
    season: string;
  };
  title: {
    line1: string;
    line2: string;
  };
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
  stats: HeroStat[];
  media: {
    videoSrc: string;
    videoPoster: string;
    lookbookImage: string;
    mobileImage: string;
    alt: string;
  };
}

export const defaultHeroContent: HeroConfig = {
  badge: {
    brand: 'AUREN.',
    season: 'AUTUMN / WINTER 2026',
  },
  title: {
    line1: 'DEFINE YOUR',
    line2: 'STYLE.',
  },
  description:
    'Masterfully engineered menswear, precision chronographs, and Italian leather accessories designed for uncompromising presence.',
  primaryCta: {
    label: 'SHOP COLLECTION',
    href: '/products',
  },
  secondaryCta: {
    label: 'HOROLOGY SPOTLIGHT',
    href: '/products?category=watches',
  },
  stats: [
    { value: '80+', label: 'CURATED PIECES' },
    { value: '100%', label: 'ORGANIC COTTON' },
    { value: '7-Day', label: 'HOME TRY-ON' },
  ],
  media: {
    videoSrc: '/videos/hero-campaign.mp4',
    videoPoster: '/images/hero/campaign-filmstrip.jpg',
    lookbookImage: '/images/hero/auren-hero.jpg',
    mobileImage: '/images/hero/auren-hero.jpg',
    alt: "AUREN. Autumn / Winter Editorial Campaign",
  },
};

interface HeroBannerProps {
  content?: Partial<HeroConfig>;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ content: customContent }) => {
  const content: HeroConfig = {
    ...defaultHeroContent,
    ...customContent,
    badge: { ...defaultHeroContent.badge, ...customContent?.badge },
    title: { ...defaultHeroContent.title, ...customContent?.title },
    primaryCta: { ...defaultHeroContent.primaryCta, ...customContent?.primaryCta },
    secondaryCta: { ...defaultHeroContent.secondaryCta, ...customContent?.secondaryCta },
    media: { ...defaultHeroContent.media, ...customContent?.media },
    stats: customContent?.stats || defaultHeroContent.stats,
  };

  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeMedia, setActiveMedia] = useState<'video' | 'image'>('video');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (activeMedia === 'video') {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, [activeMedia, content.media.videoSrc]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => setIsPlaying(true));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <section
      aria-label="Campaign Hero"
      className="relative bg-neutral-950 text-white overflow-hidden min-h-[640px] sm:min-h-[700px] lg:h-[85vh] lg:max-h-[860px] flex items-center"
    >
      {/* Background Visual Layer */}
      <div className="absolute inset-0 z-0 select-none overflow-hidden">
        {/* 1. Looping 12-Scene Fashion Editorial Video */}
        <video
          ref={videoRef}
          src={content.media.videoSrc}
          poster={content.media.videoPoster}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onLoadedData={() => setIsVideoLoaded(true)}
          className={`w-full h-full object-cover object-[center_center] sm:object-[72%_30%] transition-opacity duration-1000 ${
            activeMedia === 'video' && isVideoLoaded ? 'opacity-85 lg:opacity-90' : 'opacity-0'
          }`}
        />

        {/* 2. Editorial Still (AUREN. Model Campaign Image) */}
        <picture
          className={`w-full h-full block absolute inset-0 transition-opacity duration-1000 ${
            activeMedia === 'image' || !isVideoLoaded
              ? 'opacity-85 lg:opacity-95'
              : 'opacity-0 pointer-events-none'
          }`}
        >
          <source media="(max-width: 640px)" srcSet={content.media.mobileImage} />
          <img
            src={activeMedia === 'image' ? content.media.lookbookImage : content.media.videoPoster}
            alt={content.media.alt}
            className="w-full h-full object-cover object-[center_top] sm:object-[75%_25%] lg:object-[78%_25%]"
            loading="eager"
            fetchPriority="high"
          />
        </picture>

        {/* Cinematic Multi-stop Gradient Overlays for Supreme Typography Contrast */}
        {/* Horizontal: Deep neutral-950 on the left text column feathered smoothly towards model visual */}
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/85 sm:via-neutral-950/70 md:via-neutral-950/50 to-transparent pointer-events-none" />

        {/* Vertical: Anchoring bottom metrics and smoothing top navigation transition */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-transparent to-neutral-950/40 pointer-events-none" />

        {/* Radial vignette for editorial spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(0,0,0,0.65)_0%,transparent_70%)] pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 w-full flex flex-col justify-between h-full">
        <div className="max-w-xl lg:max-w-2xl space-y-6 sm:space-y-7 my-auto">
          {/* Collection Season Badge with Brand Identifier */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-neutral-900/80 border border-amber-500/40 text-amber-400 text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase backdrop-blur-md shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>
              ✦ <strong className="text-white font-bold">{content.badge.brand}</strong> {content.badge.season}
            </span>
          </div>

          {/* Headline strictly split across two lines for luxury editorial aesthetic */}
          <h1 className="text-[clamp(2.75rem,6.5vw,5.5rem)] leading-[0.92] tracking-tight font-extrabold select-none">
            <span className="block font-display text-neutral-100 drop-shadow-sm">
              {content.title.line1}
            </span>
            <span className="block font-display text-white drop-shadow-md mt-1">
              {content.title.line2}
            </span>
          </h1>

          {/* Refined Supporting Editorial Copy */}
          <p className="text-sm sm:text-base lg:text-lg text-neutral-300 font-light leading-relaxed max-w-lg drop-shadow-sm">
            {content.description}
          </p>

          {/* Action CTAs */}
          <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Link
              to={content.primaryCta.href}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase tracking-wider text-xs rounded transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg shadow-amber-500/20 active:translate-y-0"
            >
              <span>{content.primaryCta.label}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to={content.secondaryCta.href}
              className="inline-flex items-center justify-center px-8 py-4 border border-white/30 hover:border-white text-white hover:bg-white/10 font-bold uppercase tracking-wider text-xs rounded backdrop-blur-sm transition-all duration-300 text-center active:bg-white/20"
            >
              <span>{content.secondaryCta.label}</span>
            </Link>
          </div>

          {/* Luxury Brand Metrics */}
          <div className="pt-8 border-t border-white/15 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg">
            {content.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <div className="text-2xl sm:text-3xl font-bold font-display text-amber-400 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-400 font-medium mt-1 leading-snug">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Bottom Media Bar: Media View Switcher & Video Playback Controls */}
        <div className="mt-8 pt-4 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 pointer-events-auto">
          {/* Interactive Media Switcher (Campaign Film vs. AUREN. Lookbook Stills) */}
          <div className="flex items-center p-1 rounded-lg bg-black/50 border border-white/15 backdrop-blur-md shadow-lg">
            <button
              type="button"
              onClick={() => setActiveMedia('video')}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeMedia === 'video'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>Campaign Film</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMedia('image')}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                activeMedia === 'image'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>AUREN. Stills</span>
            </button>
          </div>

          {/* Video Controls (Shown when video mode is active) */}
          {activeMedia === 'video' && (
            <div className="flex items-center gap-2 self-end sm:self-auto bg-black/50 border border-white/15 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold px-1 hidden sm:inline">
                Editorial Reel
              </span>

              {/* Play / Pause Toggle */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause campaign video' : 'Play campaign video'}
                className="p-1.5 rounded-full hover:bg-white/15 text-neutral-300 hover:text-white transition-colors"
                title={isPlaying ? 'Pause Video' : 'Play Video'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <div className="w-[1px] h-3 bg-white/20" />

              {/* Mute / Unmute Toggle */}
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                className="p-1.5 rounded-full hover:bg-white/15 text-neutral-300 hover:text-white transition-colors"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
