import { Fragment } from "react";

function inline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**"))
      return (
        <strong key={i} className="font-semibold text-foreground">
          {p.slice(2, -2)}
        </strong>
      );
    if (p.startsWith("`") && p.endsWith("`"))
      return (
        <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">
          {p.slice(1, -1)}
        </code>
      );
    if (p.startsWith("*") && p.endsWith("*") && p.length > 2)
      return (
        <em key={i} className="italic">
          {p.slice(1, -1)}
        </em>
      );
    return <Fragment key={i}>{p}</Fragment>;
  });
}

/** Lightweight markdown renderer for AI output (headings, lists, tables, paragraphs). */
export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r/g, "").split("\n");
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  let table: string[][] = [];

  const flushList = () => {
    if (!list.length) return;
    blocks.push(
      <ul key={`l${blocks.length}`} className="my-3 space-y-1.5 pl-1">
        {list.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-muted-foreground">
            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{inline(item)}</span>
          </li>
        ))}
      </ul>,
    );
    list = [];
  };
  const flushTable = () => {
    if (!table.length) return;
    const [head = [], ...rows] = table;
    blocks.push(
      <div key={`t${blocks.length}`} className="my-4 overflow-x-auto rounded-xl border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/60">
            <tr>
              {head.map((h, i) => (
                <th key={i} className="px-3 py-2 font-semibold">
                  {inline(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-t">
                {r.map((c, j) => (
                  <td key={j} className="px-3 py-2 text-muted-foreground">
                    {inline(c)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>,
    );
    table = [];
  };

  lines.forEach((raw, idx) => {
    const line = raw.trimEnd();
    if (/^\s*\|.*\|\s*$/.test(line)) {
      const cells = line
        .trim()
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) return;
      flushList();
      table.push(cells);
      return;
    }
    flushTable();

    if (/^\s*(?:[-*•]|\d+[.)])\s+/.test(line)) {
      list.push(line.replace(/^\s*(?:[-*•]|\d+[.)])\s+/, ""));
      return;
    }
    flushList();

    if (!line.trim()) return;

    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const level = (h[1] ?? "").length;
      blocks.push(
        level <= 2 ? (
          <h3
            key={idx}
            className="mt-5 mb-2 text-base font-semibold tracking-tight text-foreground first:mt-0"
          >
            {inline(h[2] ?? "")}
          </h3>
        ) : (
          <h4 key={idx} className="mt-4 mb-1.5 text-sm font-semibold text-foreground">
            {inline(h[2] ?? "")}
          </h4>
        ),
      );
      return;
    }
    if (/^---+$/.test(line.trim())) {
      blocks.push(<hr key={idx} className="my-4 border-border" />);
      return;
    }
    blocks.push(
      <p key={idx} className="my-2 text-sm leading-relaxed text-muted-foreground">
        {inline(line)}
      </p>,
    );
  });
  flushList();
  flushTable();

  return <div className="max-w-none">{blocks}</div>;
}
