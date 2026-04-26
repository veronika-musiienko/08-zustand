"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "react-toastify"; // Замість showErrorToast

import Modal from "@/components/Modal/Modal";
import Loader from "@/components/Loader/Loader";
import { fetchNoteById } from "@/lib/api";
import css from "./NotePreview.module.css";

// Чекаємо тільки id
type NotePreviewProps = {
  id: string;
};

export default function NotePreviewModal({ id }: NotePreviewProps) {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const close = () => router.back();

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong while fetching the note.");
    }
  }, [isError]);

  return (
    <Modal onClose={close}>
      {isLoading && <Loader />}
      {data && (
        <div className={css.wrapper}>
          <div className={css.header}>
            <p className={css.tag}>{data.tag}</p>
            <button onClick={close} className={css.closeBtn}>Close</button>
          </div>
          <h2 className={css.title}>{data.title}</h2>
          <p className={css.content}>{data.content}</p>
          <p className={css.date}>
            {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </Modal>
  );
}
