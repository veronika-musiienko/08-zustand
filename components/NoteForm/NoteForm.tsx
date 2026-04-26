"use client";

import css from "../NoteForm/NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNote } from "../../lib/api";
import { toast } from "react-toastify"; 
import { useNoteDraftStore } from "@/lib/store/noteStore";
import type { NewNote } from "../../types/note";

export default function NoteForm() {
  const queryClient = useQueryClient();
  const router = useRouter();
  
 
  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const close = () => router.back();

  const { mutate } = useMutation({
    mutationFn: (newNote: NewNote) => createNote(newNote),
    onSuccess: () => {
      toast.success("Note created successfully! 🎉");
      clearDraft(); 
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      close();
    },
    onError: () => {
     
      toast.error("Failed to create note. Please try again.");
    },
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    
    mutate(draft);
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          placeholder="Enter title..."
          value={draft.title} 
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          placeholder="Write your note here..."
          value={draft.content} 
          onChange={handleChange}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button type="button" className={css.cancelButton} onClick={close}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          Create note
        </button>
      </div>
    </form>
  );
}