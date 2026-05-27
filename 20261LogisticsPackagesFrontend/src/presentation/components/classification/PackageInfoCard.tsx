interface PackageInfoCardProps {
  type: string;
  destination: string;
  highlight?: boolean;
}

function InfoRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-bold ${highlight ? "text-warning" : "text-foreground"}`}>
        {value}
      </span>
    </div>
  );
}

export function PackageInfoCard({ type, destination, highlight }: PackageInfoCardProps) {
  return (
    <section className="rounded-xl border border-border bg-card p-6 shadow-[var(--shadow-card)]">
      <h3 className="mb-4 text-base font-bold text-foreground">Información del Paquete</h3>
      <div className="space-y-3">
        <InfoRow label="Tipo de Mercancía" value={type} highlight={highlight} />
        <InfoRow label="Ciudad de Destino" value={destination} />
      </div>
    </section>
  );
}
