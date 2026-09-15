// Surlignage façon "coup de feutre" fait main — un dégradé horizontal
// (transparent -> couleur -> couleur -> transparent) posé sous le texte,
// légèrement incliné pour ne pas paraître mécanique. `box-decoration-break:
// clone` garantit que le surlignage reste correct même si le texte passe
// à la ligne (utile dans les titres de carte, plus étroits).
export default function Highlight({
  children,
  color = "239, 68, 68", // rouge vif (red-500)
  opacity = 0.78,
}: {
  children: React.ReactNode;
  color?: string;
  opacity?: number;
}) {
  return (
    <span
      className="relative inline"
      style={{
        backgroundImage: `linear-gradient(104deg, rgba(${color}, 0) 0%, rgba(${color}, ${opacity}) 1.5%, rgba(${color}, ${opacity}) 98.5%, rgba(${color}, 0) 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 92%",
        backgroundPosition: "0% 55%",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
}
