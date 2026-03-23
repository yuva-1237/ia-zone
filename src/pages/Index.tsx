import { useLanguage } from "@/contexts/LanguageContext";
import ToolCard from "@/components/ToolCard";
import { MessageSquare } from "lucide-react";

const tools = [
  {
    name: "Advanced Generalist AI Assistant",
    description: "A powerful AI chatbot that can help with any task — writing, research, coding, brainstorming, and more.",
    path: "/tool/advanced-generalist-ai-assistant",
    icon: <MessageSquare className="h-6 w-6" />,
  },
];

const Index = () => {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold gradient-text sm:text-5xl">
          {t("tools.title")}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t("tools.subtitle")}
        </p>
      </div>
      <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.path} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default Index;
