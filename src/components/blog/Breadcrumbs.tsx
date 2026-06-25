import Link from "next/link";
import { ChevronRight } from "lucide-react";

type Crumb = { label: string; href?: string };

/** Visual breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted
 *  separately in the route page for crawlers. */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-zinc-400">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="hover:text-sky-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-zinc-600" : ""}>{item.label}</span>
              )}
              {!last && <ChevronRight size={12} className="text-zinc-300" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
