import { fetchNoteById } from "@/lib/api";
import { QueryClient, dehydrate, HydrationBoundary } from "@tanstack/react-query";
import NotePreviewModal from "./NotePreview.client"; // Перевір, щоб ім'я файлу було саме таким

type Props = { params: Promise<{ id: string }> };

const NotePreview = async ({ params }: Props) => {
  const { id } = await params;
  const queryClient = new QueryClient();

  // 1. Префетчимо дані
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    // 2. ОБОВ'ЯЗКОВО обгортаємо в HydrationBoundary
    <HydrationBoundary state={dehydratedState}>
      {/* 3. Передаємо тільки id! Ніяких dehydratedState в пропси */}
      <NotePreviewModal id={id} />
    </HydrationBoundary>
  );
};

export default NotePreview;