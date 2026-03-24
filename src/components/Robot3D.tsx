import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export const RobotSVG = ({ isDark, className, style }: { isDark: boolean; className?: string; style?: React.CSSProperties }) => (
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-2xl ${className}`} style={style}>
    {/* Body */}
    <motion.path
      d="M60 100C60 77.9086 77.9086 60 100 60C122.091 60 140 77.9086 140 100V140C140 151.046 131.046 160 120 160H80C68.9543 160 60 151.046 60 140V100Z"
      fill={`url(#bodyGradient-${isDark ? 'dark' : 'light'})`}
      className={isDark ? "stroke-white/10" : "stroke-black/5"}
      strokeWidth="1"
    />
    {/* Head/Face Area */}
    <rect x="75" y="85" width="50" height="30" rx="10" 
      fill={isDark ? "#0D0D15" : "#F8FAFC"} 
      stroke="#A855F7" 
      strokeWidth="1" 
    />
    {/* Eyes */}
    <motion.circle
      cx="90" cy="100" r="3.5"
      fill="#4ADE80"
      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="110" cy="100" r="3.5"
      fill="#4ADE80"
      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
    />
    {/* Antennas */}
    <line x1="100" y1="60" x2="100" y2="40" stroke="#8B5CF6" strokeWidth="2" strokeLinecap="round" />
    <motion.circle
      cx="100" cy="35" r="4"
      fill="#8B5CF6"
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    
    <defs>
      <linearGradient id="bodyGradient-dark" x1="100" y1="60" x2="100" y2="160" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1E1B4B" />
        <stop offset="1" stopColor="#0A0A0F" />
      </linearGradient>
      <linearGradient id="bodyGradient-light" x1="100" y1="60" x2="100" y2="160" gradientUnits="userSpaceOnUse">
        <stop stopColor="#EEF2FF" />
        <stop offset="1" stopColor="#E0E7FF" />
      </linearGradient>
    </defs>
  </svg>
);

const RobotInstance = ({ bot, mousePos, yPos, isDark }: { 
  bot: any; 
  mousePos: { x: number; y: number }; 
  yPos: any; 
  isDark: boolean 
}) => {
  const adjustedY = useTransform(yPos, (value: number) => value * bot.yFactor);
  
  return (
    <motion.div
      style={{ 
        x: mousePos.x * bot.xRatio, 
        y: adjustedY,
        top: bot.top,
        bottom: bot.bottom,
        left: bot.left,
        right: bot.right,
      }}
      initial={{ opacity: 0, scale: bot.scale * 0.8 }}
      animate={{ opacity: bot.opacity, scale: bot.scale }}
      transition={{ duration: 2, delay: bot.id === 'main-right' ? 0 : Math.random() }}
      className="absolute hidden md:block"
    >
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: bot.rotate,
        }}
        transition={{
          duration: bot.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative"
        style={{ 
          filter: `grayscale(${bot.grayscale})`,
          opacity: bot.opacity
        }}
      >
        <RobotSVG isDark={isDark} style={{ width: 200 * bot.scale, height: 'auto' }} />
        
        {/* Glow beneath robot */}
        <div className={`absolute -bottom-10 left-1/2 -z-10 h-10 w-20 -translate-x-1/2 rounded-full blur-2xl ${isDark ? 'bg-primary/20' : 'bg-primary/30'}`} 
          style={{ opacity: bot.opacity * 0.5 }}
        />
      </motion.div>
    </motion.div>
  );
};

const Robot3D = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  const yRange = useTransform(scrollY, [0, 1000], [0, 200]);
  const yPos = useSpring(yRange, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 40,
        y: (e.clientY / window.innerHeight - 0.5) * 40,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-background">
      {/* Background Decorative elements */}
      <div className={`absolute top-[20%] left-[10%] h-96 w-96 rounded-full blur-[120px] ${isDark ? 'bg-primary/5' : 'bg-primary/10'}`} />
      <div className={`absolute bottom-[20%] right-[10%] h-[500px] w-[500px] rounded-full blur-[150px] ${isDark ? 'bg-accent/5' : 'bg-accent/10'}`} />
      
      {/* Background Robots Swarm */}
      {[
        { id: 'main-right', xRatio: 1, yFactor: 1, scale: 1, opacity: 1, top: "15%", right: "5%", lgRight: "15%", lgTop: "20%", rotate: [0, 2, -2, 0], duration: 5, grayscale: 0 },
        { id: 'bg-left-1', xRatio: -0.4, yFactor: 1.1, scale: 0.7, opacity: 0.4, top: "35%", left: "8%", lgLeft: "12%", rotate: [0, -3, 3, 0], duration: 7, grayscale: 0.5 },
        { id: 'bg-right-bottom', xRatio: 0.2, yFactor: 0.8, scale: 0.5, opacity: 0.2, bottom: "10%", right: "20%", rotate: [0, 5, -5, 0], duration: 8, grayscale: 0.8 },
        { id: 'bg-left-top', xRatio: -0.6, yFactor: 1.2, scale: 0.4, opacity: 0.15, top: "10%", left: "25%", rotate: [0, 2, -2, 0], duration: 6, grayscale: 0.9 },
        { id: 'bg-center-bottom', xRatio: 0.1, yFactor: 0.9, scale: 0.3, opacity: 0.1, bottom: "25%", left: "45%", rotate: [0, -4, 4, 0], duration: 10, grayscale: 1 },
        { id: 'bg-right-top', xRatio: 0.8, yFactor: 1.3, scale: 0.35, opacity: 0.25, top: "5%", right: "30%", rotate: [0, 4, -4, 0], duration: 9, grayscale: 0.7 },
        { id: 'bg-left-mid', xRatio: -0.8, yFactor: 0.7, scale: 0.45, opacity: 0.18, top: "60%", left: "15%", rotate: [0, -2, 2, 0], duration: 6.5, grayscale: 0.85 },
        { id: 'bg-far-right', xRatio: 1.5, yFactor: 1.1, scale: 0.25, opacity: 0.1, top: "45%", right: "8%", rotate: [0, 6, -6, 0], duration: 11, grayscale: 0.95 },
        { id: 'bg-center-top', xRatio: -0.2, yFactor: 1.4, scale: 0.2, opacity: 0.08, top: "18%", left: "40%", rotate: [0, -5, 5, 0], duration: 12, grayscale: 1 },
      ].map((bot) => (
        <RobotInstance key={bot.id} bot={bot} mousePos={mousePos} yPos={yPos} isDark={isDark} />
      ))}

      {/* Futuristic Grid / Scanlines */}

      {/* Futuristic Grid / Scanlines */}
      <div 
        className={`absolute inset-0 opacity-[0.03] ${isDark ? 'invert-0' : 'invert'}`} 
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} 
      />
    </div>
  );
};

export default Robot3D;
