import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // For redirect after signup
import "./signup.css";

const allSkills = ["React","Node.js","UI/UX","Python","Django","JavaScript","TailwindCSS","Figma","Next.js","Vue.js","Angular","PHP"];
const countries = ["Kenya","USA","UK","Canada","India","Germany"];
const languages = ["English","French","Spanish","Swahili","German","Hindi"];
const currencies = ["KES","USD","EUR","GBP","INR","CAD"];
const industries = ["Technology","Finance","Healthcare","Education","E-commerce","Marketing","Manufacturing"];

const stepGuidance = {
  freelancer: {
    1: "Choose your role",
    2: "Enter your basic details",
    3: "Add your skills & bio",
    4: "Set your hourly rate & currency",
    5: "Upload portfolio files & intro video",
    6: "Select country, languages & agree to terms"
  },
  client: {
    1: "Choose your role",
    2: "Enter company details",
    3: "Company industry & niche",
    4: "Budget & hiring capacity",
    5: "Select country, languages & agree to terms"
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
    companyName:"", companyDescription:"", industry:"", budget:"", hiringCapacity:"",
    // Common Fields
    country:"", languages:[], terms:false
  });

  const totalSteps = role === "client" ? 5 : 6;
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

  const handleChange = e => setFormData({...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e,type) => {
    const files = Array.from(e.target.files);
    if(!files.length) return;
    if(type==="avatar") setFormData({...formData, avatar: URL.createObjectURL(files[0])});
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

  return (
    <div className="signup-container-guided">
      <h2>Join Our Platform</h2>

      <div className="step-icons-guided">
        {Array.from({length: totalSteps}).map((_,i)=>(
          <div key={i} className={`step-circle ${i+1<=step?"active":""}`}>{i+1}</div>
        ))}
      </div>

      <p className="step-guidance">{role?stepGuidance[role][step]:stepGuidance["freelancer"][step]}</p>
      <div className="progress-bar-bg-guided">
        <motion.div className="progress-bar-fill-guided" initial={{width:0}} animate={{width:`${progress}%`}} transition={{duration:0.5}}/>
      </div>

      <form onSubmit={handleSubmit} className="signup-form-guided">
        <AnimatePresence custom={direction} exitBeforeEnter>

        {/* Step 1: Role */}
        {step===1 && (
          <motion.div key="step1" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5,ease:"easeInOut"}}>
            <div className="role-buttons-guided">
              <button type="button" className={`role-btn-guided ${role==="freelancer"?"selected":""}`} onClick={()=>setRole("freelancer")}>Freelancer</button>
              <button type="button" className={`role-btn-guided ${role==="client"?"selected":""}`} onClick={()=>setRole("client")}>Client</button>
            </div>
            {role && <button type="button" className="btn-next-guided" onClick={nextStep}>Next</button>}
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
          </motion.div>
        )}

        {/* Step 3 */}
        {step===3 && role==="freelancer" && (
          <motion.div key="freelancer3" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
            <label>Skills</label>
            <div className="skills-container-guided">
              {allSkills.map(skill=>(<button key={skill} type="button" className={`skill-btn-guided ${formData.skills.includes(skill)?"selected":""}`} onClick={()=>toggleSkill(skill)}>{skill}</button>))}
            </div>
            <label>Short Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Introduce yourself" required/>
          </motion.div>
        )}

        {step===3 && role==="client" && (
          <motion.div key="client3" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
            <label>Company Description / Niche</label>
            <textarea name="companyDescription" value={formData.companyDescription} onChange={handleChange} placeholder="Describe your company & niche" required/>
            <label>Industry</label>
            <select name="industry" value={formData.industry} onChange={handleChange}>
              <option value="">Select Industry</option>
              {industries.map(ind=><option key={ind}>{ind}</option>)}
            </select>
          </motion.div>
        )}

        {/* Step 4 */}
        {step===4 && role==="freelancer" && (
          <motion.div key="freelancer4" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
            <label>
              Hourly Rate 
              <span title="Set your expected hourly rate in your preferred currency" style={{cursor:"help", fontSize:"0.9rem"}}> ⓘ</span>
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

        {step===4 && role==="client" && (
          <motion.div key="client4" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
            <label>Budget (per project / month)</label>
            <input type="number" name="budget" value={formData.budget} onChange={handleChange} placeholder="Budget in USD"/>
            <label>Hiring Capacity (Number of freelancers)</label>
            <input type="number" name="hiringCapacity" value={formData.hiringCapacity} onChange={handleChange} placeholder="No. of hires"/>
          </motion.div>
        )}

        {/* Step 5 */}
        {step===5 && role==="freelancer" && (
          <motion.div key="freelancer5" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
            <label>Portfolio Upload (Images, PDFs)</label>
            <input type="file" multiple accept="image/*,.pdf" onChange={e=>handleFileChange(e,"portfolio")}/>
            <div className="portfolio-preview-guided">
              {formData.portfolio.map((p,i)=><img key={i} src={p} alt={`portfolio ${i}`}/>)}
            </div>

            <label>
              Intro Video (Max 5 min)
              <span title="Upload a short introduction video. Maximum duration: 5 minutes" style={{cursor:"help", fontSize:"0.9rem"}}> ⓘ</span>
            </label>
            <input type="file" accept="video/*" onChange={e=>handleFileChange(e,"video")}/>
            <div className="portfolio-preview-guided">
              {formData.portfolioVideos.map((v,i)=><video key={i} src={v} controls width="200"/>)}
            </div>
          </motion.div>
        )}

        {step===5 && role==="client" && (
          <motion.div key="client5" custom={direction} variants={variants} initial="initial" animate="animate" exit="exit" transition={{duration:0.5}}>
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
            {step<totalSteps && <button type="button" className="btn-next-guided" onClick={nextStep}>Next</button>}
            {step===totalSteps && <button type="submit" className="btn-submit-guided">Submit</button>}
          </div>
        )}

      </form>
    </div>
  )
}

export default Signup;
