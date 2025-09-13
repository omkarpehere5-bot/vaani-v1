import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VoiceWaveformProps {
  isListening: boolean;
  isProcessing: boolean;
  className?: string;
}

export default function VoiceWaveform({ isListening, isProcessing, className }: VoiceWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    const bars = 20;
    const barWidth = width / bars;

    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      if (isListening || isProcessing) {
        // Create animated waveform
        for (let i = 0; i < bars; i++) {
          const x = i * barWidth + barWidth / 2;
          
          let barHeight;
          if (isListening) {
            // Active listening animation - more dynamic
            barHeight = Math.sin(time * 0.02 + i * 0.5) * 20 + 
                       Math.sin(time * 0.05 + i * 0.3) * 15 + 25;
          } else if (isProcessing) {
            // Processing animation - steady pulse
            barHeight = Math.sin(time * 0.03 + i * 0.4) * 15 + 20;
          } else {
            barHeight = 5;
          }
          
          // Color gradient based on state
          const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
          if (isListening) {
            gradient.addColorStop(0, 'rgba(239, 68, 68, 0.8)'); // Red for listening
            gradient.addColorStop(1, 'rgba(239, 68, 68, 0.3)');
          } else if (isProcessing) {
            gradient.addColorStop(0, 'rgba(142, 76, 36, 0.8)'); // Primary color for processing
            gradient.addColorStop(1, 'rgba(142, 76, 36, 0.3)');
          } else {
            gradient.addColorStop(0, 'rgba(100, 100, 100, 0.4)');
            gradient.addColorStop(1, 'rgba(100, 100, 100, 0.1)');
          }
          
          ctx.fillStyle = gradient;
          ctx.fillRect(x - barWidth * 0.3, centerY - barHeight, barWidth * 0.6, barHeight * 2);
        }
        
        time += 1;
      } else {
        // Idle state - minimal bars
        for (let i = 0; i < bars; i++) {
          const x = i * barWidth + barWidth / 2;
          const barHeight = 3;
          
          ctx.fillStyle = 'rgba(100, 100, 100, 0.2)';
          ctx.fillRect(x - barWidth * 0.3, centerY - barHeight, barWidth * 0.6, barHeight * 2);
        }
      }
      
      if (isListening || isProcessing) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isListening, isProcessing]);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <canvas
        ref={canvasRef}
        width={200}
        height={60}
        className="rounded-lg"
        aria-label={
          isListening 
            ? "Voice input active - waveform visualization" 
            : isProcessing 
            ? "Processing voice input - waveform visualization"
            : "Voice input inactive"
        }
      />
    </div>
  );
}
