import React, { useState, useEffect, useRef } from 'react';
import type { Classroom } from '@/types';
import { DateSelector } from '@/components/DateSelector';
import { ClassroomSelector } from '@/components/ClassroomSelector';
import { ScheduleView } from '@/components/ScheduleView';

export const SchedulePage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
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

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />

      
      <div className="relative z-10 pt-24">
        
        <div className="fixed top-24 right-6 md:right-12 text-right text-xs md:text-sm font-mono text-yellow-600 z-20">
          <div>SCHEDULE VIEW</div>
          <div>Real-time Data</div>
        </div>

        
        <section className="px-6 py-12 border-b border-yellow-600/20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter" style={{
              textShadow: '0 0 30px rgba(212, 175, 55, 0.3), 0 0 60px rgba(212, 175, 55, 0.1)',
              letterSpacing: '-0.02em',
            }}>
              SCHEDULE
              <br />
              <span className="text-yellow-600">MANAGEMENT</span>
            </h1>
            <p className="text-white/60 font-mono uppercase tracking-widest text-sm md:text-base mt-4">
              View and manage your institutional schedules
            </p>
          </div>
        </section>

        
        <section className="flex flex-col lg:flex-row min-h-[calc(100vh-200px)]">
          
          <div className="lg:w-96 border-r border-yellow-600/20 overflow-y-auto bg-black/50 backdrop-blur-sm fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="sticky top-0 bg-black/80 border-b border-yellow-600/20 p-6 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-yellow-600 font-mono uppercase tracking-widest">Rooms</h2>
            </div>
            <ClassroomSelector
              selectedClassroom={selectedClassroom}
              onSelectClassroom={setSelectedClassroom}
            />
          </div>

          
          <div className="flex-1 flex flex-col overflow-hidden bg-black/30 backdrop-blur-sm">
            
            <div className="border-b border-yellow-600/20 bg-black/50 backdrop-blur-sm sticky top-0 z-10 fade-in-up" style={{ animationDelay: '0.15s' }}>
              <DateSelector selectedDate={selectedDate} onSelectDate={setSelectedDate} />
            </div>

            
            <div className="flex-1 overflow-auto fade-in-up" style={{ animationDelay: '0.2s' }}>
              <ScheduleView selectedClassroom={selectedClassroom} selectedDate={selectedDate} />
            </div>
          </div>
        </section>

        
        <div className="fixed bottom-8 left-8 text-xs font-mono text-yellow-600/60 z-20">
          <div>SYSTEM STATUS: ONLINE</div>
          <div>MODE: SCHEDULE VIEW</div>
        </div>
      </div>
    </div>
  );
};
