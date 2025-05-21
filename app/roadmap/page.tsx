"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Roadmap() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push("/");
          return;
        }
        
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
          
        if (data) {
          setProfile(data);
        } else {
          router.push("/questionnaire");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router, supabase]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="px-4 lg:px-6 h-14 flex items-center border-b sticky top-0 z-10 bg-background">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft size={18} />
            </Button>
            <span className="font-bold text-xl">Your Learning Roadmap</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <Home size={18} />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Your Career Roadmap</h1>
          <p className="text-muted-foreground mb-12">
            Based on your profile and preferences, we've created a personalized learning roadmap to help you achieve your career goals.
          </p>

          {/* Roadmap Visualization */}
          <div className="relative w-full h-[500px] mb-16">
            {/* SVG Road Path */}
            <svg 
              className="absolute inset-0 w-full h-full" 
              viewBox="0 0 800 500" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.15))" }}
            >
              {/* Main curved path */}
              <path 
                d="M50,250 C150,50 350,450 450,250 C550,50 750,250 750,250" 
                stroke="currentColor" 
                strokeWidth="40" 
                strokeLinecap="round"
                className="text-muted/30 dark:text-muted/20"
              />
              {/* Path border top */}
              <path 
                d="M50,250 C150,50 350,450 450,250 C550,50 750,250 750,250" 
                stroke="currentColor" 
                strokeWidth="44" 
                strokeLinecap="round"
                className="text-muted/10 dark:text-muted/10"
                strokeDasharray="10,10"
              />
              {/* Path lines */}
              <path 
                d="M50,250 C150,50 350,450 450,250 C550,50 750,250 750,250" 
                stroke="white" 
                strokeWidth="4" 
                strokeLinecap="round"
                strokeDasharray="15,15"
                className="dark:stroke-neutral-800"
              />
            </svg>

            {/* Interactive Points */}
            <div className="absolute top-[100px] left-[150px] transform -translate-x-1/2 -translate-y-1/2">
              <RoadmapNode 
                number={1}
                title="College Recommendations"
                description="Find the right college for you"
                active={true}
                href="/roadmap/foundation"
              />
            </div>

            <div className="absolute top-[350px] left-[400px] transform -translate-x-1/2 -translate-y-1/2">
              <RoadmapNode 
                number={2}
                title="Online Courses"
                description="Develop foundational skills"
                active={false}
                href="/roadmap/specialization"
              />
            </div>

            <div className="absolute top-[200px] left-[700px] transform -translate-x-1/2 -translate-y-1/2">
              <RoadmapNode 
                number={3}
                title="Build My Portfolio"
                description="Create a portfolio to showcase your skills"
                active={false}
                href="/roadmap/career"
              />
            </div>
          </div>

          {/* Roadmap Description */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-semibold mb-4">Your Personalized Learning Journey</h2>
              <p className="mb-4">
                This roadmap is designed based on your academic background and career interests. 
                Click on each milestone to explore detailed learning resources and recommendations.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3 mt-6">
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <h3 className="font-semibold mb-2">1. Foundation Skills</h3>
                  <p className="text-sm text-muted-foreground">Build fundamental knowledge and develop core competencies.</p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <h3 className="font-semibold mb-2">2. Specialization</h3>
                  <p className="text-sm text-muted-foreground">Choose your specialization path and deepen your expertise.</p>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                  <h3 className="font-semibold mb-2">3. Career Ready</h3>
                  <p className="text-sm text-muted-foreground">Prepare for industry with portfolio projects and interview prep.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

// Roadmap node component for each stage
function RoadmapNode({ 
  number, 
  title, 
  description, 
  active, 
  href 
}: { 
  number: number;
  title: string;
  description: string;
  active: boolean;
  href: string;
}) {
  const router = useRouter();
  
  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={() => router.push(href)}
        className={`w-16 h-16 rounded-full text-lg font-bold flex items-center justify-center relative ${
          active 
            ? "bg-primary hover:bg-primary/90 text-primary-foreground"
            : "bg-muted hover:bg-muted/90 text-muted-foreground"
        }`}
      >
        {number}
        {/* Pulsing animation for active node */}
        {active && (
          <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
        )}
      </Button>
      <div className="mt-2 bg-card shadow-lg rounded-lg p-3 text-center w-40 border">
        <h3 className="font-medium">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}