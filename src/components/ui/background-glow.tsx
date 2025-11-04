"use client";

export default function BackgroundGlow() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      
      {/* Top left glow - Blue */}
      <div 
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.4) 30%, transparent 70%)",
          animationDuration: "4s",
        }}
      />
      
      {/* Top right glow - Purple */}
      <div 
        className="absolute -top-20 -right-32 w-80 h-80 rounded-full opacity-25 blur-3xl animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(147, 51, 234, 0.7) 0%, rgba(147, 51, 234, 0.3) 40%, transparent 70%)",
          animationDuration: "5s",
          animationDelay: "1s",
        }}
      />
      
      {/* Middle left glow - Cyan */}
      <div 
        className="absolute top-1/3 -left-32 w-72 h-72 rounded-full opacity-15 blur-3xl animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.6) 0%, rgba(6, 182, 212, 0.3) 35%, transparent 70%)",
          animationDuration: "6s",
          animationDelay: "2s",
        }}
      />
      
      {/* Middle right glow - Indigo */}
      <div 
        className="absolute top-1/2 -right-24 w-64 h-64 rounded-full opacity-20 blur-3xl animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.7) 0%, rgba(99, 102, 241, 0.4) 30%, transparent 70%)",
          animationDuration: "4.5s",
          animationDelay: "0.5s",
        }}
      />
      
      {/* Bottom center glow - Blue-Purple */}
      <div 
        className="absolute -bottom-32 left-1/2 transform -translate-x-1/2 w-96 h-96 rounded-full opacity-18 blur-3xl animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(79, 70, 229, 0.6) 0%, rgba(139, 92, 246, 0.4) 40%, transparent 70%)",
          animationDuration: "5.5s",
          animationDelay: "1.5s",
        }}
      />
      
      {/* Hero section accent glow */}
      <div 
        className="absolute top-20 left-1/4 w-48 h-48 rounded-full opacity-10 blur-2xl animate-pulse"
        style={{
          background: "radial-gradient(circle, rgba(168, 85, 247, 0.8) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 70%)",
          animationDuration: "7s",
          animationDelay: "3s",
        }}
      />
      
      {/* Floating orbs with subtle movement */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-3/4 w-32 h-32 rounded-full opacity-12 blur-xl animate-float"
          style={{
            background: "radial-gradient(circle, rgba(34, 197, 94, 0.5) 0%, transparent 70%)",
          }}
        />
        <div 
          className="absolute top-2/3 left-1/4 w-24 h-24 rounded-full opacity-15 blur-xl animate-float-delayed"
          style={{
            background: "radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, transparent 70%)",
          }}
        />
        <div 
          className="absolute top-3/4 right-1/3 w-28 h-28 rounded-full opacity-10 blur-xl animate-float-slow"
          style={{
            background: "radial-gradient(circle, rgba(251, 146, 60, 0.5) 0%, transparent 70%)",
          }}
        />
      </div>
      
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)",
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}