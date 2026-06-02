import logoUrl from "@/assets/logo-kns.png";

/**
 * Kovai Nadar Sangam emblem.
 * - Default: colored emblem as-is (for light backgrounds).
 * - light=true: colored emblem inside a white circular badge so the full
 *   detail stays visible on dark (green) backgrounds — instead of flattening
 *   it to a white silhouette.
 */
export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  const img = (
    <img
      src={logoUrl}
      alt="Kovai Nadar Sangam emblem"
      width={size}
      height={size}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );

  if (!light) return img;

  const pad = Math.round(size * 0.12);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size + pad * 2,
        height: size + pad * 2,
        padding: pad,
        background: "#ffffff",
        borderRadius: "9999px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.18)",
      }}
    >
      {img}
    </span>
  );
}
