import { Dot } from "lucide-react";
import { ProfileSettings } from "@/components/ProfileSettings";
import { Cormorant_Garamond } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  weight: "400",
  subsets: ["latin"],
});

export const Header = () => {
  return (
    <header>
      <div className="container max-w-[60rem] mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Dot className="h-6 w-6 text-primary" />
            <h1
              className={`${cormorantGaramond.className} text-xl font-semibold text-foreground`}
            >
              dot.
            </h1>
          </div>
          <ProfileSettings />
        </div>
      </div>
    </header>
  );
};
