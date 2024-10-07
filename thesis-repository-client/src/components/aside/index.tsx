import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "../ui/tooltip";
import { Link } from "react-router-dom";
import faeterj from "../../assets/faeterj.png";
import { ProfileDropdown } from "../profile-dropdown";

interface AsideProps {
  links: Array<{
    icon: JSX.Element;
    label: string;
    to: string;
  }>;
}

export function Aside({ links }: AsideProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <img src={faeterj} alt="faeterj-petropolis" />
        {links.map((link) => (
          <TooltipProvider key={link.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to={link.to}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  {link.icon}
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <ProfileDropdown />
      </nav>
    </aside>
  );
}
