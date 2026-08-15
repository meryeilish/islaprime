import { siteConfig } from "@/app/config/site";

interface SteamButtonProps {
  className?: string;
  label?: string;
}

export default function SteamButton({
  className = "",
  label = "Entrar con Steam",
}: SteamButtonProps) {
  return (
    <a
      href={siteConfig.urls.steamLogin}
      className={`inline-flex items-center justify-center gap-3 rounded-full bg-red-600 px-8 py-4 text-sm font-black uppercase tracking-wider text-white shadow-[0_0_40px_rgba(220,38,38,0.35)] transition hover:-translate-y-0.5 hover:bg-red-500 ${className}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-current"
      >
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.207-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.706 20.843 6.392 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.262 1.255 1.227.604 2.712.118 3.315-1.125.293-.598.369-1.285.217-1.948-.152-.66-.515-1.222-1.017-1.623-.502-.4-1.115-.599-1.735-.555l1.489.615a2.016 2.016 0 0 1 1.045 2.643 2.015 2.015 0 0 1-2.643 1.046zM18.509 8.929c0-1.289-1.036-2.333-2.325-2.333-1.289 0-2.325 1.044-2.325 2.333 0 1.289 1.036 2.333 2.325 2.333 1.289 0 2.325-1.044 2.325-2.333z" />
      </svg>
      {label}
    </a>
  );
}
