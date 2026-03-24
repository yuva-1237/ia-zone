import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export const RobotSVG = ({ isDark, className }: { isDark: boolean; className?: string }) => (
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-2xl ${className}`}>
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
      
      {/* The "3D" Robot (Right) */}
      <motion.div
        style={{ 
          x: mousePos.x, 
          y: yPos,
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute right-[5%] top-[15%] lg:right-[15%] lg:top-[20%]"
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          <RobotSVG isDark={isDark} />
          
          {/* Glow beneath robot */}
          <div className={`absolute -bottom-10 left-1/2 -z-10 h-10 w-20 -translate-x-1/2 rounded-full blur-2xl ${isDark ? 'bg-primary/20' : 'bg-primary/30'}`} />
        </motion.div>
      </motion.div>

      {/* The "3D" Robot (Left) - NEW */}
      <motion.div
        style={{ 
          x: -mousePos.x * 0.5, 
          y: yPos,
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.6, scale: 0.8 }}
        transition={{ duration: 2, delay: 0.5 }}
        className="absolute left-[2%] top-[30%] lg:left-[10%] lg:top-[40%] hidden md:block"
      >
        <motion.div
          animate={{
            y: [0, 15, 0],
            rotate: [0, -3, 3, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative opacity-40 grayscale-[0.5]"
        >
          <RobotSVG isDark={isDark} />
          <div className={`absolute -bottom-10 left-1/2 -z-10 h-10 w-20 -translate-x-1/2 rounded-full blur-2xl ${isDark ? 'bg-accent/10' : 'bg-accent/20'}`} />
        </motion.div>
      </motion.div>

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
