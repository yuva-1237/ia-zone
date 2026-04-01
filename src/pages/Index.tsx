import { useLanguage } from "@/contexts/LanguageContext";
import ToolCard from "@/components/ToolCard";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const tools = [
    {
      name: t("tools.botName"),
      description: t("tools.botDesc"),
      path: "/tool/advanced-generalist-ai-assistant",
      icon: <MessageSquare className="h-7 w-7" />,
    },
  ];
  
  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container mx-auto px-4 py-20 lg:py-32">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-12 text-center"
      >
        <h1 className="font-display text-5xl font-black gradient-text sm:text-7xl lg:text-8xl tracking-tighter neon-glow">
          {t("tools.title")}
        </h1>
        <p className="mt-6 mx-auto max-w-2xl text-xl text-foreground leading-relaxed lg:text-2xl">
          {t("tools.subtitle")}
        </p>
      </motion.div>
      
      {/* Search Bar Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mx-auto mb-16 max-w-2xl"
      >
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-glow transition-colors" />
          </div>
          <Input
            type="text"
            placeholder={t("tools.search")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-14 pl-12 pr-4 text-lg glass-card border-white/10 focus:ring-primary/50 focus:border-primary/50 placeholder:text-muted-foreground/50 transition-all duration-300 rounded-2xl shadow-lg ring-0 outline-none"
          />
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-purple-500/10 to-accent/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
        </div>
      </motion.div>
      
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <ToolCard key={tool.path} {...tool} />
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-20 text-center"
            >
              <p className="text-xl text-muted-foreground">{t("tools.noResults")}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
