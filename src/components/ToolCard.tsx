import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

import { motion } from "framer-motion";

interface ToolCardProps {
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const ToolCard = ({ name, description, path, icon }: ToolCardProps) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-2xl glass-card p-8 transition-all duration-300 hover:shadow-2xl"
    >
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 text-primary shadow-glow">
        <div className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
          {icon}
        </div>
      </div>
      <h3 className="font-display text-xl font-bold neon-glow">{name}</h3>
      <p className="mt-3 text-muted-foreground/90 leading-relaxed dark:text-foreground/80">{description}</p>
      <Link to={path} className="mt-6 inline-block">
        <Button variant="ghost" size="sm" className="group/btn gap-2 px-0 text-primary hover:text-primary hover:bg-transparent">
          <span className="font-semibold">{t("tools.explore")}</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1.5" />
        </Button>
      </Link>
      
      {/* Decorative gradient blob */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary/10 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />
    </motion.div>
  );
};

export default ToolCard;
