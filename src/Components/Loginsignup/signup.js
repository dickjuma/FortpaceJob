import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // For redirect after signup
import "./signup.css";

const allSkills = ["React","Node.js","UI/UX","Python","Django","JavaScript","TailwindCSS","Figma","Next.js","Vue.js","Angular","PHP"];
const countries = ["Kenya","USA","UK","Canada","India","Germany"];
const languages = ["English","French","Spanish","Swahili","German","Hindi"];
const currencies = ["KES","USD","EUR","GBP","INR","CAD"];
const industries = ["Technology","Finance","Healthcare","Education","E-commerce","Marketing","Manufacturing"];
const serviceModes = ["Fully online","Physical on-site","Hybrid (online + on-site)"];
const physicalCategories = ["Mechanical","Electrical","Auto repair","Home services","Beauty/Wellness","Other"];
const physicalMicroSectors = {
  Mechanical: ["Engine diagnostics","Machine maintenance","Welding","CNC operation","HVAC systems","Pumps and valves"],
  Electrical: ["Residential wiring","Commercial wiring","Panel upgrades","Solar installation","Generator setup","Troubleshooting"],
  "Auto repair": ["Oil change","Brake service","Diagnostics","Suspension","AC service","Battery and starter"],
  "Home services": ["Plumbing","Carpentry","Painting","Appliance repair","Pest control","Roofing"],
  "Beauty/Wellness": ["Hair styling","Nails","Makeup","Massage","Barbering","Skincare"],
  Other: ["General repairs","Handyman","Installation","Inspection","Other"]
};

const stepGuidance = {
  freelancer: {
    1: "Choose your role",
    2: "Create your account",
    3: "Services you offer (online or on-site)",
    4: "Add your skills & bio",
    5: "Set your hourly rate & currency",
    6: "Upload portfolio files & intro video",
    7: "Select country, languages & agree to terms"
  },
  client: {
    1: "Choose your role",
    2: "Create your company account",
    3: "Type of services you need",
    4: "Company industry & niche",
    5: "Budget, location & hiring capacity"
  }
};

