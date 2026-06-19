import React, { useState, useEffect } from 'react';
import { useRegistration } from '../RegistrationContext';
import { Briefcase, Code, Link as LinkIcon, Github, Linkedin, ArrowLeft, ArrowRight, X } from 'lucide-react';
import { loadTalentCategories } from '../../../../client/pages/find-talent/talentMarketplaceData';

export const ProfessionalIdentity = () => {
  const { formData, updateFormData, nextStep, prevStep } = useRegistration();
  const [skillInput, setSkillInput] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadTalentCategories().then(cats => setCategories(cats || []));
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    nextStep();
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        updateFormData({ skills: [...formData.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    updateFormData({
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Professional Identity</h2>
        <p className="text-gray-500 mb-8">Tell us what you do and show off your past work.</p>

        <form onSubmit={handleNext} className="space-y-6 max-w-xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => updateFormData({ title: e.target.value })}
                className="pl-10 block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border p-3"
                placeholder="e.g. Senior Full Stack Developer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category (L1)</label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => updateFormData({ categoryId: e.target.value, subcategoryId: '', serviceId: '' })}
                className="block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border p-3"
              >
                <option value="">Select Category</option>
                {categories.filter(c => !c.parentId).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory (L2)</label>
              <select
                required
                disabled={!formData.categoryId}
                value={formData.subcategoryId}
                onChange={(e) => updateFormData({ subcategoryId: e.target.value, serviceId: '' })}
                className="block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border p-3 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">Select Subcategory</option>
                {categories.filter(c => c.parentId === formData.categoryId).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service (L3)</label>
              <select
                required
                disabled={!formData.subcategoryId}
                value={formData.serviceId}
                onChange={(e) => updateFormData({ serviceId: e.target.value })}
                className="block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border p-3 disabled:bg-gray-100 disabled:text-gray-400"
              >
                <option value="">Select Service</option>
                {categories.filter(c => c.parentId === formData.subcategoryId).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Overview</label>
            <textarea
              required
              rows={4}
              value={formData.overview}
              onChange={(e) => updateFormData({ overview: e.target.value })}
              className="block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border p-3"
              placeholder="Briefly describe your expertise and experience..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Code className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                className="pl-10 block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border p-3"
                placeholder="Type a skill and press Enter"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)} className="ml-1.5 text-blue-400 hover:text-blue-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio Website</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={formData.portfolioUrl}
                  onChange={(e) => updateFormData({ portfolioUrl: e.target.value })}
                  className="pl-10 block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border p-3"
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn Profile</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Linkedin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="url"
                  value={formData.linkedIn}
                  onChange={(e) => updateFormData({ linkedIn: e.target.value })}
                  className="pl-10 block w-full border-gray-300 rounded-xl focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm border p-3"
                  placeholder="LinkedIn URL"
                />
              </div>
            </div>
          </div>

          <button id="submit-step-2" type="submit" className="hidden"></button>
        </form>
      </div>

      {/* Footer Navigation */}
      <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center">
        <button
          onClick={prevStep}
          className="text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => document.getElementById('submit-step-2').click()}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition flex items-center gap-2"
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
