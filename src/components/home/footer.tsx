import { Github, Linkedin, Mail, ArrowUpRight } from "lucide-react"

const columns = [
  {
    heading: "Connect",
    links: [
      { label: "GitHub", href: "https://github.com/bhilbis", icon: Github },
      // { label: "Twitter / X", href: "https://x.com", icon: Twitter },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/flexsy-bilbis-triwibowo/", icon: Linkedin },
    ],
  },
  {
    heading: "Contact",
    links: [
      { label: "bhilbis123@gmail.com", href: "mailto:bhilbis123@gmail.com", icon: Mail },
      { label: "Book a call", href: "#", icon: ArrowUpRight },
    ],
  },
  {
    heading: "Elsewhere",
    links: [
      { label: "Read.cv", href: "#", icon: ArrowUpRight },
      { label: "Layers", href: "#", icon: ArrowUpRight },
    ],
  },
]

export function Footer() {
  return (
    <footer
      className="fixed inset-x-0 bottom-0 z-0 border-t border-border bg-gradient-to-b from-background to-muted/30 px-6 pb-12 pt-20 transition-colors"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Reveal label */}
        <p className="mb-12 text-center font-mono text-[11px] tracking-[0.3em] uppercase text-muted-foreground/60">
          You found it
        </p>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3">
          {columns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-4">
              <p className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground/70">
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group inline-flex items-center gap-2 text-sm text-foreground/70 transition-colors duration-200 hover:text-foreground"
                    >
                      <link.icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom line with shimmer "Built by AoiXsy" */}
        <div className="mt-16 flex items-center justify-between">
          <p
            className="font-mono text-[11px] animate-shimmer bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, color-mix(in oklch, var(--foreground) 40%, transparent) 0%, var(--foreground) 50%, color-mix(in oklch, var(--foreground) 40%, transparent) 100%)",
              backgroundSize: "200% auto",
            }}
          >
            Built by AoiXsy
          </p>
          <p className="font-mono text-[11px] text-muted-foreground/60">
            {"\u00A9 2026"}
          </p>
        </div>
      </div>
    </footer>
  )
}
