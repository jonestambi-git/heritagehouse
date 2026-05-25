import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
  return (
    <>
    {/* ── Footer ───────────────────────────────────── */}
      <footer className="relative z-10 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-10 sm:px-10 sm:py-12">
          <div className="flex flex-col items-center gap-8 text-center">

            {/* Column 1: Brand */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src="/heritage-house-logo.svg"
                  alt="HeritageHouse Ministries logo"
                  width={44}
                  height={44}
                />
                <div className="flex flex-col gap-0.5">
                  <span className="font-body text-white text-sm tracking-widest uppercase">
                    HeritageHouse Ministries
                  </span>
                  <span className="font-body text-white/35 text-xs">
                    Port Harcourt, Rivers State
                  </span>
                </div>
              </div>
              <p className="font-body text-white/30 text-xs leading-relaxed text-center max-w-xs">
                Where faith is ignited, community is built, and every life finds purpose in Christ Jesus.
              </p>
            </div>

            {/* Column 2: Nav links */}
            <div className="flex flex-col items-center gap-3">
              <span className="font-body text-white/25 text-[10px] tracking-widest uppercase mb-1">
                Navigate
              </span>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {["Community", "Events", "Sermons", "Projects", "Give", "Contact"].map((label) => (
                  <Link
                    key={label}
                    href={`/${label.toLowerCase()}`}
                    className="font-body text-white/45 text-xs tracking-wide uppercase hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-2 text-center">
            <span className="font-body text-white/25 text-xs">
              &copy; {new Date().getFullYear()} HeritageHouse Ministries, Port Harcourt. All rights reserved.
            </span>
            <Link
              href="/admin-login"
              className="font-body text-white/20 text-xs hover:text-white/50 transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer