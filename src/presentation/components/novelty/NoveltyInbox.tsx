import { Inbox } from "lucide-react";
import { Novelty } from "@/domain/entities/novelty.entity";

interface NoveltyInboxProps {
  novelties: Novelty[];
  selectedId: string;
  onSelect: (novelty: Novelty) => void;
  onResetClosed: () => void;
}

export function NoveltyInbox({
  novelties,
  selectedId,
  onSelect,
  onResetClosed,
}: NoveltyInboxProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex items-center gap-2">
        <Inbox className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold text-foreground">Bandeja de Novedades</h2>
      </div>

      <div className="space-y-2">
        {novelties.map((n) => (
          <button
            key={n.id}
            onClick={() => {
              onSelect(n);
              onResetClosed();
            }}
            className={`w-full rounded-lg border-l-4 p-3 text-left transition-colors ${
              selectedId === n.id
                ? "border-l-primary bg-primary/5"
                : "border-l-transparent bg-background hover:bg-secondary/40"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-muted-foreground">ID: #{n.id}</span>
              <span className="text-[10px] text-muted-foreground">
                {n.createdAt.toLocaleDateString()}
              </span>
            </div>
            <p className="mt-1 text-sm font-bold text-foreground">{n.title}</p>
            <p className="text-[11px] text-muted-foreground">Reportado por: {n.reportedBy}</p>
            <span
              className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                n.priority === "high"
                  ? "bg-destructive/15 text-destructive"
                  : n.priority === "medium"
                    ? "bg-warning/20 text-warning"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {n.status}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
