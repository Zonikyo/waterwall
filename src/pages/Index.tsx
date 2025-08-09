import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LayoutGroup } from "framer-motion";
import Navbar from "@/components/Navbar";
import GameList, { type Game } from "@/components/GameList";
import GamePage from "@/components/GamePage";

const Index = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating-desc");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const navigate = useNavigate();
  const params = useParams();
  const selectedId = params.id ? Number(params.id) : null;
  const selectedGame = useMemo(() => games.find((g) => g.id === selectedId) || null, [games, selectedId]);

  useEffect(() => {
    document.title = selectedGame ? `${selectedGame.title} | Arcade Nexus` : "Arcade Nexus — Play Free Web Games";
  }, [selectedGame]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/games.json");
        const data = (await res.json()) as Game[];
        setGames(data);
      } catch (e) {
        // fallback empty
        setGames([]);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = games.filter((g) =>
      (!q || g.title.toLowerCase().includes(q) || g.tags.some((t) => t.toLowerCase().includes(q))) &&
      (!selectedTag || g.tags.includes(selectedTag))
    );
    if (sort === "title-asc") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "rating-desc") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [games, search, selectedTag, sort]);

  const openGame = (id: number) => navigate(`/game/${id}`);
  const closeGame = () => navigate(`/`);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar search={search} setSearch={setSearch} sort={sort} setSort={setSort} />
      <main className="pt-2" role="main">
        <h1 className="sr-only">Play free web games on Arcade Nexus</h1>
        <LayoutGroup>
          <GameList games={filtered} onSelect={openGame} selectedTag={selectedTag} setSelectedTag={setSelectedTag} />
          <GamePage game={selectedGame} onClose={closeGame} />
        </LayoutGroup>
      </main>
    </div>
  );
};

export default Index;
