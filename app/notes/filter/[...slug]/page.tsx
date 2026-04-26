import { Metadata } from "next"; // Імпортуємо Metadata
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

// 1. Додаємо функцію generateMetadata для динамічного SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paramsQuery = await params;
  const slug = paramsQuery.slug || [];
  const tag = slug[0] || "all";

  // Формуємо гарний заголовок: "Notes - Work" або "All Notes"
  const displayTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  const title = tag.toLowerCase() === "all" ? "All Notes" : `Notes - ${displayTag}`;

  return {
    title: `${title} | NoteHub`,
    description: `Browse and manage your ${tag.toLowerCase()} notes in your personal workspace.`,
    openGraph: {
      title: `${title} | NoteHub`,
      description: `Viewing ${tag.toLowerCase()} notes.`,
      type: "website",
    },
  };
}

export default async function NotesPage({ params }: Props) {
  const paramsQuery = await params;
  const slug = paramsQuery.slug || [];
  const tag = slug[0] || "all";
  const page = 1;

  const queryClient = new QueryClient();

  // 2. Префетчимо дані (тут все було вірно)
  await queryClient.prefetchQuery({
    queryKey: ["notes", "", tag, page], 
    queryFn: () =>
      fetchNotes({
        searchQuery: "",
        tag: tag.toLowerCase() === "all" ? undefined : tag,
        page: page,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* Ключ key={tag} допоможе правильно перемикати стан при зміні фільтра */}
      <NotesClient key={tag} tag={tag} />
    </HydrationBoundary>
  );
}