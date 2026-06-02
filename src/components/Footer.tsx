import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-primary-deep text-white mt-24">
      <div className="container-page py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Logo light />
            <div>
              <div className="font-display text-lg">Kovai Nadar Sangam</div>
              <div className="text-xs uppercase tracking-[0.2em] text-white/60">Established 1952</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-white/75 max-w-md leading-relaxed">
            A registered community trust serving the Hindu and Christian Nadar families of Coimbatore through matrimony, education, healthcare and business networking.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.18em] text-white/70 mb-4">Visit</h4>
          <ul className="space-y-3 text-sm text-white/85">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0" /> 349, Dr. Radhakrishna Road, Tatabad, Near Vadakovai Power House, Coimbatore – 641012</li>
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0" /> 0422-2491297 / 2491298</li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0" /> office@kovainadarsangam.org</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-[0.18em] text-white/70 mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-white/85">
            <li><Link to="/matrimony" className="hover:text-white">Matrimony</Link></li>
            <li><Link to="/members" className="hover:text-white">Member Directory</Link></li>
            <li><Link to="/events" className="hover:text-white">Events</Link></li>
            <li><Link to="/scholarships" className="hover:text-white">Scholarships</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page py-5 flex flex-col sm:flex-row gap-2 justify-between text-xs text-white/60">
          <span>© {new Date().getFullYear()} Kovai Nadar Sangam. All rights reserved.</span>
          <span>A registered community trust · Reg. No. 42/1952</span>
        </div>
      </div>
    </footer>
  );
}
