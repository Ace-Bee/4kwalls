import { Header } from "@/components/common/Header";
import { Hero } from "@/components/home/Hero";
import { GLBackground } from "@/components/home/GLBackground";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 overflow-hidden">
      {/* WebGL Background - z-0 */}
      <GLBackground />

      {/* Content - z-10 */}
      <div className="relative z-10">
        <Header />
        <Hero />
      </div>
    </main>
  );
}
