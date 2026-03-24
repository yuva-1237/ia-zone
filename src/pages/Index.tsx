import { useLanguage } from "@/contexts/LanguageContext";
import ToolCard from "@/components/ToolCard";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

const tools = [
  {
    name: "Advanced Generalist AI Assistant",
    description: "A powerful AI chatbot that can help with any task — writing, research, coding, brainstorming, and more.",
    path: "/tool/advanced-generalist-ai-assistant",
    icon: <MessageSquare className="h-7 w-7" />,
  },
];

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-20 lg:py-32">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-20 text-center"
      >
        <h1 className="font-display text-5xl font-black gradient-text sm:text-7xl lg:text-8xl tracking-tighter neon-glow">
          {t("tools.title")}
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-xl text-muted-foreground/80 leading-relaxed lg:text-2xl">
          {t("tools.subtitle")}
        </p>
        
        {/* Animated scroll indicator or similar could go here */}
      </motion.div>
      
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool, index) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default Index;
