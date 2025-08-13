import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      {/* Light theme */}
      <Image src="/logo.png" alt="AskPiko logo" width={120} height={72} className="w-auto dark:hidden" priority />

      {/* Dark theme */}
      <Image
        src="/logo_dark.png"
        alt="AskPiko logo"
        width={120}
        height={72}
        className="hidden w-auto dark:block"
        priority
      />
    </div>
  );
}
