import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    
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
      
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      
      <div className="relative z-10">
        
        <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{
          perspective: '1200px',
        }}>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 md:w-[500px] md:h-[500px] pointer-events-none opacity-40" style={{
            transform: `translateX(-50%) translateY(-50%) rotateX(${scrollY * 0.3}deg) rotateY(${scrollY * 0.5}deg) translateZ(0px)`,
            transition: 'transform 0.05s ease-out',
            transformStyle: 'preserve-3d',
          }}>
            <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="250" cy="250" r="200" stroke="#d4af37" strokeWidth="2" />
              <circle cx="250" cy="250" r="220" stroke="#d4af37" strokeWidth="1" opacity="0.5" />
              <circle cx="250" cy="250" r="180" stroke="#d4af37" strokeWidth="1" opacity="0.3" />
              
              
              <path d="M 250 50 Q 400 250 250 450" stroke="#d4af37" strokeWidth="2" opacity="0.4" />
              <path d="M 50 250 Q 250 400 450 250" stroke="#d4af37" strokeWidth="2" opacity="0.4" />
            </svg>
          </div>

          
          <div className="max-w-4xl mx-auto text-center relative z-20" style={{
            transform: `translateY(${scrollY * 0.3}px) perspective(1000px) rotateX(${Math.sin(scrollY * 0.01) * 2}deg)`,
            transition: 'transform 0.05s ease-out',
            transformStyle: 'preserve-3d',
          }}>
            
            <div className="mb-8 tracking-widest uppercase text-yellow-600 text-sm md:text-base font-mono">
              Centralized Web-Based Solution
            </div>

            
            <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter" style={{
              textShadow: '0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.1)',
              letterSpacing: '-0.02em',
            }}>
              CAMPUS
              <br />
              <span className="text-yellow-600">SCHEDULER</span>
            </h1>

            
            <div className="text-xl md:text-2xl text-yellow-600 font-light tracking-widest uppercase mb-8 font-mono">
              Real-time Updates. Zero Conflicts. Full Transparency.
            </div>

            
            <div className="text-sm md:text-base text-white/60 font-mono uppercase tracking-widest mb-12">
              Smart Classroom & Event Management System
            </div>

            
            <p className="text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed text-base md:text-lg">
              A centralized platform that provides real-time schedule updates, integrates faculty availability, prevents scheduling conflicts, and ensures easy accessibility across devices. No more confusion from class cancellations, room changes, or faculty absence.
            </p>

            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 max-w-3xl mx-auto">
              {[
                { label: 'For Students', value: 'Live Class Updates' },
                { label: 'For Faculty', value: 'Availability Control' },
                { label: 'For Admins', value: 'Conflict Prevention' },
                { label: 'For All', value: 'Cross-Device Access' }
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

            
            <Link
              to="/schedule"
              className="inline-block px-12 py-3 border-2 border-yellow-600 text-yellow-600 font-mono uppercase text-sm tracking-widest hover:bg-yellow-600 hover:text-black transition-all duration-300"
            >
              Access System
            </Link>
          </div>
        </section>

        
        <section className="py-32 px-6 border-t border-yellow-600/20 bg-gradient-to-b from-black to-gray-900">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-12 text-center tracking-tighter" style={{
              textShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
            }}>
              HOW IT <span className="text-yellow-600">WORKS</span>
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  step: '01',
                  title: 'Schedule Creation',
                  description: 'Administrators create and manage class schedules, assign rooms, and set faculty for each session.'
                },
                {
                  step: '02',
                  title: 'Real-Time Updates',
                  description: 'Any changes to schedules are instantly synced across the platform and visible to all users.'
                },
                {
                  step: '03',
                  title: 'Conflict Detection',
                  description: 'The system automatically detects and prevents double bookings and scheduling overlaps.'
                },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="relative border border-yellow-600/30 p-8 pt-12 bg-black/50 backdrop-blur-sm hover:border-yellow-600 transition-all group"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-600 text-black font-black text-lg flex items-center justify-center">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-600 transition-colors">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '04',
                  title: 'Faculty Updates',
                  description: 'Faculty members can update their availability status, triggering automatic schedule adjustments.'
                },
                {
                  step: '05',
                  title: 'Student Access',
                  description: 'Students view their personalized schedules with real-time notifications for any changes.'
                },
                {
                  step: '06',
                  title: 'Analytics & Reports',
                  description: 'Track classroom utilization, view attendance patterns, and generate scheduling reports.'
                },
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="relative border border-yellow-600/30 p-8 pt-12 bg-black/50 backdrop-blur-sm hover:border-yellow-600 transition-all group"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-600 text-black font-black text-lg flex items-center justify-center">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-600 transition-colors">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        
        <section className="py-32 px-6 border-t border-yellow-600/20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-20 text-center tracking-tighter" style={{
              textShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
            }}>
              KEY <span className="text-yellow-600">FEATURES</span>
            </h2>

            <div className="space-y-8">
              {[
                {
                  title: 'Real-Time Schedule Updates',
                  description: 'Class cancellations, room changes, and schedule modifications are reflected instantly across all devices.'
                },
                {
                  title: 'Faculty Availability Integration',
                  description: 'Faculty members can mark themselves unavailable due to leave, meetings, or emergencies with immediate visibility.'
                },
                {
                  title: 'Automatic Conflict Prevention',
                  description: 'The system detects and prevents double bookings, overlapping events, and resource conflicts before they occur.'
                },
                {
                  title: 'Classroom Utilization Tracking',
                  description: 'Monitor which rooms are occupied, available, or under maintenance with real-time status indicators.'
                },
                {
                  title: 'Role-Based Access Control',
                  description: 'Students view schedules, faculty update availability, and admins manage everything - each with appropriate permissions.'
                },
                {
                  title: 'Cross-Device Accessibility',
                  description: 'Access the platform from any device - desktop, tablet, or mobile - with a fully responsive interface.'
                },
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className="border-l-4 border-yellow-600 pl-8 py-4 group hover:bg-yellow-600/5 transition-all"
                >
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-yellow-600 transition-colors">{feature.title}</h3>
                  <p className="text-white/60 group-hover:text-white/80 transition-colors">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        
        <section className="py-32 px-6 border-t border-yellow-600/20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black mb-20 text-center tracking-tighter" style={{
              textShadow: '0 0 20px rgba(212, 175, 55, 0.2)',
            }}>
              WHO <span className="text-yellow-600">BENEFITS</span>
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: 'Students', description: 'No more wasted time attending wrong classrooms or missing schedule updates' },
                { title: 'Faculty', description: 'Easy availability updates and reduced manual coordination overhead' },
                { title: 'Administrators', description: 'Streamlined scheduling with automatic conflict detection and resolution' },
                { title: 'Event Organizers', description: 'Simple room booking and event scheduling without conflicts' },
                { title: 'IT Staff', description: 'Modern tech stack with Firebase for easy maintenance and scalability' },
                { title: 'Institution', description: 'Efficient campus infrastructure utilization and improved transparency' },
              ].map((item, idx) => (
                <div 
                  key={idx} 
                  className="border border-yellow-600/30 p-6 bg-black/30 hover:border-yellow-600 transition-all group"
                >
                  <div className="text-yellow-600 font-mono text-sm uppercase tracking-widest mb-2">{item.title}</div>
                  <div className="text-white/70 text-sm group-hover:text-white/90 transition-colors">{item.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        
        <footer className="border-t border-yellow-600/20 py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div>
                <h4 className="text-yellow-600 font-mono text-sm uppercase tracking-widest mb-4">Platform</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><Link to="/" className="hover:text-yellow-600 transition-colors">Home</Link></li>
                  <li><Link to="/schedule" className="hover:text-yellow-600 transition-colors">View Schedule</Link></li>
                  <li><Link to="/classrooms" className="hover:text-yellow-600 transition-colors">Classrooms</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-yellow-600 font-mono text-sm uppercase tracking-widest mb-4">For Users</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Student Guide</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Faculty Portal</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Admin Dashboard</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-yellow-600 font-mono text-sm uppercase tracking-widest mb-4">Tech Stack</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><span className="text-white/40">React + TypeScript</span></li>
                  <li><span className="text-white/40">Firebase + Firestore</span></li>
                  <li><span className="text-white/40">Tailwind CSS</span></li>
                </ul>
              </div>
              <div>
                <h4 className="text-yellow-600 font-mono text-sm uppercase tracking-widest mb-4">Project</h4>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-yellow-600 transition-colors">GitHub</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-yellow-600/20 pt-8 text-center text-white/40 text-sm font-mono">
              <p>© 2026 College Schedule Management System. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
