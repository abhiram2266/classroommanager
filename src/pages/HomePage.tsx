import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ThreeBackground } from '@/components/ThreeBackground';

export const HomePage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Three.js Background */}
      <ThreeBackground scrollY={scrollY} />

      {/* Content */}
      <div className="relative z-10">
        
        <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden" style={{
          perspective: '1200px',
        }}>
          {/* Content */}
          <div className="max-w-4xl mx-auto text-center relative z-20" style={{
            transform: `translateY(${scrollY * 0.3}px) perspective(1000px) rotateX(${Math.sin(scrollY * 0.01) * 2}deg)`,
            transition: 'transform 0.05s ease-out',
            transformStyle: 'preserve-3d',
          }}>
            
            <div className="mb-8 tracking-widest uppercase text-yellow-600 text-sm md:text-base font-mono">
              All-in-One University Platform
            </div>

            
            <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter" style={{
              textShadow: '0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.1)',
              letterSpacing: '-0.02em',
            }}>
              COLLEGE
              <br />
              <span className="text-yellow-600">HUB</span>
            </h1>

            
            <div className="text-xl md:text-2xl text-yellow-600 font-light tracking-widest uppercase mb-8 font-mono">
              Schedules. Classrooms. Resources. Files. Community.
            </div>

            
            <div className="text-sm md:text-base text-white/60 font-mono uppercase tracking-widest mb-12">
              Unified Campus Management & Collaboration Platform
            </div>

            
            <p className="text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed text-base md:text-lg">
              A comprehensive platform bringing together class schedules, classroom management, study resources, personal file storage, and community collaboration. From real-time schedule updates and conflict-free bookings to shared study materials and secure personal storage—everything your college community needs in one place.
            </p>

            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16 max-w-3xl mx-auto">
              {[
                { label: 'For Students', value: 'Live Schedules & PYQs' },
                { label: 'For Faculty', value: 'Availability Updates' },
                { label: 'For Admins', value: 'Schedule Management' },
                { label: 'For All', value: 'File Storage & Collab' }
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

        
        <section className="py-32 px-6 border-t border-yellow-600/20">
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
                  title: 'Browse Schedules',
                  description: 'View all your classes and college events in real-time with instant updates.'
                },
                {
                  step: '02',
                  title: 'Explore Classrooms',
                  description: 'Check classroom details, capacity, available facilities, and real-time status.'
                },
                {
                  step: '03',
                  title: 'Access Study Materials',
                  description: 'Download PYQs, notes, books, lab manuals shared by your college community.'
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
                  title: 'Store Privately',
                  description: 'Upload and manage your personal files in secure private storage accessible only to you.'
                },
                {
                  step: '05',
                  title: 'Contribute & Share',
                  description: 'Share your study materials with the entire college community through the Study Materials section.'
                },
                {
                  step: '06',
                  title: 'Stay Connected',
                  description: 'Access everything from any device with our fully responsive design and cross-platform support.'
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
                  title: 'Unified Schedule Viewing',
                  description: 'Access all your class schedules in one place with real-time updates and instant notifications.'
                },
                {
                  title: 'Classroom Information Hub',
                  description: 'Browse detailed classroom information including capacity, location, amenities, and current status.'
                },
                {
                  title: 'Shared Study Materials',
                  description: 'Discover and download PYQs, class notes, reference books, and lab manuals shared by your community.'
                },
                {
                  title: 'Personal Cloud Storage',
                  description: 'Secure private file storage for your personal assignments, notes, and projects - only you can access.'
                },
                {
                  title: 'Community Collaboration',
                  description: 'Contribute your study materials to help other students and build a strong learning community.'
                },
                {
                  title: 'Cross-Device Access',
                  description: 'Access your schedules, files, and study materials from desktop, tablet, or mobile seamlessly.'
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
                { title: 'Students', description: 'Never miss a class! Access schedules and study materials all in one place.' },
                { title: 'Faculty', description: 'Easily check classrooms and manage your availability across the platform.' },
                { title: 'Administrators', description: 'Centralized control of schedules, classrooms, and all platform resources.' },
                { title: 'Researchers', description: 'Share academic materials and contribute to the college knowledge base.' },
                { title: 'Tutors', description: 'Upload notes and resources to help students prepare for exams.' },
                { title: 'Institution', description: 'Improve classroom utilization and foster a collaborative learning environment.' },
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
