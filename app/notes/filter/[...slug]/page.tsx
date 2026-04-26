import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function NotesPage({ params }: Props) {
  const paramsQuery = await params;
  const slug = paramsQuery.slug || [];
  const tag = slug[0] || "all";
  const page = 1;

  const queryClient = new QueryClient();

  // 1. Попередньо завантажуємо дані в кеш
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
    // 2. Обгортаємо в HydrationBoundary
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* 3. ВИДАЛЯЄМО initialData! Передаємо тільки tag */}
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}