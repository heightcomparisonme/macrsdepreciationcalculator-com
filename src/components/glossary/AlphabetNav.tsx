import Link from "next/link";

const LETTERS = ["#", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];

interface AlphabetNavProps {
  active?: string;
  baseUrl?: string;
}

export default function AlphabetNav({ active, baseUrl = "/glossary" }: AlphabetNavProps) {
  return (
    <nav className="flex flex-wrap gap-1 sm:gap-2 border-b pb-4 mb-6 overflow-x-auto scrollbar-hide">
      <div className="flex gap-1 sm:gap-2 min-w-max">
        {LETTERS.map((letter) => (
          <Link
            key={letter}
            href={`${baseUrl}?letter=${letter}`}
            className={`text-sm font-medium tracking-wide px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              active === letter
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:shadow-sm"
            }`}
          >
            {letter}
          </Link>
        ))}
      </div>
    </nav>
  );
}