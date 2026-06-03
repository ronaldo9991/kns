import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { PageHeader } from "@/components/Breadcrumb";
import {
  BookOpen, MapPin, Phone, Clock, Users, GraduationCap,
  Monitor, FlaskConical, Calculator, Bot, Library, Star,
  ArrowUpRight, CalendarDays,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/school")({
  head: () => ({
    meta: [
      { title: "Our School — Kovai Nadar Sangam" },
      { name: "description", content: "Sangamam Matriculation School — run by Kovai Nadar Sangam, Tatabad, Coimbatore. Nursery to Class 12, Tamil Nadu State Board, English medium." },
    ],
  }),
  component: SchoolPage,
});

const FACILITIES = [
  { icon: Monitor,      en: "Computer Laboratory",           ta: "கணினி ஆய்வகம்" },
  { icon: FlaskConical, en: "Integrated Science Laboratory", ta: "ஒருங்கிணைந்த அறிவியல் ஆய்வகம்" },
  { icon: Calculator,   en: "Mathematics Laboratory",        ta: "கணித ஆய்வகம்" },
  { icon: Bot,          en: "Robotics Lab",                  ta: "ரோபோட்டிக்ஸ் ஆய்வகம்" },
  { icon: Library,      en: "Library",                       ta: "நூலகம்" },
  { icon: Star,         en: "Digital Smart Classrooms",      ta: "டிஜிட்டல் ஸ்மார்ட் வகுப்பறைகள்" },
];