const Signup = () => {
  const navigate = useNavigate(); // Hook for redirect
  const [step, setStep] = useState(1);
  const [role, setRole] = useState("");
  const [direction, setDirection] = useState(0);
  const [formData, setFormData] = useState({
    // Freelancer Fields
    name:"", email:"", password:"", avatar:null, skills:[], bio:"", hourlyRate:10, currency:"KES",
    portfolio:[], portfolioVideos:[],
    // Client Fields
    companyName:"", companyDescription:"", industry:"", budget:"", hiringCapacity:"", companyLogo:null,
    // Common Fields
    serviceMode:"", physicalCategory:"", serviceArea:"",
    country:"", languages:[], terms:false
  });

  const totalSteps = role === "client" ? 5 : 7;
  const progress = (step / totalSteps) * 100;

  const nextStep = () => {
    if(step===1 && role==="") return alert("Select a role first!");
    setDirection(1);
    setStep(step+1);
  }

  const prevStep = () => { 
    setDirection(-1); 
    setStep(step-1); 
  }

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === "serviceMode") {
      setFormData({
        ...formData,
        serviceMode: value,
        physicalCategory: "",
        serviceArea: "",
        skills: []
      });
      return;
    }
    if (name === "physicalCategory") {
      setFormData({
        ...formData,
        physicalCategory: value,
        skills: []
      });
      return;
    }
    setFormData({...formData, [name]: value });
  };

  const handleFileChange = (e,type) => {
    const files = Array.from(e.target.files);
    if(!files.length) return;
    if(type==="avatar") setFormData({...formData, avatar: URL.createObjectURL(files[0])});
    if(type==="logo") setFormData({...formData, companyLogo: URL.createObjectURL(files[0])});
    if(type==="portfolio") setFormData({...formData, portfolio:[...formData.portfolio, ...files.map(f=>URL.createObjectURL(f))]});
    if(type==="video") setFormData({...formData, portfolioVideos:[...formData.portfolioVideos, ...files.map(f=>URL.createObjectURL(f))]});
  }

  const toggleSkill = skill => {
    const skills = formData.skills.includes(skill) ? formData.skills.filter(s=>s!==skill) : [...formData.skills, skill];
    setFormData({...formData, skills});
  }

  const toggleLanguage = lang => {
    const langs = formData.languages.includes(lang) ? formData.languages.filter(l=>l!==lang) : [...formData.languages, lang];
    setFormData({...formData, languages:langs});
  }

  const handleSubmit = e => {
    e.preventDefault();
    if(!formData.terms) return alert("You must agree to terms!");
    console.log("Signup Data:",{role, ...formData});
    alert("Signup complete! Redirecting to login...");
    navigate("/login"); // Redirect to login page after signup
  }

  const passwordStrength = pwd => {
    if(pwd.length>8 && /[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) return "strong";
    if(pwd.length>=6) return "medium";
    return "weak";
  }

  const variants = {
    initial: dir => ({ x: dir>0 ? "100%" : "-100%", opacity:0 }),
    animate: { x:0, opacity:1 },
    exit: dir => ({ x: dir<0 ? "100%" : "-100%", opacity:0 })
  }

  const isPhysical = formData.serviceMode === "Physical on-site" || formData.serviceMode === "Hybrid (online + on-site)";
  const skillOptions = isPhysical && formData.physicalCategory
    ? (physicalMicroSectors[formData.physicalCategory] || [])
    : allSkills;

  return (
    <div className="signup-container-guided">
      <div className="signup-shell">
        <aside className="signup-left">
          <h2>Join Forte</h2>
          <p className="signup-subtitle">Create your account and start offering or hiring trusted services.</p>
          <ul className="signup-points">
            <li>Verified profiles and secure payments</li>
            <li>Online and physical service categories</li>
            <li>Showcase your portfolio or post your needs</li>
          </ul>
          <div className="step-icons-guided">
            {Array.from({length: totalSteps}).map((_,i)=>(
              <div key={i} className={`step-circle ${i+1<=step?"active":""}`}>{i+1}</div>
            ))}
          </div>
          <p className="step-guidance">{role?stepGuidance[role][step]:stepGuidance["freelancer"][step]}</p>
          <div className="progress-bar-bg-guided">
            <motion.div className="progress-bar-fill-guided" initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:0.5}}/>
          </div>
        </aside>

        <section className="signup-right">
          <form onSubmit={handleSubmit} className="signup-form-guided">
            <AnimatePresence custom={direction} exitBeforeEnter>

              {/* Step 1: Role */}
              {step===1 && (
                <motion.div key="step1" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5,ease:"easeInOut"}}>
                  <div className="role-card-grid">
                    <button type="button" className={`role-card ${role==="freelancer"?"selected":""}`} onClick={()=>setRole("freelancer")}>
                      <h3>Join as Talent</h3>
                      <p>Offer online or physical services and grow your business.</p>
                    </button>
                    <button type="button" className={`role-card ${role==="client"?"selected":""}`} onClick={()=>setRole("client")}>
                      <h3>Join as Client</h3>
                      <p>Hire verified talent for digital or on-site work.</p>
                    </button>
                  </div>
                  {role && <button type="button" className="btn-next-guided" onClick={nextStep}>Continue</button>}
                </motion.div>
              )}

              {/* Step 2 */}
              {step===2 && role==="freelancer" && (
                <motion.div key="freelancer2" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
                  <label>Name</label>
                  <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required/>
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required/>
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required/>
                  <div className={`password-strength ${passwordStrength(formData.password)}`}>
                    Strength: <span style={{
                      color: passwordStrength(formData.password) === "strong" ? "#2ecc71" :
                             passwordStrength(formData.password) === "medium" ? "#f39c12" : "#e74c3c",
                      fontWeight: "bold"
                    }}>{passwordStrength(formData.password)}</span>
                  </div>
                  <label>Profile Picture</label>
                  <input type="file" accept="image/*" onChange={e=>handleFileChange(e,"avatar")}/>
                  {formData.avatar && <img src={formData.avatar} alt="avatar" className="avatar-preview-guided"/>}
                </motion.div>
              )}

              {step===2 && role==="client" && (
                <motion.div key="client2" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
                  <label>Company Name</label>
                  <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required/>
                  <label>Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Company Email" required/>
                  <label>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required/>
                  <label>Company Logo</label>
                  <input type="file" accept="image/*" onChange={e=>handleFileChange(e,"logo")}/>
                  {formData.companyLogo && <img src={formData.companyLogo} alt="company logo" className="logo-preview-guided"/>}
                </motion.div>
              )}

              {/* Step 3 */}
              {step===3 && role==="freelancer" && (
                <motion.div key="freelancer3" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
                  <label>Service Type</label>
                  <select name="serviceMode" value={formData.serviceMode} onChange={handleChange} required>
                    <option value="">Select service type</option>
                    {serviceModes.map(mode=><option key={mode}>{mode}</option>)}
                  </select>
                  {(formData.serviceMode === "Physical on-site" || formData.serviceMode === "Hybrid (online + on-site)") && (
                    <>
                      <label>Physical Service Category</label>
                      <select name="physicalCategory" value={formData.physicalCategory} onChange={handleChange} required>
                        <option value="">Select category</option>
                        {physicalCategories.map(cat=><option key={cat}>{cat}</option>)}
                      </select>
                      <label>Service Area</label>
                      <input name="serviceArea" value={formData.serviceArea} onChange={handleChange} placeholder="City or service radius"/>
                    </>
                  )}
                </motion.div>
              )}

              {step===3 && role==="client" && (
                <motion.div key="client3" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
                  <label>Service Type Needed</label>
                  <select name="serviceMode" value={formData.serviceMode} onChange={handleChange} required>
                    <option value="">Select service type</option>
                    {serviceModes.map(mode=><option key={mode}>{mode}</option>)}
                  </select>
                  {(formData.serviceMode === "Physical on-site" || formData.serviceMode === "Hybrid (online + on-site)") && (
                    <>
                      <label>Physical Service Category</label>
                      <select name="physicalCategory" value={formData.physicalCategory} onChange={handleChange} required>
                        <option value="">Select category</option>
                        {physicalCategories.map(cat=><option key={cat}>{cat}</option>)}
                      </select>
                      <label>Service Location</label>
                      <input name="serviceArea" value={formData.serviceArea} onChange={handleChange} placeholder="City or address"/>
                    </>
                  )}
                </motion.div>
              )}

              {/* Step 4 */}
              {step===4 && role==="freelancer" && (
                <motion.div key="freelancer4" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
                  <label>{isPhysical ? "Micro Sectors / Specialties" : "Skills"}</label>
                  <div className="skills-container-guided">
                    {skillOptions.map(skill=>(
                      <button key={skill} type="button" className={`skill-btn-guided ${formData.skills.includes(skill)?"selected":""}`} onClick={()=>toggleSkill(skill)}>
                        {skill}
                      </button>
                    ))}
                  </div>
                  <label>Short Bio</label>
                  <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Introduce yourself" required/>
                </motion.div>
              )}

              {step===4 && role==="client" && (
                <motion.div key="client4" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
                  <label>Company Description / Niche</label>
                  <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} placeholder="Describe your company & niche" required/>
                  <label>Industry</label>
                  <select name="industry" value={formData.industry} onChange={handleChange}>
                    <option value="">Select Industry</option>
                    {industries.map(ind=><option key={ind}>{ind}</option>)}
                  </select>
                </motion.div>
              )}

              {/* Step 5 */}
              {step===5 && role==="freelancer" && (
                <motion.div key="freelancer5" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
                  <label>
                    Hourly Rate
                    <span title="Set your expected hourly rate in your preferred currency" style={{cursor:"help", fontSize:"0.9rem"}}> (i)</span>
                  </label>
                  <div className="hourly-rate-container">
                    <input type="range" name="hourlyRate" min="1" max="1000" value={formData.hourlyRate} onChange={handleChange}/>
                    <span className="hourly-value">{formData.hourlyRate}</span>
                    <select name="currency" value={formData.currency} onChange={handleChange}>
                      {currencies.map(cur=><option key={cur}>{cur}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}

              {step===5 && role==="client" && (
                <motion.div key="client5" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
                  <label>Budget (per project / month)</label>
                  <input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder="Budget in USD"/>
                  <label>Hiring Capacity (Number of freelancers)</label>
                  <input type="number" name="hiringCapacity" value={formData.hiringCapacity} onChange={handleChange} placeholder="No. of hires"/>
                  <label>Country</label>
                  <select name="country" value={formData.country} onChange={handleChange}>
                    <option value="">Select Country</option>
                    {countries.map(c=><option key={c}>{c}</option>)}
                  </select>
                  <label>Languages</label>
                  <div className="languages-container-guided">
                    {languages.map(lang=><button key={lang} type="button" className={`skill-btn-guided ${formData.languages.includes(lang)?"selected":""}`} onClick={()=>toggleLanguage(lang)}>{lang}</button>)}
                  </div>
                  <label><input type="checkbox" checked={formData.terms} onChange={e=>setFormData({...formData,terms:e.target.checked})}/> I agree to Terms & Privacy</label>
                </motion.div>
              )}

              {step===6 && role==="freelancer" && (
                <motion.div key="freelancer6" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
                  <label>Portfolio Upload (Images, PDFs)</label>
                  <input type="file" multiple accept="image/*,.pdf" onChange={e=>handleFileChange(e,"portfolio")}/>
                  <div className="portfolio-preview-guided">
                    {formData.portfolio.map((p,i)=><img key={i} src={p} alt={`portfolio ${i}`}/>) }
                  </div>

                  <label>
                    Intro Video (Max 5 min)
                    <span title="Upload a short introduction video. Maximum duration: 5 minutes" style={{cursor:"help", fontSize:"0.9rem"}}> (i)</span>
                  </label>
                  <input type="file" accept="video/*" onChange={e=>handleFileChange(e,"video")}/>
                  <div className="portfolio-preview-guided">
                    {formData.portfolioVideos.map((v,i)=><video key={i} src={v} controls width="200"/>) }
                  </div>
                </motion.div>
              )}

              {step===7 && role==="freelancer" && (
                <motion.div key="freelancer7" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
                  <label>Country</label>
                  <select name="country" value={formData.country} onChange={handleChange}>
                    <option value="">Select Country</option>
                    {countries.map(c=><option key={c}>{c}</option>)}
                  </select>
                  <label>Languages</label>
                  <div className="languages-container-guided">
                    {languages.map(lang=><button key={lang} type="button" className={`skill-btn-guided ${formData.languages.includes(lang)?"selected":""}`} onClick={()=>toggleLanguage(lang)}>{lang}</button>)}
                  </div>
                  <label><input type="checkbox" checked={formData.terms} onChange={e=>setFormData({...formData,terms:e.target.checked})}/> I agree to Terms & Privacy</label>
                </motion.div>
              )}

            </AnimatePresence>

            {/* Navigation Buttons */}
            {step>1 && step<=totalSteps && (
              <div className="button-group-guided">
                <button type="button" className="btn-back-guided" onClick={prevStep}>Back</button>
                {step<totalSteps && <button type="button" className="btn-next-guided" onClick={nextStep}>Continue</button>}
                {step===totalSteps && <button type="submit" className="btn-submit-guided">Create Account</button>}
              </div>
            )}

          </form>
        </section>
      </div>
    </div>
  )
}

export default Signup;
