import type { BlogTocItem } from "@/config/blog";

// Static, server-rendered table of contents. Sticky on desktop. Anchor ids must
// match the H2 ids in the post body. Kept stateless (no scroll-spy) so it can be
// a server component and ship in the initial HTML.
export default function TableOfContents({ items }: { items: BlogTocItem[] }) {
  if (items.length === 0) return null;
  return (
    <nav
      aria-label="On this page"
      className="hidden lg:block sticky top-28 self-start"
    >
      <p className="text-xs font-bold tracking-[0.2em] uppercase text-zinc-400 mb-4">
        On this page
      </p>
      <ul className="space-y-2.5 border-l border-black/10 pl-4">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className="block text-sm font-light text-zinc-500 hover:text-sky-600 transition-colors leading-snug"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
