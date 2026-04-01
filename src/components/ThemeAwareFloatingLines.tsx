import { useTheme } from "@/contexts/ThemeContext";
import FloatingLines from "./FloatingLines";

export default function ThemeAwareFloatingLines() {
  const { theme } = useTheme();
  
  const isDark = theme === "dark";
  
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-auto">
      <FloatingLines 
        enabledWaves={["top", "middle", "bottom"]}
        lineCount={isDark ? 5 : 4}
        lineDistance={isDark ? 5 : 6}
        bendRadius={5}
        bendStrength={-0.5}
        interactive={true}
        parallax={true}
        backgroundColor={isDark ? '#000000' : '#ffffff'}
        linesGradient={
          isDark 
            ? ['#8b5cf6', '#d8b4fe', '#fdf4ff'] 
            : ['#8b5cf6', '#a78bfa', '#c4b5fd'] // Purple lines for light theme
        }
        mixBlendMode={isDark ? 'screen' : 'multiply'}
      />
    </div>
  );
}