function SchoolPage() {
  const { lang } = useI18n();
  const ta = lang === "ta";

  return (
    <SiteLayout>
      <PageHeader
        title={ta ? "எங்கள் பள்ளி" : "Our School"}
        subtitle={
          ta
            ? "சங்கமம் மெட்ரிகுலேஷன் பள்ளி — கோவை நாடார் சங்கத்தால் நடத்தப்படும் தரமான கல்வி நிறுவனம்."
            : "Sangamam Matriculation School — a quality educational institution run by Kovai Nadar Sangam."
        }
        breadcrumb={[{ label: ta ? "எங்கள் பள்ளி" : "Our School" }]}
      />

      <div className="container-page py-10 space-y-10">

        {/* ── Hero banner ── */}
        <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-primary-deep via-[#1a4d35] to-[#0f3020] text-white p-8 lg:p-12 relative">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 text-sm mb-5">
              <GraduationCap size={14} /> {ta ? "கோவை நாடார் சங்கம் நடத்தும் பள்ளி" : "Run by Kovai Nadar Sangam · Est. 1952"}
            </div>
            <h2 className="font-display text-3xl lg:text-4xl mb-3">
              {ta ? "சங்கமம் மெட்ரிகுலேஷன் பள்ளி" : "Sangamam Matriculation School"}
            </h2>
            <p className="text-white/75 text-base leading-relaxed mb-6">
              {ta
                ? "நர்சரி முதல் 12ம் வகுப்பு வரை ஆங்கில வழிக் கல்வி. தமிழ்நாடு அரசு வாரியம் (மெட்ரிகுலேஷன்). கோயம்புத்தூரின் நாடார் சமூகத்திற்காக, சங்கத்தின் அர்ப்பணிப்புடன் நடத்தப்படுகிறது."
                : "English-medium education from Nursery to Class 12 under the Tamil Nadu State Board (Matriculation). Serving the Nadar community of Coimbatore with dedication since the Sangam's founding."}
            </p>
            <a
              href="https://maps.app.goo.gl/YourGoogleMapsLink"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-primary-deep font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-white/90 transition-colors"
            >
              <MapPin size={14} />
              {ta ? "வழிகாட்டல் பெறுக" : "Get Directions"}
              <ArrowUpRight size={13} />
            </a>
          </div>
          {/* decorative circle */}
          <div className="absolute -right-10 -bottom-10 w-52 h-52 rounded-full bg-white/5 hidden lg:block" />
          <div className="absolute right-20 top-8 w-28 h-28 rounded-full bg-white/5 hidden lg:block" />
        </div>

        {/* ── Key facts grid ── */}
        <div>
          <h2 className="font-display text-2xl text-primary-deep mb-5">
            {ta ? "பள்ளி விவரங்கள்" : "School Details"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                icon: BookOpen,
                label: ta ? "வழங்கப்படும் வகுப்புகள்" : "Classes Offered",
                value: ta ? "நர்சரி முதல் 12ம் வகுப்பு வரை" : "Nursery to Class 12",
              },
              {
                icon: GraduationCap,
                label: ta ? "வாரியம்" : "Board",
                value: ta ? "தமிழ்நாடு மெட்ரிகுலேஷன்" : "Tamil Nadu State Board (Matric)",
              },
              {
                icon: BookOpen,
                label: ta ? "கற்பிக்கும் மொழி" : "Medium of Instruction",
                value: ta ? "ஆங்கிலம்" : "English",
              },
              {
                icon: Users,
                label: ta ? "பள்ளி வகை" : "School Type",
                value: ta ? "கலப்பு கல்வி பகல் பள்ளி" : "Co-educational Day School",
              },
              {
                icon: CalendarDays,
                label: ta ? "சேர்க்கை நேரம்" : "School Hours",
                value: "8:30 am – 3:30 pm",
              },
              {
                icon: Star,
                label: ta ? "நர்சரி குறைந்தபட்ச வயது" : "Min. Age for Nursery",
                value: ta ? "3 ஆண்டுகள்" : "3 Years",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card-flat p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary-deep" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
                  <div className="font-semibold text-sm text-foreground">{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Two columns: About + Admission ── */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* About */}
          <div className="card-flat p-7">
            <div className="leaf-mark"><BookOpen size={16} /></div>
            <h3 className="mt-3 font-display text-xl text-primary-deep">
              {ta ? "பள்ளியைப் பற்றி" : "About the School"}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              {ta
                ? "சங்கமம் மெட்ரிகுலேஷன் பள்ளி கோவை நாடார் சங்கத்தால் நடத்தப்படுகிறது. தாதாபாட், கோயம்புத்தூரில் சங்கனூர் சாலையில் அமைந்துள்ள இப்பள்ளி, சமூகத்தின் கல்வி சேவையின் ஒரு முக்கிய அடையாளம்."
                : "Sangamam Matriculation School is run by Kovai Nadar Sangam and is situated on Sanganoor Road, Tatabad, Coimbatore. The school stands as a cornerstone of the Sangam's commitment to quality education for the community."}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              {ta
                ? "மாணவர்களுக்கு தரமான கல்வியை வழங்கும் நோக்கத்துடன், ஆண்கள் மற்றும் பெண்கள் இரு பாலினத்தினருக்கும் நர்சரி முதல் 12ம் வகுப்பு வரை ஆங்கில வழியில் கல்வி வழங்கப்படுகிறது. நவீன ஆய்வகங்கள், நூலகம் மற்றும் டிஜிட்டல் வகுப்பறைகளுடன் மாணவர்களின் முழுமையான வளர்ச்சிக்கு பள்ளி உதவுகிறது."
                : "With a mission to provide quality education, the school offers English-medium classes for both boys and girls from Nursery to Class 12. Modern laboratories, a well-stocked library, and digital classrooms support the holistic development of every student."}
            </p>
          </div>

          {/* Admission */}
          <div className="card-flat p-7">
            <div className="leaf-mark"><CalendarDays size={16} /></div>
            <h3 className="mt-3 font-display text-xl text-primary-deep">
              {ta ? "சேர்க்கை தகவல்" : "Admissions"}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-foreground/85">
              {ta
                ? "ஆண்டுதோறும் சேர்க்கை திறக்கப்படும். பெற்றோர்கள் பள்ளி நேரத்தில் நேரில் சந்தித்து விண்ணப்பிக்கலாம்."
                : "Admissions open every academic year. Parents are welcome to visit the school during school hours to collect the application and complete the admission process."}
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                {
                  label: ta ? "பள்ளியை சந்திக்க" : "Visit the school",
                  value: "8:30 am – 3:30 pm",
                },
                {
                  label: ta ? "நர்சரி குறைந்தபட்ச வயது" : "Minimum age (Nursery)",
                  value: ta ? "3 ஆண்டுகள்" : "3 years",
                },
                {
                  label: ta ? "ஆண்டு கட்டணம்" : "Annual fees",
                  value: "₹25,000 + ₹13,800",
                },
              ].map(({ label, value }) => (
                <li key={label} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-surface border border-border">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              {ta
                ? "* கட்டணம் கல்வியாண்டுக்கு மாறுபடலாம். தயவுசெய்து பள்ளி அலுவலகத்தை தொடர்பு கொள்ளவும்."
                : "* Fees subject to change each academic year. Please confirm with the school office."}
            </p>
          </div>
        </div>

        {/* ── Facilities ── */}
        <div>
          <h2 className="font-display text-2xl text-primary-deep mb-5">
            {ta ? "வசதிகள்" : "Facilities"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FACILITIES.map(({ icon: Icon, en, ta: taTxt }) => (
              <div key={en} className="card-flat p-5 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary-deep" />
                </div>
                <span className="font-medium text-sm">{ta ? taTxt : en}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Contact ── */}
        <div className="card-flat overflow-hidden">
          <div className="bg-gradient-to-r from-primary-deep to-primary px-7 py-5">
            <h3 className="font-display text-xl text-white">
              {ta ? "பள்ளியை தொடர்பு கொள்ளுங்கள்" : "Contact the School"}
            </h3>
          </div>
          <div className="p-7 grid sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin size={15} className="text-primary-deep" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">
                  {ta ? "முகவரி" : "Address"}
                </div>
                <div className="text-sm font-medium leading-relaxed">
                  Sangamam Matriculation School<br />
                  Sanganoor Road, Tatabad<br />
                  Coimbatore — 641 027
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone size={15} className="text-primary-deep" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">
                  {ta ? "தொலைபேசி" : "Phone"}
                </div>
                <a href="tel:04222333185" className="text-sm font-medium text-primary-deep hover:underline">
                  0422-2333185
                </a>
                <div className="text-xs text-muted-foreground mt-1">
                  {ta ? "காலை 8:30 — மாலை 3:30" : "8:30 am – 3:30 pm (school days)"}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary-soft flex items-center justify-center flex-shrink-0 mt-0.5">
                <Clock size={15} className="text-primary-deep" />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-0.5">
                  {ta ? "பள்ளி நேரம்" : "School Hours"}
                </div>
                <div className="text-sm font-medium">8:30 am – 3:30 pm</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {ta ? "திங்கள் – வெள்ளி" : "Monday – Friday"}
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <a
                href="https://www.google.com/maps/search/Sangamam+Matriculation+School+Tatabad+Coimbatore"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary gap-2 !py-2.5 !text-sm"
              >
                <MapPin size={14} />
                {ta ? "வழிகாட்டல் பெறுக" : "Get Directions"}
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* ── Managed by note ── */}
        <div className="rounded-2xl bg-primary-soft/60 border border-primary-deep/15 p-5 text-sm text-foreground/80 flex items-start gap-3">
          <GraduationCap size={16} className="text-primary-deep flex-shrink-0 mt-0.5" />
          <span>
            {ta
              ? "சங்கமம் மெட்ரிகுலேஷன் பள்ளி கோவை நாடார் சங்கத்தின் கீழ் நடத்தப்படுகிறது. சங்கத்தின் அலுவலகத்தை தொடர்பு கொள்ள: 349, Dr. ராதாகிருஷ்ண சாலை, தாதாபாட், கோயம்புத்தூர் — 641012 | 0422-2491297"
              : "Sangamam Matriculation School is managed under Kovai Nadar Sangam. Sangam office: 349, Dr. Radhakrishna Road, Tatabad, Coimbatore — 641012 | 0422-2491297"}
          </span>
        </div>

      </div>
    </SiteLayout>
  );
}
