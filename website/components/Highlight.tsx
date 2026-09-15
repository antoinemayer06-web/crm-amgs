// Surlignage façon "coup de feutre" fait main — un dégradé horizontal
// (transparent -> couleur -> couleur -> transparent) posé sous le texte,
// légèrement incliné pour ne pas paraître mécanique. `box-decoration-break:
// clone` garantit que le surlignage reste correct même si le texte passe
// à la ligne (utile dans les titres de carte, plus étroits).
export default function Highlight({
  children,
  color = "220, 38, 38", // rouge (red-600)
  opacity = 0.5,
}: {
  children: React.ReactNode;
  color?: string;
  opacity?: number;
}) {
  return (
    <span
      className="relative inline"
      style={{
        backgroundImage: `linear-gradient(104deg, rgba(${color}, 0) 0.5%, rgba(${color}, ${opacity}) 3%, rgba(${color}, ${opacity}) 96%, rgba(${color}, 0) 99.5%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 48%",
        backgroundPosition: "0% 88%",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
}
