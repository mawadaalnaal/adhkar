import { FavoritesClient } from "@/components/FavoritesClient";
import { TopBar } from "@/components/TopBar";

export default function FavoritesPage() {
  return (
    <div className="flex min-h-full flex-col font-sans">
      <TopBar />
      <FavoritesClient />
    </div>
  );
}
