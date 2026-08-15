"use client";

type MigrationOverlayProps = {
  visible?: boolean;
  className?: string;
  showLabels?: boolean;
  interactive?: boolean;
};

export default function MigrationOverlay({
  visible = true,
  className = "",
}: MigrationOverlayProps) {
  if (!visible) return null;

  return (
    <img
      src="/images/maps/migration.svg"
      alt="Zonas de migración de Gateway"
      draggable={false}
      className={`pointer-events-none absolute inset-0 h-full w-full select-none object-contain ${className}`}
    />
  );
}
