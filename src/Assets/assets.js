import {
  Code,
  DollarSign,
  FileText,
  Palette,
  PenTool,
  Settings,
  Video,
  Zap,
} from "lucide-react";
import Image from "../Assets/Coloredlogo.jpg";
import Image1 from "../Assets/image2.jpg";
import create_img from "../Assets/create-job.jpg"
import apply_img from "../Assets/apply.jpg"
import career_img from "../Assets/hire-manage.jpg"
import hire_img from "../Assets/apply.jpg"
import browse_img from "../Assets/browse-jobs.jpg"
import interview_img from "../Assets/interview-talent.jpg"

export const categories = [
  {
    name: "Design & Creative",
    desc: "Branding, logos, UI/UX, illustration",
    icon: <Palette className="w-8 h-8" />,
  },
  {
    name: "Development & IT",
    desc: "Websites, apps, software, AI & automation",
    icon: <Code className="w-8 h-8" />,
  },
  {
    name: "Design and Creative",
    desc: "SEO, social media, advertising, content marketing",
    icon: <PenTool className="w-8 h-8" />,
  },
  {
    name: "Writing & Translation",
    desc: "Copywriting, blogs, translations, editing",
    icon: <FileText className="w-8 h-8" />,
  },
  {
    name: "Video & Animation",
    desc: "Editing, motion graphics, explainer videos",
    icon: <Video className="w-8 h-8" />,
  },
  {
    name: "AI services",
    desc: "Data entry, virtual assistance, consulting",
    icon: <Zap className="w-8 h-8" />,
  },
  {
    name: "Sales and Marketing",
    desc: "Data entry, virtual assistance, consulting",
    icon: <DollarSign className="w-8 h-8" />,
  },
  {
    name: "Admin and Support",
    desc: "Data entry, virtual assistance, consulting",
    icon: <Settings />,
  },
];

export const freelancers = [
  { name: "Dickson j.", role: "Logo Designer", rating: 4.9, img: Image1 },
  {
    name: "Dickson j.",
    role: "Full-Stack Developer",
    rating: 4.8,
    img: Image1,
  },
  { name: "Dickson j.", role: "Social Media Expert", rating: 5.0, img: Image1 },
  { name: "Dickson j.", role: "Video Editor", rating: 4.7, img: Image1 },
  { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
  { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
  { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
  { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
  { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
  { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
  { name: "Dickson j.", role: "SEO Specialist", rating: 4.9, img: Image1 },
];

export const trendingProjects = [
  { name: "E-commerce Website", price: "from Ksh 2,500", img: Image },
  { name: "Brand Logo Design", price: "from Ksh 500", img: Image },
  { name: "Social Media Campaign", price: "from Ksh 700", img: Image },
  { name: "Explainer Video", price: "from Ksh 900", img: Image },
  { name: "Explainer Video", price: "from Ksh 900", img: Image },
  { name: "Explainer Video", price: "from Ksh 900", img: Image },
  { name: "Explainer Video", price: "from Ksh 900", img: Image },
  { name: "Explainer Video", price: "from Ksh 900", img: Image },
];

 export  const hiringCards = [
    {
      title: "Create Job Post",
      image: create_img,
      description: "Post your project requirements and attract qualified freelancers.",
      action: "Create Post"
    },
    {
      title: "Interview Talent",
      image: interview_img,
      description: "Review applications and schedule interviews with top candidates.",
      action: "View Applicants"
    },
    {
      title: "Hire & Manage",
      image: hire_img,
      description: "Hire your chosen freelancer and manage the project seamlessly.",
      action: "Manage Projects"
    }
  ];

  // Work cards data
 export const workCards = [
    {
      title: "Browse Jobs",
      image: browse_img,
      description: "Find projects that match your skills and interests.",
      action: "Search Jobs"
    },
    {
      title: "Quick Apply",
      image: apply_img,
      description: "Apply to jobs quickly with your saved profile and portfolio.",
      action: "Apply Now"
    },
    {
      title: "Grow Career",
      image: career_img,
      description: "Build your reputation and get more high-paying projects.",
      action: "View Profile"
    }
  ];
