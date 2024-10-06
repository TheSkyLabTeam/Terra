import LocationLabel from "@/app/(app)/components/locationLabel";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

const layout = ({ children }) => {
  return (
    <div className="relative w-screen h-screen bg-woodsmoke-950">
      <div className="absolute flex flex-row gap-2 z-10 p-2">
        <Link href="/">
          <div className="grid place-items-center w-10 h-10 border-2 border-woodsmoke-600 bg-woodsmoke-900 text-woodsmoke-300 rounded-full">
            <HomeIcon />
          </div>
        </Link>
        <LocationLabel />
      </div>
      {children}
    </div>
  );
};

export default layout;
