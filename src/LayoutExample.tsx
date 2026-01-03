import { ComponentPropsWithoutRef, useId } from "react";

export function Header({
  title,
  breadcrumb,
  homeHref = "/",
  showSearch = false,
  searchPlaceholder = "Search...",
  ...props
}: ComponentPropsWithoutRef<"header"> & {
  title?: string;
  breadcrumb?: string;
  homeHref?: string;
  showSearch?: boolean;
  searchPlaceholder?: string;
}) {
  return (
    <header className="header" {...props}>
      <div className="header__left">
        <nav className="header__breadcrumb">
          <a className="header__home" href={homeHref} aria-label="Home">
            <svg className="header__icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </a>
          {breadcrumb && (
            <>
              <span className="header__separator" aria-hidden="true">
                ›
              </span>
              <span className="header__breadcrumb-text">{breadcrumb}</span>
            </>
          )}
        </nav>
        {title && <h1 className="header__title">{title}</h1>}
      </div>
      {showSearch && (
        <div className="header__search-wrapper">
          <svg className="header__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <path d="m21 21-4.35-4.35" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input type="search" className="header__search" placeholder={searchPlaceholder} />
        </div>
      )}
    </header>
  );
}

export function BooksGrid(props: ComponentPropsWithoutRef<"div">) {
  return (
    <>
      {/* Hidden radio for closing popups */}
      <input type="radio" name="popup" id="popup-none" className="popup-reset" defaultChecked />
      <div className="books-grid" {...props} />
    </>
  );
}

export function Folder({
  title,
  href,
  description,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  title: string;
  href: string;
  description?: string;
}) {
  return (
    <div>
      <article {...props} className="card card--folder">
        <div className="book" aria-hidden>
          <div className="book__cover">
            <span>{title}</span>
          </div>
        </div>
        <div className="book" aria-hidden>
          <div className="book__cover">
            <span>{title}</span>
          </div>
        </div>
        <div className="book" aria-hidden>
          <div className="book__cover">
            <span>{title}</span>
          </div>
        </div>
        <div className="card__info">
          <h3 className="card__title">
            <a href={href}>{title}</a>
          </h3>
          {description && <p className="card__description">{description}</p>}
        </div>
      </article>
    </div>
  );
}

export function Book({
  cover,
  title,
  author,
  description,
  ...props
}: ComponentPropsWithoutRef<"div"> & {
  cover?: string;
  title: string;
  author?: string;
  description?: string;
}) {
  const popupId = useId();

  return (
    <div>
      <article {...props} className="card card--book popup-trigger__wrapper">
        <div className="book" aria-hidden>
          <div className="book__cover">
            {cover ? <img src={cover} alt={title} loading="lazy" /> : <span>{title}</span>}
          </div>
        </div>
        <div className="card__info">
          <h3 className="card__title">{title}</h3>
          {author && <p className="card__description">{author}</p>}
        </div>
        <label className="popup-trigger" htmlFor={popupId}>
          <input type="radio" name="popup" id={popupId} />
          <span className="sr-only">Open Book Details</span>
        </label>
      </article>
      <div className="popup">
        <label className="popup__close" htmlFor="popup-none">
          <span className="sr-only">Close</span>
        </label>
        <div className="popup__content">
          <div className="popup__cover" aria-hidden>
            <div className="book">
              <div className="book__cover">{cover ? <img src={cover} alt={title} /> : <span>{title}</span>}</div>
            </div>
          </div>
          <div className="popup__info">
            <hgroup>
              <h2 className="popup__title">{title}</h2>
              {author && <p className="popup__author">{author}</p>}
            </hgroup>
            {description && <p className="popup__description">{description}</p>}
            <div className="popup__footer">
              <p className="popup__meta">
                <span>Fiction, Drama, Classic</span>
                <span>2024 &nbsp;·&nbsp; English</span>
              </p>

              <div className="popup__downloads">
                <a href="#" className="popup__download-btn">
                  EPUB
                </a>
                <a href="#" className="popup__download-btn">
                  PDF
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
