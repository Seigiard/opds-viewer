import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Header, BooksGrid, Folder, Book } from "./LayoutExample";
import "./styles/reset.css";
import "./styles/index.css";
import "./styles/header.css";
import "./styles/variations.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Header title="My Collection" breadcrumb="Library" homeHref="/" showSearch searchPlaceholder="Search collection..." />
    <BooksGrid>
      <Folder title="Fiction" href="#" />
      <Folder title="Science Fiction" description="Explore the universe" href="#" />
      <Book
        title="One Hundred Years of Solitude"
        author="Gabriel Garcia Marquez"
        description="The brilliant, bestselling, landmark novel that tells the story of the Buendia family."
      />
      <Book cover="https://picsum.photos/seed/book3/200/500" title="Anonymous Tales" />
      <Book cover="https://picsum.photos/seed/book1/200/300" title="Pride and Prejudice" author="Jane Austen" />
    </BooksGrid>
  </StrictMode>,
);

/*
1. replace to div
2. for folder h1 as a
3. for book div has checkbox, h1 as label
4. show popup
*/
