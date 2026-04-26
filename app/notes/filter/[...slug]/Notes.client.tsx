"use client";

import css from "./Notes.client.module.css";
import { useState, useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import Link from "next/link";
import { fetchNotes } from "@/lib/api";
import { toast, ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 

import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import Loader from "@/components/Loader/Loader";


type NoteClientProps = {
  tag: string;
};

export default function NotesClient({ tag }: NoteClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [inputValue, setInputValue] = useState("");

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 300);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    updateSearchQuery(value);
  };

  const queryTag = tag?.toLowerCase() === "all" ? undefined : tag;

  const { data, isLoading, isSuccess, isError } = useQuery({
    queryKey: ["notes", searchQuery, tag, currentPage],
    queryFn: () =>
      fetchNotes({
        searchQuery: searchQuery,
        tag: queryTag,
        page: currentPage,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false, // Забороняємо перепитувати дані, які вже прийшли з сервера
  });

  const totalPages = data?.totalPages || 0;
  const noNotesToastShown = useRef(false);

  // Обробка помилок завантаження
  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong while fetching notes.");
    }
  }, [isError]);

  // Обробка порожнього списку
  useEffect(() => {
    if (!isLoading && data && data.notes.length === 0 && searchQuery !== "") {
      if (!noNotesToastShown.current) {
        toast.info("No notes found for your request.");
        noNotesToastShown.current = true;
      }
    } else {
      noNotesToastShown.current = false;
    }
  }, [data, isLoading, searchQuery]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleInputChange} value={inputValue} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
        {/* Кнопка створення нотатки через Link — це гуд! */}
        <Link className={css.button} href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {isLoading && <Loader />}
      
      {isSuccess && data?.notes?.length > 0 ? (
        <NoteList notes={data.notes} />
      ) : (
        !isLoading && <p className={css.emptyMessage}>No notes here yet.</p>
      )}

      {}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}