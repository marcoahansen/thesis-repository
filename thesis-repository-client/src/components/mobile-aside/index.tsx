import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { PanelLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { ProfileDropdown } from "../profile-dropdown";

interface AsideProps {
  links: Array<{
    icon: JSX.Element;
    label: string;
    to: string;
  }>;
}

export const MobileAside = ({ links }: AsideProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="flex items-center gap-4 p-4 rounded-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <ProfileDropdown align="end" hidden={"sm:hidden"} />
    </header>
  );
};
