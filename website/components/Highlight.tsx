// Surlignage façon "coup de feutre" fait main — un dégradé horizontal
// (transparent -> couleur -> couleur -> transparent) posé sous le texte,
// légèrement incliné et avec une légère variation d'opacité au milieu
// pour ne pas paraître mécanique. Le padding + la marge négative
// assortie font déborder le trait au-delà du texte (gauche/droite/haut/
// bas) sans pousser le texte environnant, comme un vrai feutre qui
// dépasse un peu. `box-decoration-break: clone` clone ce débordement
// sur chaque ligne si le texte passe à la ligne (titres de carte
// étroits).
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
        padding: "0.1em 0.22em",
        margin: "0 -0.22em",
        backgroundImage: `linear-gradient(105deg, rgba(${color}, 0) 0%, rgba(${color}, ${opacity}) 4%, rgba(${color}, ${opacity * 0.85}) 44%, rgba(${color}, ${opacity}) 58%, rgba(${color}, ${opacity}) 96%, rgba(${color}, 0) 100%)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "100% 100%",
        backgroundPosition: "0% 0%",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
}
