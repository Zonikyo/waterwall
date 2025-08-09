import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaGamepad } from "react-icons/fa";
import { MdHome, MdSearch } from "react-icons/md";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  search: string;
  setSearch: (v: string) => void;
  sort: string;
  setSort: (v: string) => void;
}

const Navbar = memo(({ search, setSearch, sort, setSort }: NavbarProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
      <nav className="container mx-auto h-16 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Arcade Nexus Home"
        >
          <FaGamepad className="text-primary" size={22} aria-hidden />
          <span className="font-semibold tracking-wide">Arcade Nexus</span>
        </button>

        <div className="flex-1 max-w-2xl flex items-center gap-3">
          <div className="relative flex-1">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} aria-hidden />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search games..."
              className="pl-9"
              aria-label="Search games"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-secondary text-foreground rounded-md px-2 py-2 border"
              aria-label="Sort games"
            >
              <option value="rating-desc">Rating: High → Low</option>
              <option value="title-asc">Title: A → Z</option>
            </select>
          </label>
        </div>

        <motion.button
          whileHover={{ y: -1, scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 rounded-md px-3 py-2 border bg-secondary"
          aria-label="Home"
        >
          <MdHome size={18} aria-hidden />
          <span className="hidden sm:inline">Home</span>
        </motion.button>
      </nav>
    </header>
  );
});

export default Navbar;
