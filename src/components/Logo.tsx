import logoUrl from "@/assets/logo-kns.png";

export function Logo({ size = 36, light = false }: { size?: number; light?: boolean }) {
  return (
    <img
      src={logoUrl}
      alt="Kovai Nadar Sangam emblem"
      width={size}
      height={size}
      loading="lazy"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        filter: light ? "brightness(0) invert(1)" : undefined,
      }}
    />
  );
}
