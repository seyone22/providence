/**
 * Client-side pagination for admin tables.
 *
 * The lead table mounts a full dropdown menu per row, so rendering an unbounded
 * list is what made the admin panel lock up — the main thread stays busy and
 * nothing on the page responds, the sidebar included.
 */

export type PageSize = number | "All";

export type PaginationResult<T> = {
  /** The rows to render for the resolved page. */
  rows: T[];
  /** The requested page, clamped into [1, totalPages]. */
  page: number;
  totalPages: number;
  totalRows: number;
  /** 0-based index of the first visible row, for "showing X–Y of N" labels. */
  startIndex: number;
  rowsPerPage: number;
};

/**
 * Slice `items` for the given page. `requestedPage` is clamped rather than
 * rejected, so a page number left over from a wider filter still renders the
 * nearest valid page instead of an empty table.
 */
export function paginate<T>(
  items: T[],
  pageSize: PageSize,
  requestedPage: number,
): PaginationResult<T> {
  const totalRows = items.length;
  // `|| 1` keeps totalPages at 1 (not NaN/Infinity) when "All" meets an empty list.
  const rowsPerPage = pageSize === "All" ? totalRows || 1 : pageSize;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const page = Math.min(
    Math.max(1, Math.floor(requestedPage) || 1),
    totalPages,
  );
  const startIndex = (page - 1) * rowsPerPage;

  return {
    rows: items.slice(startIndex, startIndex + rowsPerPage),
    page,
    totalPages,
    totalRows,
    startIndex,
    rowsPerPage,
  };
}
