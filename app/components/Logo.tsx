import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* Place your logo file at /public/logo.png (recommended transparent PNG or SVG) */}
      <Image src="/logo.png" alt="AskPiko logo" width={120} height={72} className="w-auto" priority />
    </div>
  );
}
