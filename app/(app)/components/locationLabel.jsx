"use client";
import 'material-symbols';
import { usePathname } from 'next/navigation';
import Flag from 'react-world-flags';

const LocationLabel = () => {
  const pathname = usePathname();

  const getLabelAndIcon = () => {
    if (pathname === '/global') {
      return { label: 'Welcome to Terra', icon: null };
    } else if (pathname.startsWith('/countries/')) {
      const country = pathname.split('/')[2]; // Extraer el país de la URL
      return { label: `Country Report: ${country}`, icon: <Flag code={country.toUpperCase()} className="w-5 h-5" /> };
    } else {
      return { label: 'Welcome to Terra', icon: null };
    }
  };

  const { label, icon } = getLabelAndIcon();

  return (
    <div className="flex justify-center items-center w-fit h-fit gap-2 select-none">
      <div className="relative grid place-items-center w-fit h-10 bg-woodsmoke-950 text-woodsmoke-50 border-2 border-woodsmoke-900 font-cabinet px-6 rounded-full overflow-hidden">
        <div className="absolute bg-woodsmoke-700 w-8 h-8 z-0 -left-2 -bottom-3 rounded-full blur-sm" />
        <div className="absolute bg-woodsmoke-300 w-4 h-4 -left-1 bottom-2 blur-sm" />
        <h1 className="flex z-1">{label}</h1>
        <div className="absolute bg-woodsmoke-700 w-8 h-8 z-0 -right-2 -top-3 rounded-full blur-sm" />
        <div className="absolute bg-woodsmoke-300 w-4 h-4 -right-1 top-2 blur-sm" />
      </div>
      {icon && (
        <div className="grid place-items-center w-10 h-10 bg-woodsmoke-950 text-woodsmoke-600 border-2 border-woodsmoke-900 rounded-full">
          {icon}
        </div>
      )}
    </div>
  );
};

export default LocationLabel;
