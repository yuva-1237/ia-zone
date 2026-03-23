import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  name: string;
  description: string;
  path: string;
  icon: React.ReactNode;
}

const ToolCard = ({ name, description, path, icon }: ToolCardProps) => {
  const { t } = useLanguage();

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 card-shadow hover:card-shadow-hover hover:-translate-y-1">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-primary text-primary-foreground">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-card-foreground">{name}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{description}</p>
      <Link to={path} className="mt-4 inline-block">
        <Button variant="ghost" size="sm" className="group/btn gap-1 px-0 text-primary hover:text-primary">
          {t("tools.explore")}
          <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </Link>
    </div>
  );
};

export default ToolCard;
