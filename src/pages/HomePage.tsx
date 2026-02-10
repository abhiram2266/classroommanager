import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Generate stars
    const stars: Array<{ x: number; y: number; radius: number; opacity: number; twinkleSpeed: number }> = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        twinkleSpeed: Math.random() * 0.03 + 0.005,
      });
    }

    let animationFrame: number;
    let time = 0;

    const animate = () => {
      time += 1;
      ctx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw twinkling stars
      stars.forEach((star) => {
        const twinkle = Math.abs(Math.sin(time * star.twinkleSpeed)) * 0.5 + 0.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * twinkle})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Starfield Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{
          perspective: '1200px',
        }}>
          {/* Geometric Circle Background with 3D Transform */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[500px] md:h-[500px] pointer-events-none opacity-40" style={{
            transform: `translateX(-50%) translateY(-50%) rotateX(${scrollY * 0.3}deg) rotateY(${scrollY * 0.5}deg) translateZ(0px)`,
            transition: 'transform 0.05s ease-out',
            transformStyle: 'preserve-3d',
          }}>
            <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" stroke="#d4af37" strokeWidth="2" />
              <circle cx="250" cy="250" r="220" stroke="#d4af37" strokeWidth="1" opacity="0.5" />
              <circle cx="250" cy="250" r="180" stroke="#d4af37" strokeWidth="1" opacity="0.3" />
              
              {/* Curved lines like in the reference */}
              <path d="M 250 50 Q 400 250 250 450" stroke="#d4af37" strokeWidth="2" opacity="0.4" />
              <path d="M 50 250 Q 250 400 450 250" stroke="#d4af37" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>

          {/* Top right coordinates */}
          <div className="absolute top-20 right-6 md:right-12 text-right text-xs md:text-sm font-mono text-yellow-600">
            <div>COORDINATES</div>
            <div>25.2877° N, 82.9913° E</div>
          </div>

          {/* Main Content */}
          <div className="max-w-4xl mx-auto text-center relative z-20" style={{
            transform: `translateY(${scrollY * 0.3}px) perspective(1000px) rotateX(${Math.sin(scrollY * 0.01) * 2}deg)`,
            transition: 'transform 0.05s ease-out',
            transformStyle: 'preserve-3d',
          }}>
            {/* Logo/Branding */}
            <div className="mb-8 tracking-widest uppercase text-yellow-600 text-sm md:text-base font-mono">
              College Management System
            </div>

            {/* Main Title */}
            <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter" style={{
              textShadow: '0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.1)',
              letterSpacing: '-0.02em',
            }}>
              SCHEDULE
              <br />
              <span className="text-yellow-600">MANAGEMENT</span>
            </h1>

            {/* Subtitle */}
            <div className="text-xl md:text-2xl text-yellow-600 font-light tracking-widest uppercase mb-8 font-mono">
              Smart. Efficient. Intelligent.
            </div>

            {/* Date/Tagline */}
            <div className="text-sm md:text-base text-white/60 font-mono uppercase tracking-widest mb-12">
              Institution Management System
            </div>

            {/* Description */}
            <p className="text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed text-base md:text-lg">
              Asia's most advanced college scheduling platform. Streamline your institution with real-time conflict detection and intelligent resource management.
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 max-w-3xl mx-auto">
              {[
                { label: 'Location', value: 'Your Institute' },
                { label: 'Status', value: 'Systems Online' },
                { label: 'Access', value: 'Open To All' },
                { label: 'Version', value: '1.0.0' }
              ].map((card, idx) => (
                <div 
                  key={idx}
                  className="border border-yellow-600/30 p-4 md:p-6 bg-black/50 backdrop-blur-sm hover:border-yellow-600 transition-all group"
                  style={{
                    transform: `translateY(${scrollY * 0.1}px) rotateX(${Math.sin((scrollY + idx * 100) * 0.005) * 5}deg) rotateZ(${Math.cos((scrollY + idx * 100) * 0.005) * 2}deg) translateZ(${Math.abs(Math.sin((scrollY + idx * 100) * 0.005)) * 20}px)`,
                    transition: 'transform 0.05s ease-out',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <div className="text-yellow-600 text-xs md:text-sm font-mono uppercase tracking-widest mb-2">{card.label}</div>
                  <div className="text-white text-sm md:text-base font-light group-hover:text-yellow-600 transition-colors">{card.value}</div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Link
              to="/schedule"
              className="inline-block px-12 py-3 border-2 border-yellow-600 text-yellow-600 font-mono uppercase text-sm tracking-widest hover:bg-yellow-600 hover:text-black transition-all duration-300"
            >
              Access System
            </Link>
          </div>

          {/* Bottom status bar */}
          <div className="absolute bottom-8 left-8 text-xs font-mono text-yellow-600/60">
            <div>SYSTEM STATUS: ONLINE</div>
            <div>VERSION: 1.0.0</div>
          </div>
        </section>

        {/* Features Section */}
        <section className="min-h-screen py-32 px-6 border-t border-yellow-600/20" style={{
          perspective: '1000px',
        }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-20 text-center tracking-tighter" style={{
              textShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
              transform: `translateY(${Math.max(0, scrollY - 600) * 0.2}px)`,
              transition: 'transform 0.05s ease-out',
            }}>
              KEY <span className="text-yellow-600">FEATURES</span>
            </h2>

            <div className="space-y-8">
              {[
                {
                  title: 'Smart Classroom Scheduling',
                  description: 'Intelligent allocation system with drag-and-drop interface for effortless scheduling.'
                },
                {
                  title: 'Automated Conflict Detection',
                  description: 'Real-time system preventing double bookings and resource overlaps automatically.'
                },
                {
                  title: 'Faculty Availability Management',
                  description: 'Track and update faculty availability with instant synchronization across platform.'
                },
                {
                  title: 'Real-time Synchronization',
                  description: 'All changes sync instantly. Everyone sees up-to-date information in real-time.'
                },
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className="border-l-4 border-yellow-600 pl-8 py-4 group hover:pl-12 transition-all"
                  style={{
                    transform: `translateX(${Math.max(0, scrollY - 900) * 0.15}px) rotateY(${Math.max(0, scrollY - 900) * 0.05}deg)`,
                    transition: 'transform 0.05s ease-out',
                    transformStyle: 'preserve-3d',
                    opacity: 0.7 + Math.min(0.3, Math.max(0, scrollY - 900) * 0.001),
                  }}
                >
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-2 transition-transform">{feature.title}</h3>
                  <p className="text-white/60 group-hover:text-white/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="min-h-screen py-32 px-6 border-t border-yellow-600/20" style={{
          perspective: '1000px',
        }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-20 text-center tracking-tighter" style={{
              textShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
              transform: `translateY(${Math.max(0, scrollY - 1800) * 0.2}px)`,
              transition: 'transform 0.05s ease-out',
            }}>
              ACADEMIC <span className="text-yellow-600">TIMELINE</span>
            </h2>

            <div className="space-y-6">
              {[
                { date: 'January 1', event: 'Semester Begins' },
                { date: 'January 15', event: 'Course Registration' },
                { date: 'January 29', event: 'Classes Start' },
                { date: 'March 15', event: 'Mid Semester Exams' },
                { date: 'April 30', event: 'Final Exams' },
                { date: 'May 15', event: 'Results Declared' },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="border-l-2 border-yellow-600/50 pl-8 py-4 hover:border-yellow-600 transition-all group"
                  style={{
                    transform: `translateX(${Math.max(0, scrollY - 1900) * 0.2 - idx * 20}px) rotateY(${Math.max(0, scrollY - 1900) * 0.08}deg) perspective(1000px)`,
                    transition: 'transform 0.05s ease-out',
                    transformStyle: 'preserve-3d',
                    opacity: 0.6 + Math.min(0.4, Math.max(0, scrollY - 1900) * 0.0015),
                  }}
                >
                  <div className="absolute -left-3 w-6 h-6 border-2 border-yellow-600 rounded-full bg-black" />
                  <div className="text-yellow-600 font-mono text-sm uppercase tracking-widest mb-1">{item.date}</div>
                  <div className="text-white text-lg font-light group-hover:translate-x-2 transition-transform">{item.event}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-yellow-600/20 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h4 className="text-yellow-600 font-mono text-sm uppercase tracking-widest mb-4">Quick Links</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Home</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Schedule</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-yellow-600 font-mono text-sm uppercase tracking-widest mb-4">Resources</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Support</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-yellow-600 font-mono text-sm uppercase tracking-widest mb-4">Company</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Privacy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-yellow-600 font-mono text-sm uppercase tracking-widest mb-4">Legal</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">License</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-yellow-600/20 pt-8 text-center text-white/40 text-sm font-mono">
              <p>© 2024 College Schedule Management System. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
