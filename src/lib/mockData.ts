export type Profile = {
  id: string;
  name: string;
  age: number;
  height: string;
  rasi: string;
  education: string;
  location: string;
  religion: "Hindu" | "Christian";
  gender: "Male" | "Female";
  profession: string;
  initial: string;
};

export const RASI = ["Mesham", "Rishabam", "Mithunam", "Kadagam", "Simmam", "Kanni", "Thulam", "Viruchigam", "Dhanusu", "Magaram", "Kumbam", "Meenam"];
export const STARS = ["Ashwini", "Bharani", "Karthigai", "Rohini", "Mirugaseerisham", "Thiruvathirai", "Punarpoosam", "Poosam", "Ayilyam", "Magam", "Pooram", "Uthiram", "Hastham", "Chithirai", "Swathi", "Visakam", "Anusham", "Kettai", "Moolam", "Pooradam", "Uthiradam", "Thiruvonam", "Avittam", "Sathayam", "Poorattathi", "Uthirattathi", "Revathi"];

export const PROFILES: Profile[] = [
  { id: "KNS-1042", name: "Aravind R.", age: 28, height: "5'10\"", rasi: "Simmam", education: "B.E. Mechanical", location: "Coimbatore", religion: "Hindu", gender: "Male", profession: "Project Engineer", initial: "A" },
  { id: "KNS-1043", name: "Divya S.", age: 26, height: "5'4\"", rasi: "Rishabam", education: "M.Sc. Biotech", location: "Tiruppur", religion: "Hindu", gender: "Female", profession: "Research Associate", initial: "D" },
  { id: "KNS-1044", name: "Jeyaraj M.", age: 30, height: "5'11\"", rasi: "Meenam", education: "MBA Finance", location: "Coimbatore", religion: "Christian", gender: "Male", profession: "Bank Manager", initial: "J" },
  { id: "KNS-1045", name: "Priyanka V.", age: 25, height: "5'3\"", rasi: "Kanni", education: "B.Com CA", location: "Pollachi", religion: "Hindu", gender: "Female", profession: "Auditor", initial: "P" },
  { id: "KNS-1046", name: "Sundar K.", age: 32, height: "5'9\"", rasi: "Dhanusu", education: "B.Tech IT", location: "Coimbatore", religion: "Hindu", gender: "Male", profession: "Software Lead", initial: "S" },
  { id: "KNS-1047", name: "Mary Jenisha", age: 27, height: "5'5\"", rasi: "Thulam", education: "M.A. English", location: "Coimbatore", religion: "Christian", gender: "Female", profession: "Lecturer", initial: "M" },
];

export const MEMBERS = [
  { name: "Mr. Selvaraj K.", area: "Tatabad", profession: "Textile Trader" },
  { name: "Mrs. Lakshmi N.", area: "RS Puram", profession: "School Principal" },
  { name: "Dr. Rajan P.", area: "Saibaba Colony", profession: "Cardiologist" },
  { name: "Mr. Anbalagan V.", area: "Peelamedu", profession: "Civil Contractor" },
  { name: "Mrs. Kavitha S.", area: "Gandhipuram", profession: "CA" },
  { name: "Mr. Joseph D.", area: "Race Course", profession: "Hotel Owner" },
  { name: "Mr. Murugesan R.", area: "Singanallur", profession: "Auto Parts Dealer" },
  { name: "Dr. Vimala J.", area: "Vadavalli", profession: "Dentist" },
];

export const EVENTS = [
  { title: "Annual Matrimony Meet 2026", date: "Jan 18, 2026", venue: "Sangam Hall, Tatabad", desc: "Open meet for registered families to interact and shortlist proposals." },
  { title: "Scholarship Distribution", date: "Feb 02, 2026", venue: "Sangam Auditorium", desc: "Merit and need-based scholarships for school and college students." },
  { title: "Business Network Breakfast", date: "Feb 15, 2026", venue: "Hotel Heritage Inn", desc: "Monthly meet for Nadar entrepreneurs and traders of Coimbatore." },
  { title: "Health Camp", date: "Mar 09, 2026", venue: "Community Hall, RS Puram", desc: "Free general health screening with PSG Hospitals." },
];

export const OFFICE_BEARERS = [
  { name: "Thiru. R. Selvaraj", role: "President", initial: "S" },
  { name: "Thiru. K. Murugesan", role: "Vice President", initial: "M" },
  { name: "Thiru. P. Anbalagan", role: "Secretary", initial: "A" },
  { name: "Thiru. D. Joseph", role: "Joint Secretary", initial: "J" },
  { name: "Thiru. V. Rajkumar", role: "Treasurer", initial: "R" },
  { name: "Thirumathi L. Kavitha", role: "Women's Wing Head", initial: "K" },
];
