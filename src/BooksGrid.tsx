import { ElementType } from "react";
import { PolymorphicProps } from "./polymorphic";

type BooksGridProps<T extends ElementType = "div"> = PolymorphicProps<T>;

export function BooksGrid<T extends ElementType = "div">({ as, ...props }: BooksGridProps<T>) {
  const Component = as || "div";
  return <Component className="books-grid" {...props} />;
}
