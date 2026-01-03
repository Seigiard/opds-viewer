import { BooksGrid } from "./BooksGrid";
import { Folder, Book } from "./GenericItem";

export default (
  <BooksGrid>
    <Folder title="Fiction" href="#" />
    <Folder title="Science Fiction" description="Explore the universe" href="#" />
    <Book
      title="One Hundred Years of Solitude: A Novel of Epic Proportions New Edition A Novel of Epic Proportions"
      author="Gabriel Garcia Marquez"
      description="The brilliant, bestselling, landmark novel that tells the story of the Buendia family."
    />
    <Book
      cover="https://picsum.photos/seed/book2/200/300"
      title="One Hundred Years of Solitude: A Novel of Epic Proportions"
      author="Gabriel Garcia Marquez"
    />
    <Book cover="https://picsum.photos/seed/book3/200/300" title="Anonymous Tales" />
    <Book cover="https://picsum.photos/seed/book1/200/300" title="Pride and Prejudice" author="Jane Austen" />
  </BooksGrid>
);
