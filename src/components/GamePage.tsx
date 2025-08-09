import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose, MdFullscreen, MdOpenInNew } from "react-icons/md";
import { Button } from "@/components/ui/button";
import type { Game } from "./GameList";
import { toast } from "@/hooks/use-toast";

interface GamePageProps {
  game: Game | null;
  onClose: () => void;
}

const spring = { type: "spring", stiffness: 480, damping: 24 } as const;

export default function GamePage({ game, onClose }: GamePageProps) {
  const [loading, setLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setLoading(true);
  }, [game?.id]);

  const tryFullscreen = async () => {
    try {
      const iframeEl: any = iframeRef.current;
      const containerEl: any = containerRef.current;
      if (iframeEl?.requestFullscreen) {
        await iframeEl.requestFullscreen();
        return;
      }
      if (iframeEl?.webkitRequestFullscreen) {
        await iframeEl.webkitRequestFullscreen();
        return;
      }
      if (containerEl?.requestFullscreen) {
        await containerEl.requestFullscreen();
        return;
      }
      if (containerEl?.webkitRequestFullscreen) {
        await containerEl.webkitRequestFullscreen();
        return;
      }
      // Fallback: open in new tab
      if (game?.url) window.open(game.url, "_blank", "noopener,noreferrer");
      toast({ title: "Fullscreen not available", description: "Opened in a new tab instead." });
    } catch (e) {
      if (game?.url) window.open(game.url, "_blank", "noopener,noreferrer");
      toast({ title: "Fullscreen blocked", description: "Opened in a new tab due to permissions." });
    }
  };

  return (
    <AnimatePresence>
      {game && (
        <motion.div
          ref={containerRef}
          key={game.id}
          className="fixed inset-0 top-16 z-40 bg-background/95 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            layoutId={`card-${game.id}`}
            transition={spring}
            className="container mx-auto h-full flex flex-col gap-3"
          >
            <div className="flex items-center justify-between py-3">
              <h2 className="text-lg font-medium">{game.title}</h2>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={tryFullscreen} aria-label="Enter fullscreen">
                  <MdFullscreen size={18} aria-hidden />
                  <span className="hidden sm:inline ml-1">Fullscreen</span>
                </Button>
                <Button variant="secondary" onClick={() => window.open(game.url, "_blank", "noopener,noreferrer")} aria-label="Open in new tab">
                  <MdOpenInNew size={18} aria-hidden />
                  <span className="hidden sm:inline ml-1">Open</span>
                </Button>
                <Button onClick={onClose} aria-label="Close">
                  <MdClose size={18} aria-hidden />
                  <span className="hidden sm:inline ml-1">Home</span>
                </Button>
              </div>
            </div>

            <div className="relative flex-1 rounded-lg overflow-hidden border bg-card">
              {loading && (
                <div className="absolute inset-0 grid place-items-center">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-primary to-accent animate-spin" />
                </div>
              )}
              <motion.iframe
                layoutId={`thumb-${game.id}`}
                ref={iframeRef}
                src={game.url}
                title={game.title}
                className="h-full w-full"
                allow="fullscreen; autoplay; picture-in-picture"
                allowFullScreen
                onLoad={() => setLoading(false)}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
