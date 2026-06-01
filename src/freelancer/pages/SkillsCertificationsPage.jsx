import React, { useState } from 'react';
import { Award, CheckCircle, Search, Plus, X } from 'lucide-react';

export default function SkillsCertificationsPage() {
  const [skills, setSkills] = useState(['React', 'Node.js', 'TypeScript', 'GraphQL']);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = (e) => {
    e.preventDefault();
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills & Certifications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your expertise tags and verify your credentials.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Your Skills</h2>
        <form onSubmit={addSkill} className="flex mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="flex-1 block w-full pl-10 rounded-l-lg border-gray-300 dark:border-gray-700 bg-surface dark:bg-gray-800 focus:ring-[#14a800] focus:border-[#14a800]/20 sm:text-sm text-gray-900 dark:text-white"
            placeholder="E.g., Python, UI Design, AWS..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-[#14a800] text-white rounded-r-lg hover:bg-[#118a00] font-medium text-sm border border-transparent">
            Add
          </button>
        </form>
        
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {skill}
              <button onClick={() => removeSkill(skill)} className="ml-2 text-gray-400 hover:text-red-500 focus:outline-none">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Verified Certifications</h2>
          <button className="text-sm font-medium text-[#14a800] hover:text-[#14a800] flex items-center">
            <Plus className="w-4 h-4 mr-1" /> Add Manual
          </button>
        </div>
        
        <ul className="space-y-4">
          <li className="flex items-start p-4 bg-surface dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
            <Award className="w-8 h-8 text-yellow-500 mr-4 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-white">AWS Certified Solutions Architect</h4>
              <p className="text-sm text-gray-500 mt-1">Amazon Web Services (AWS) • Issued Jan 2023</p>
              <div className="mt-2 flex items-center text-xs font-medium text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4 mr-1" /> Credential Verified via Credly
              </div>
            </div>
          </li>
          
          <li className="flex items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl hover:border-[#14a800]/20 hover:bg-[#14a800]/5 dark:hover:bg-[#14a800]/10 transition-colors cursor-pointer group">
            <div className="text-center">
              <Award className="w-8 h-8 text-gray-400 group-hover:text-[#14a800] mx-auto mb-2" />
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Connect Credly Account</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
