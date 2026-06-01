import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Search, Plus, X, Award, CheckCircle2, 
  HelpCircle, ChevronRight, BarChart2, Check, Star, PlayCircle
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '../../admin/utils/cn';

// Predefined taxonomy for skills autocomplete
const TAXONOMY = [
  'React', 'Node.js', 'TypeScript', 'GraphQL', 'AWS', 'Docker', 'Kubernetes',
  'Next.js', 'Python', 'Tailwind CSS', 'PostgreSQL', 'MongoDB', 'Figma', 
  'Solidity', 'Web3.js', 'Go', 'Redis', 'CI/CD', 'Machine Learning', 'TensorFlow'
];

export default function SkillsManagementPage() {
  const [skills, setSkills] = useState([
    { name: 'React', level: 'Expert', verified: true, endorsedCount: 14 },
    { name: 'Node.js', level: 'Expert', verified: true, endorsedCount: 8 },
    { name: 'TypeScript', level: 'Intermediate', verified: false, endorsedCount: 3 },
    { name: 'GraphQL', level: 'Intermediate', verified: false, endorsedCount: 0 },
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulated skill assessment test modal states
  const [testModalSkill, setTestModalSkill] = useState(null); // skill object if modal open
  const [testStep, setTestStep] = useState(0); // 0 = Intro, 1 = Question, 2 = Results
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const addSkill = (e) => {
    e.preventDefault();
    const cleanName = newSkillName.trim();
    if (!cleanName) return;

    if (skills.some(s => s.name.toLowerCase() === cleanName.toLowerCase())) {
      toast.error('Skill tag already added!');
      return;
    }

    const newSkill = {
      name: cleanName,
      level: newSkillLevel,
      verified: false,
      endorsedCount: 0
    };

    setSkills([...skills, newSkill]);
    setNewSkillName('');
    toast.success(`Successfully added: ${cleanName}`);
  };

  const removeSkill = (name) => {
    setSkills(skills.filter(s => s.name !== name));
    toast.success(`Deleted skill tag: ${name}`);
  };

  const handleEndorseSimulate = (name) => {
    setSkills(skills.map(s => s.name === name ? { ...s, endorsedCount: s.endorsedCount + 1 } : s));
    toast.success(`Simulated endorsement for ${name}!`);
  };

  const startVerificationTest = (skill) => {
    setTestModalSkill(skill);
    setTestStep(0);
    setSelectedAnswer(null);
  };

  const completeTest = () => {
    if (selectedAnswer === 1) { // Let's say option 1 is correct
      setSkills(skills.map(s => s.name === testModalSkill.name ? { ...s, verified: true } : s));
      setTestStep(2);
      toast.success(`${testModalSkill.name} Skill Verified!`);
    } else {
      toast.error('Incorrect answer. Please review topics and try again in 24 hours.');
      setTestModalSkill(null);
    }
  };

  const filteredTaxonomy = TAXONOMY.filter(
    item => item.toLowerCase().includes(searchQuery.toLowerCase()) && 
    !skills.some(s => s.name.toLowerCase() === item.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12 font-sans relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-success/20 text-success rounded-xl shadow-sm border border-success/20">
              <Award size={24} />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Skills Directory</h1>
          </div>
          <p className="text-sm text-text-secondary font-medium">
            Manage your verified capabilities, ratings, and endorsements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Add Skill Form & Taxonomy */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-base font-black text-text-primary mb-4 flex items-center gap-2 border-b border-border pb-3">
              <Plus className="w-5 h-5 text-success" />
              Add Skill Tag
            </h3>
            
            <form onSubmit={addSkill} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1.5">Skill Name</label>
                <input 
                  type="text" 
                  value={newSkillName}
                  onChange={(e) => { setNewSkillName(e.target.value); setSearchQuery(e.target.value); }}
                  placeholder="e.g. Docker, Next.js"
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  required
                />
              </div>

              {/* Taxonomy Suggestions */}
              {newSkillName.trim() && filteredTaxonomy.length > 0 && (
                <div className="p-2 border border-border/80 rounded-xl bg-light-gray/20 max-h-36 overflow-y-auto space-y-1">
                  <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest px-2 pb-1 border-b border-border/50">Suggestions</p>
                  {filteredTaxonomy.map(tax => (
                    <button 
                      key={tax} 
                      type="button"
                      onClick={() => { setNewSkillName(tax); setSearchQuery(''); }}
                      className="w-full text-left px-2 py-1.5 text-xs font-bold text-text-primary hover:bg-success/10 hover:text-success rounded-lg transition-colors flex justify-between items-center"
                    >
                      {tax}
                      <ChevronRight size={12} />
                    </button>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1.5">Proficiency Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Beginner', 'Intermediate', 'Expert'].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewSkillLevel(lvl)}
                      className={cn(
                        "py-2 rounded-xl text-xs font-black border transition-all",
                        newSkillLevel === lvl 
                          ? "border-success bg-success/10 text-success" 
                          : "border-border bg-light-gray text-text-secondary hover:border-border-hover hover:text-text-primary"
                      )}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" className="w-full py-3 bg-success hover:bg-success/95 text-white font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#14a800]/20 mt-4 flex items-center justify-center gap-1.5">
                <Plus size={16} /> Add Skill Tag
              </button>
            </form>
          </Card>

          {/* Stats/Distribution Summary */}
          <Card className="bg-[#222222] border border-border p-6 rounded-[24px] text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-[-40%] right-[-10%] w-64 h-64 bg-success/10 blur-[80px] rounded-full pointer-events-none"></div>
            <h3 className="text-sm font-black tracking-widest uppercase mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
              <BarChart2 className="w-4 h-4 text-success" />
              Expertise Distribution
            </h3>
            
            <div className="space-y-4 relative z-10">
              {[
                { label: 'Expert Skills', count: skills.filter(s => s.level === 'Expert').length, pct: 60, color: 'bg-success' },
                { label: 'Intermediate', count: skills.filter(s => s.level === 'Intermediate').length, pct: 30, color: 'bg-[#e63946]' },
                { label: 'Beginner', count: skills.filter(s => s.level === 'Beginner').length, pct: 10, color: 'bg-amber-400' },
              ].map(item => (
                <div key={item.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-white/90">
                    <span>{item.label}</span>
                    <span>{item.count} tags</span>
                  </div>
                  <div className="w-full bg-white/5 border border-white/10 h-2 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${item.count ? item.pct : 0}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Side: Skill Tags Matrix & Assessments */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-base font-black text-text-primary mb-6 flex justify-between items-center border-b border-border pb-3">
              <span>Active Capabilities ({skills.length})</span>
            </h3>

            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border/80 hover:border-success/60 rounded-2xl bg-light-gray/20 hover:bg-white hover:shadow-md transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-success/15 text-success flex items-center justify-center font-bold font-mono">
                      {skill.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-text-primary text-sm">{skill.name}</span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-widest",
                          skill.level === 'Expert' 
                            ? 'bg-success/10 text-success border-success/20' 
                            : skill.level === 'Intermediate' 
                              ? 'bg-[#e63946]/10 text-[#e63946] border-[#e63946]/20' 
                              : 'bg-amber-100 text-amber-600 border-amber-200'
                        )}>
                          {skill.level}
                        </span>
                        {skill.verified && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-success bg-success/15 px-2 py-0.5 rounded-full border border-success/20">
                            <CheckCircle2 size={12} /> Verified
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1 font-bold">
                        <span>{skill.endorsedCount} Endorsements</span>
                        <span>•</span>
                        <button onClick={() => handleEndorseSimulate(skill.name)} className="text-success hover:underline">
                          Simulate +1
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    {!skill.verified ? (
                      <button 
                        onClick={() => startVerificationTest(skill)}
                        className="px-3.5 py-1.5 bg-success hover:bg-success/90 text-white rounded-lg text-xs font-black transition-all flex items-center gap-1 shadow-sm"
                      >
                        <PlayCircle size={14} /> Verify Skill
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-text-secondary flex items-center gap-1 bg-light-gray/60 px-2.5 py-1.5 rounded-lg border border-border">
                        <Check size={14} /> Assessment Passed
                      </span>
                    )}
                    <button 
                      onClick={() => removeSkill(skill.name)} 
                      className="p-2 text-text-secondary hover:text-[#e63946] hover:bg-light-gray rounded-xl transition-all"
                      title="Remove Skill Tag"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {skills.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="w-12 h-12 text-text-secondary mx-auto mb-3 animate-bounce" />
                  <h4 className="font-bold text-text-primary text-base">No capabilities defined</h4>
                  <p className="text-xs text-text-secondary mt-1">Add skill tags on the left to show clients what you can do.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>

      {/* --- ASSESSMENT TEST MODAL --- */}
      {testModalSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-lg shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Award className="w-5 h-5 text-success" />
                {testModalSkill.name} Capability Assessment
              </h3>
              <button onClick={() => setTestModalSkill(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>

            {testStep === 0 && (
              <div className="space-y-4">
                <p className="text-sm text-text-secondary font-medium leading-relaxed">
                  Welcome to the <span className="font-bold text-text-primary">{testModalSkill.name}</span> skill validation test. This exam consists of 1 core concept question to test your expert proficiency. Passing will award you the <span className="text-success font-bold">"Verified Badge"</span> visible to premium enterprise clients.
                </p>
                <div className="p-4 bg-light-gray/40 border border-border rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Duration: ~ 2 minutes</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-text-primary">
                    <CheckCircle2 className="w-4 h-4 text-success" />
                    <span>Type: 1 Multiple Choice</span>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setTestModalSkill(null)}>Cancel</Button>
                  <Button variant="primary" onClick={() => setTestStep(1)}>Start Assessment</Button>
                </div>
              </div>
            )}

            {testStep === 1 && (
              <div className="space-y-4">
                <div className="bg-light-gray/40 p-4 rounded-xl border border-border mb-4">
                  <span className="text-[10px] font-black uppercase text-success tracking-widest block mb-1">Question 1 of 1</span>
                  <p className="text-sm font-bold text-text-primary leading-relaxed">
                    Which of the following is true regarding performance optimization in React applications?
                  </p>
                </div>

                <div className="space-y-2">
                  {[
                    'Replacing all state changes with Redux actions automatically stops re-renders.',
                    'useMemo and useCallback memoize values/references to prevent expensive re-evaluations or unnecessary downstream rendering.',
                    'React re-renders a child component only when its specific props value changes.',
                    'Adding inline functions to JSX properties completely overrides React Fiber diff algorithms.'
                  ].map((answer, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedAnswer(index)}
                      className={cn(
                        "w-full text-left p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-between",
                        selectedAnswer === index
                          ? "border-success bg-success/5 text-success shadow-sm"
                          : "border-border bg-white text-text-secondary hover:border-border-hover hover:bg-light-gray/20"
                      )}
                    >
                      <span>{answer}</span>
                      {selectedAnswer === index && <Check size={14} className="shrink-0 ml-2" />}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-border mt-6">
                  <Button variant="outline" onClick={() => setTestStep(0)}>Back</Button>
                  <button 
                    onClick={completeTest}
                    disabled={selectedAnswer === null}
                    className="px-5 py-2.5 bg-success hover:bg-success/90 text-white font-bold rounded-xl text-xs transition-colors shadow-sm disabled:opacity-40"
                  >
                    Submit Assessment
                  </button>
                </div>
              </div>
            )}

            {testStep === 2 && (
              <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center mx-auto">
                  <Award size={32} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-text-primary">Congratulations!</h4>
                  <p className="text-xs text-text-secondary mt-1">
                    You passed the assessment with a score of 100%! The verified capability badge has been attached to <span className="font-bold text-text-primary">{testModalSkill.name}</span>.
                  </p>
                </div>
                <div className="pt-4">
                  <Button variant="primary" onClick={() => setTestModalSkill(null)} className="w-full">Done</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

    </div>
  );
}
