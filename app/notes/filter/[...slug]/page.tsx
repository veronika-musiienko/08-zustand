import { Metadata } from "next";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import NotesClient from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const paramsQuery = await params;
  const slug = paramsQuery.slug || [];
  const tag = slug[0] || "all";

  const displayTag = tag.charAt(0).toUpperCase() + tag.slice(1);
  const title = tag.toLowerCase() === "all" ? "All Notes" : `Notes - ${displayTag}`;

  return {
    title: `${title} | NoteHub`,
    description: `Browse and manage your ${tag.toLowerCase()} notes in your personal workspace.`,
    openGraph: {
      title: `${title} | NoteHub`,
      description: `Viewing ${tag.toLowerCase()} notes.`,
      // ДОДАНО ОБОВ'ЯЗКОВІ ВЛАСТИВОСТІ:
      url: `https://notehub-07.vercel.app/notes/filter/${tag}`, // Вкажи свій актуальний URL на Vercel
      siteName: "NoteHub",
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg", // Стандартне посилання з ТЗ
          width: 1200,
          height: 630,
          alt: "NoteHub Preview",
        },
      ],
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
      <NotesClient key={tag} tag={tag} />
    </HydrationBoundary>
  );
}