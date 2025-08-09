import { memo } from "react";
import { motion } from "framer-motion";
import { MdStar } from "react-icons/md";
import { Button } from "@/components/ui/button";

export interface Game {
  id: number;
  title: string;
  thumbnail: string;
  url: string;
  tags: string[];
  rating: number;
}

interface GameListProps {
  games: Game[];
  onSelect: (id: number) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

const spring = { type: "spring", stiffness: 480, damping: 24 } as const;

const GameList = memo(({ games, onSelect, selectedTag, setSelectedTag }: GameListProps) => {
  const allTags = Array.from(new Set(games.flatMap((g) => g.tags))).sort();

  return (
    <section className="container mx-auto py-6">
      <div className="flex gap-2 flex-wrap mb-4">
        <Button
          variant={selectedTag ? "secondary" : "default"}
          onClick={() => setSelectedTag(null)}
          className="h-8"
        >
          All
        </Button>
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTag === tag ? "default" : "secondary"}
            onClick={() => setSelectedTag(tag)}
            className="h-8"
          >
            {tag}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {games.map((game) => (
          <motion.article
            key={game.id}
            layoutId={`card-${game.id}`}
            transition={spring}
            whileHover={{ scale: 1.03, rotate: 0.2, y: -3 }}
            whileTap={{ scale: 0.98 }}
            role="button"
            tabIndex={0}
            aria-label={`Open ${game.title}`}
            onClick={() => onSelect(game.id)}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(game.id)}
            className="group rounded-lg overflow-hidden border bg-card text-card-foreground cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="aspect-video overflow-hidden">
              <motion.img
                layoutId={`thumb-${game.id}`}
                src={game.thumbnail}
                alt={`${game.title} thumbnail`}
                className="h-full w-full object-cover group-hover:brightness-105"
                loading="lazy"
                transition={spring}
              />
            </div>
            <div className="p-3 flex items-center justify-between">
              <h3 className="font-medium truncate" title={game.title}>{game.title}</h3>
              <div className="flex items-center gap-1 text-accent-foreground">
                <MdStar aria-hidden />
                <span className="text-sm">{game.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="px-3 pb-3 flex gap-2 flex-wrap">
              {game.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground border">
                  {t}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
});

export default GameList;
