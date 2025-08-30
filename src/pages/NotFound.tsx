import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <div className="text-8xl mb-6 animate-pulse-life">🌳</div>
        <h1 className="text-6xl font-bold mb-4 text-primary">404</h1>
        <h2 className="text-2xl font-semibold mb-4 text-foreground">Lost in the Cosmos?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Even Groot can't find this page! Let's get you back to restoring the homeworld.
        </p>
        <div className="space-y-4">
          <p className="text-cosmic-energy font-medium italic">
            "I am Groot!" 
            <br />
            <span className="text-sm text-muted-foreground">
              (Translation: "This page doesn't exist!")
            </span>
          </p>
          <Button 
            onClick={() => window.location.href = "/"}
            className="shadow-growth"
            size="lg"
          >
            🏠 Return to Homeworld
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
