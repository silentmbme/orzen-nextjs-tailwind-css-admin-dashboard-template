import Image from "next/image";
import Link from "next/link";

export function AuthBrand() {
  return (
    <Link href="/" aria-label="Orzen home" className="inline-flex items-center">
      <Image
        src="/images/brand/orzen-light.svg"
        alt="Orzen"
        width={118}
        height={32}
        priority
        unoptimized
        className="h-8 w-auto dark:hidden"
      />
      <Image
        src="/images/brand/orzen-dark.svg"
        alt="Orzen"
        width={118}
        height={32}
        priority
        unoptimized
        className="hidden h-8 w-auto dark:block"
      />
    </Link>
  );
}
