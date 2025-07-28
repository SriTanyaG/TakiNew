import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AudioSpectrogramProps {
  isActive: boolean;
  type: "user" | "agent";
  className?: string;
}

export function AudioSpectrogram({ isActive, type, className = "" }: AudioSpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const barsRef = useRef<number[]>([]);

  const barCount = 32;
  const barColor = type === "user" ? "hsl(213, 94%, 78%)" : "hsl(213, 94%, 58%)";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Initialize bars array
    if (barsRef.current.length === 0) {
      barsRef.current = Array(barCount).fill(0);
    }

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = width / barCount;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update bar heights
      for (let i = 0; i < barCount; i++) {
        if (isActive) {
          // Simulate audio data with some randomness and wave pattern
          const wave = Math.sin((Date.now() * 0.01) + (i * 0.3)) * 0.5 + 0.5;
          const randomness = Math.random() * 0.3;
          barsRef.current[i] = Math.max(0.1, wave * 0.7 + randomness * 0.3);
        } else {
          // Gradually decay when not active
          barsRef.current[i] *= 0.95;
          if (barsRef.current[i] < 0.05) barsRef.current[i] = 0;
        }

        // Draw bar
        const barHeight = barsRef.current[i] * height;
        const x = i * barWidth + barWidth * 0.2;
        const y = height - barHeight;
        const actualBarWidth = barWidth * 0.6;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, barColor);
        gradient.addColorStop(1, barColor.replace(/[\d.]+\)/, "0.3)"));

        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, actualBarWidth, barHeight);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, barColor]);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ 
        opacity: isActive ? 1 : 0.3, 
        scale: isActive ? 1 : 0.95 
      }}
      transition={{ duration: 0.3 }}
    >
      <canvas
        ref={canvasRef}
        width={400}
        height={60}
        className="w-full h-full rounded-lg"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${barColor.replace(/[\d.]+\)/, "0.1)")} 50%, transparent)` 
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className={`text-xs font-medium ${type === "user" ? "text-blue-600" : "text-blue-800"}`}>
          {isActive ? (type === "user" ? "You're speaking..." : "AI is responding...") : ""}
        </div>
      </div>
    </motion.div>
  );
}