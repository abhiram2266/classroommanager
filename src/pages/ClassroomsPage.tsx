import React, { useState, useEffect, useRef } from 'react';
import { Users, MapPin, Zap, AlertCircle } from 'lucide-react';
import type { Classroom } from '@/types';
import { classroomService } from '@/services/database';

export const ClassroomsPage: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  
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

  
  useEffect(() => {
    const fetchClassrooms = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await classroomService.getAll();
        setClassrooms(data);
      } catch (err) {
        setError('Failed to load classrooms');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      
      <div className="relative z-10 pt-24">
        
        <div className="fixed top-24 right-6 md:right-12 text-right text-xs md:text-sm font-mono text-yellow-600 z-20">
          <div>CLASSROOM VIEW</div>
          <div>Total: {classrooms.length}</div>
        </div>

        
        <section className="px-6 py-12 border-b border-yellow-600/20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter" style={{
              textShadow: '0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.1)',
              letterSpacing: '-0.02em',
            }}>
              AVAILABLE
              <br />
              <span className="text-yellow-600">CLASSROOMS</span>
            </h1>
            <p className="text-white/60 font-mono uppercase tracking-widest text-sm md:text-base mt-4">
              Explore all institutional facilities and amenities
            </p>
          </div>
        </section>

        
        <section className="px-6 py-16 md:py-24">
          <div className="max-w-6xl mx-auto">
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 animate-pulse backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300">{error}</p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="text-center">
                  <div className="w-12 h-12 border-3 border-yellow-600/20 border-t-yellow-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-white/50 font-mono">Loading classrooms...</p>
                </div>
              </div>
            ) : classrooms.length === 0 ? (
              <div className="p-12 border border-yellow-600/20 rounded-lg backdrop-blur-md bg-black/50 text-center">
                <MapPin className="w-12 h-12 text-yellow-600/30 mx-auto mb-4" />
                <p className="text-white/60 font-mono">No classrooms available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.map((classroom, idx) => (
                  <div
                    key={classroom.id}
                    className="border border-yellow-600/30 rounded-lg p-6 bg-black/50 hover:border-yellow-600/60 hover:bg-yellow-600/5 transition-all duration-300 fade-in-up backdrop-blur-md"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-black text-yellow-600 mb-2 font-mono tracking-tight">
                        {classroom.roomNumber}
                      </h3>
                      <div className="flex items-center gap-2 text-yellow-600/70 font-mono text-xs">
                        <MapPin className="w-3 h-3" />
                        <span>{classroom.building}</span>
                      </div>
                    </div>

                    
                    <div className="space-y-4">
                      
                      <div className="flex items-center gap-3 p-3 bg-yellow-600/5 border border-yellow-600/20 rounded-md">
                        <Users className="w-4 h-4 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-xs text-white/60 font-mono uppercase">Capacity</p>
                          <p className="text-sm font-bold text-white">{classroom.capacity} Students</p>
                        </div>
                      </div>

                      
                      <div className="flex items-center gap-3 p-3 bg-yellow-600/5 border border-yellow-600/20 rounded-md">
                        <MapPin className="w-4 h-4 text-yellow-600" />
                        <div className="flex-1">
                          <p className="text-xs text-white/60 font-mono uppercase">Location</p>
                          <p className="text-sm font-bold text-white">{classroom.building}</p>
                        </div>
                      </div>

                      
                      {classroom.amenities.length > 0 && (
                        <div className="border-t border-yellow-600/20 pt-4">
                          <p className="text-xs text-white/60 font-mono uppercase mb-3 flex items-center gap-2">
                            <Zap className="w-3 h-3 text-yellow-600" />
                            Amenities
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {classroom.amenities.map((amenity, i) => (
                              <span
                                key={i}
                                className="px-3 py-1.5 bg-yellow-600/10 text-yellow-600 text-xs border border-yellow-600/30 rounded font-mono"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      
                      <div className="pt-4 border-t border-yellow-600/20">
                        {classroom.isActive ? (
                          <span className="text-xs px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded font-mono font-bold uppercase">
                            Available
                          </span>
                        ) : (
                          <span className="text-xs px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded font-mono font-bold uppercase">
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        
        <div className="fixed bottom-8 left-8 text-xs font-mono text-yellow-600/60 z-20">
          <div>SYSTEM STATUS: ONLINE</div>
          <div>MODE: CLASSROOM VIEW</div>
        </div>
      </div>
    </div>
  );
};
