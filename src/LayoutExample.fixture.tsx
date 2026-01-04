import { useState } from "react";
import { Header, BooksGrid, Folder, Book } from "./LayoutExample";

export default {
  Default: (
    <>
      <Header
        title="My Collection"
        breadcrumb="Library"
        homeHref="/"
        showSearch
        searchPlaceholder="Search collection..."
      />
      <BooksGrid>
        <Folder title="Fiction" href="#" />
        <Folder title="Science Fiction" description="Explore the universe" href="#" />
        <Book
          title="One Hundred Years of Solitude: A Novel of Epic Proportions New Edition A Novel of Epic Proportions"
          author="Gabriel Garcia Marquez"
          description="The brilliant, bestselling, landmark novel that tells the story of the Buendia family."
        />
        <Book
          cover="https://picsum.photos/seed/book2/200/200"
          title="One Hundred Years of Solitude: A Novel of Epic Proportions"
          author="Gabriel Garcia Marquez"
        />
        <Book cover="https://picsum.photos/seed/book3/200/500" title="Anonymous Tales" />
        <Book cover="https://picsum.photos/seed/book1/200/300" title="Pride and Prejudice" author="Jane Austen" />
      </BooksGrid>
    </>
  ),
  ResponsiveGridWidth: () => {
    const [count, setCount] = useState(0);
    function decrease() {
      setCount((c) => c > 1 && c - 1);
    }
    function increase() {
      setCount((c) => c + 1);
    }
    return (
      <>
        <button onClick={decrease}>-</button>
        <button onClick={increase}>+</button>
        <Header
          title="My Collection"
          breadcrumb="Library"
          homeHref="/"
          showSearch
          searchPlaceholder="Search collection..."
        />
        <BooksGrid>
          {Array.from({ length: count }, (_, i) => (
            <Book
              cover={`https://picsum.photos/seed/book${i}/200/200`}
              title={`Book ${i + 1}`}
              author={`Author ${i + 1}`}
            />
          ))}
        </BooksGrid>
      </>
    );
  },
};
