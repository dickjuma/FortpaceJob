import React, { useState, useMemo } from 'react';
import { 
  Folder, FileText, Image as ImageIcon, Archive, Plus, Search, 
  Trash2, Download, ArrowUpRight, ShieldCheck, ChevronRight, X, Clock, Database,
  LayoutGrid, List, File, Share2, MoreVertical, CheckCircle2, Lock, Eye, Sparkles,
  HelpCircle, User, Users, Info, Settings, ArrowRight, ShieldAlert, BarChart3, AlertCircle,
  FileSpreadsheet, Video, Star, RefreshCw, Layers, Shield, FileCheck, Check, Key, Trash, AlertTriangle, Loader2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

// --- Sample Initial Files Dataset ---
const INITIAL_FILES = [
  { id: 'f-1', name: 'nexus_database_schema.sql', type: 'Database', size: '2.4 MB', date: '2 hours ago', category: 'My Files', locked: false, version: 'v1.4', collaborators: ['Alex M.', 'Sarah J.'], desc: 'Production database schema tables for the financial backend ledger.', tags: ['database', 'schema'], approvalStatus: 'Approved' },
  { id: 'f-2', name: 'brand_identity_guidelines.pdf', type: 'PDF Document', size: '14.8 MB', date: 'Yesterday', category: 'Verification Docs', locked: true, version: 'v2.0', collaborators: ['Design Team'], desc: 'Official platform media kit and color guidelines.', tags: ['brand', 'legal'], approvalStatus: 'Approved' },
  { id: 'f-3', name: 'figma_landing_page_v3.fig', type: 'Design Asset', size: '48.2 MB', date: '3 days ago', category: 'Portfolio', locked: false, version: 'v3.1-Draft', collaborators: ['Alex M.'], desc: 'Draft layouts for fiverr style onboarding landing pages.', tags: ['ui', 'figma'], approvalStatus: 'Pending' },
  { id: 'f-4', name: 'invoice_INV_0042.pdf', type: 'Invoice', size: '1.2 MB', date: 'Last week', category: 'Invoices', locked: true, version: 'v1.0', collaborators: ['Finance Dep'], desc: 'Completed milestone payment receipt for HealthSync.', tags: ['invoice', 'finance'], approvalStatus: 'Approved' },
  { id: 'f-5', name: 'milestone_delivery_final.zip', type: 'Archive', size: '124 MB', date: '5 days ago', category: 'Deliveries', locked: false, version: 'v1.0', collaborators: ['Alex M.', 'Sarah J.'], desc: 'Deliverables for react native application bundle.', tags: ['delivery', 'code'], approvalStatus: 'Under Review' }
];

export default function FileManagerPage() {
  const [files, setFiles] = useState(INITIAL_FILES);
  const [activeCategory, setActiveCategory] = useState('My Files'); // My Files | Shared Files | Recent | Favorites | Contracts | Deliveries | Verification Docs | Invoices | Team Storage | Archived | Trash | File Analytics | Recent Activity
  const [viewMode, setViewMode] = useState('grid'); // grid | list | compact
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFile, setSelectedFile] = useState(INITIAL_FILES[0]);
  const [sortBy, setSortBy] = useState('name');
  
  // Custom dialogs & upload indicators
  const [activeModal, setActiveModal] = useState(null); // 'upload' | 'create_folder' | 'permissions'
  const [newFolderName, setNewFolderName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadSpeed, setUploadSpeed] = useState('');
  const [uploadRemaining, setUploadRemaining] = useState('');

  // AI assistant preview features
  const [aiAnalysis, setAiAnalysis] = useState(null);

  // MOCK FILTER SETTINGS
  const [selectedWorkspace, setSelectedWorkspace] = useState('All Workspaces');

  // Multi-File upload simulation
  const handleUploadSubmit = (e) => {
    e.preventDefault();
    triggerUploadSimulation('contract_agreement_v2.pdf');
  };

  const triggerUploadSimulation = (fileName = 'project_specification.pdf') => {
    setUploadProgress(10);
    setUploadSpeed('4.2 MB/s');
    setUploadRemaining('12 seconds');
    setActiveModal(null);
    toast('Initializing cloud encryption and malware scanning...', { icon: '🛡️' });

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setUploadProgress(null), 1200);

          const newFile = {
            id: 'f-' + Date.now(),
            name: fileName,
            type: fileName.endsWith('.pdf') ? 'PDF Document' : 'Archive',
            size: '5.2 MB',
            date: 'Just now',
            category: activeCategory,
            locked: false,
            version: 'v1.0',
            collaborators: ['You'],
            desc: 'Secure cloud uploaded client business asset.',
            tags: ['uploaded', 'external'],
            approvalStatus: 'Pending'
          };
          setFiles(prevFiles => [newFile, ...prevFiles]);
          setSelectedFile(newFile);
          toast.success(`"${newFile.name}" scanned & uploaded securely to cloud! 🚀`);
          return 100;
        }
        return prev + 30;
      });
    }, 450);
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    toast.success(`Folder "${newFolderName}" created inside ${activeCategory}! 📁`);
    setNewFolderName('');
    setActiveModal(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      triggerUploadSimulation(e.dataTransfer.files[0].name);
    }
  };

  // Actions
  const handleDownload = (name) => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 800)),
      {
        loading: `Syncing with secure node download key...`,
        success: `${name} securely saved locally! 💾`,
        error: 'Download link expired.'
      }
    );
  };

  const toggleLock = (id) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, locked: !f.locked } : f));
    toast.success('Access lock toggle updated.');
    if (selectedFile?.id === id) {
      setSelectedFile(prev => ({ ...prev, locked: !prev.locked }));
    }
  };

  const requestApproval = (id) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, approvalStatus: 'Under Review' } : f));
    toast.success('Approval request dispatched to workspace admin list.');
    if (selectedFile?.id === id) {
      setSelectedFile(prev => ({ ...prev, approvalStatus: 'Under Review' }));
    }
  };

  const handleDuplicate = (file) => {
    const dup = {
      ...file,
      id: 'f-' + Date.now(),
      name: `Copy of ${file.name}`,
      date: 'Just now'
    };
    setFiles([dup, ...files]);
    toast.success(`Duplicated "${file.name}"`);
  };

  const handleDelete = (id, name) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast.success(`"${name}" moved to Trash bin.`);
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

  const triggerAISummary = (file) => {
    setAiAnalysis('analyzing');
    setTimeout(() => {
      setAiAnalysis({
        summary: `This is a highly structured secure ${file.type} file asset. Version: ${file.version}. Collaborators include ${file.collaborators.join(', ')}. Zero malware elements found.`,
        tags: [...file.tags, 'ai-approved', 'scanned-ocr']
      });
      toast.success('AI Contract & OCR Extraction Completed! ✨');
    }, 1500);
  };

  const handleAddTag = (file, newTag) => {
    if (!newTag.trim()) return;
    const updated = { ...file, tags: [...file.tags, newTag.trim()] };
    setFiles(prev => prev.map(f => f.id === file.id ? updated : f));
    setSelectedFile(updated);
  };

  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      const catMatch = activeCategory === 'My Files' || f.category === activeCategory;
      const searchMatch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.type.toLowerCase().includes(searchTerm.toLowerCase());
      return catMatch && searchMatch;
    });
  }, [files, activeCategory, searchTerm]);

  const filteredAndSortedFiles = useMemo(() => {
    let result = filteredFiles;
    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'size') {
      result = [...result].sort((a, b) => b.size.localeCompare(a.size));
    }
    return result;
  }, [filteredFiles, sortBy]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />

      {/* Main Top Header */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 border-b border-border pb-6 mb-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-success/20 text-success rounded-xl border border-success/20 shadow-sm">
              <Folder className="w-6 h-6 animate-pulse" />
            </div>
            <h1 className="text-3xl font-black text-text-primary tracking-tight">Enterprise cloud workspace</h1>
          </div>
          <p className="text-sm text-text-secondary mt-1 font-semibold">
            Google Drive + Dropbox + Notion + Fiverr Deliveries cloud filesystem ledger.
          </p>
        </div>

        {/* Global actions and workspace selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <select 
            value={selectedWorkspace}
            onChange={(e) => setSelectedWorkspace(e.target.value)}
            className="text-xs font-black uppercase tracking-wider text-text-primary border border-border bg-white rounded-xl px-3 py-2 outline-none shadow-sm cursor-pointer"
          >
            <option>All Workspaces</option>
            <option>Freelancer Portfolios</option>
            <option>Agency Shared Vault</option>
            <option>Corporate Procurement</option>
          </select>

          <Button 
            onClick={() => setActiveModal('create_folder')}
            variant="outline" 
            className="rounded-xl font-bold text-xs shadow-sm bg-white border-border"
          >
            Create Folder
          </Button>

          <Button 
            onClick={() => setActiveModal('upload')}
            variant="primary" 
            className="bg-success hover:bg-success/95 font-bold text-xs rounded-xl border-none shadow-lg shadow-[#2bb75c]/10"
            icon={<Plus size={16} />}
          >
            Quick Upload
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Sidebar categories, Switcher & Quotas */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Workspace switcher mockup */}
          <div className="p-3 bg-light-gray/60 border border-border rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#222222] text-white text-[10px] font-black flex items-center justify-center">E</div>
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">Enterprise Suite</span>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary" />
          </div>

          {/* Left Categories List */}
          <Card className="p-4 border border-border bg-white shadow-sm space-y-2">
            {[
              { id: 'My Files', count: files.filter(f => f.category === 'My Files').length },
              { id: 'Shared Files', count: 0 },
              { id: 'Recent', count: 2 },
              { id: 'Favorites', count: 1 },
              { id: 'Contracts', count: 0 },
              { id: 'Deliveries', count: files.filter(f => f.category === 'Deliveries').length },
              { id: 'Verification Docs', count: files.filter(f => f.category === 'Verification Docs').length },
              { id: 'Invoices', count: files.filter(f => f.category === 'Invoices').length },
              { id: 'Team Storage', count: 0 },
              { id: 'Archived', count: 0 },
              { id: 'Trash', count: 0 }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setAiAnalysis(null); }}
                className={cn(
                  "w-full text-left px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex justify-between items-center",
                  activeCategory === cat.id 
                    ? "bg-[#222222] text-white shadow" 
                    : "text-text-secondary hover:text-text-primary hover:bg-light-gray"
                )}
              >
                <span>{cat.id}</span>
                {cat.count > 0 && (
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[8px] font-black",
                    activeCategory === cat.id ? "bg-white/20 text-white" : "bg-light-gray text-text-secondary"
                  )}>{cat.count}</span>
                )}
              </button>
            ))}
          </Card>

          {/* Extra View Pages Shortcuts: Analytics, Activity */}
          <Card className="p-4 border border-border bg-white shadow-sm space-y-2">
            <button 
              onClick={() => setActiveCategory('File Analytics')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2",
                activeCategory === 'File Analytics' ? "text-success" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <BarChart3 className="w-4 h-4" /> Storage Analytics
            </button>
            <button 
              onClick={() => setActiveCategory('Recent Activity')}
              className={cn(
                "w-full text-left px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2",
                activeCategory === 'Recent Activity' ? "text-success" : "text-text-secondary hover:text-text-primary"
              )}
            >
              <Clock className="w-4 h-4" /> Compliance Activity
            </button>
          </Card>

          {/* Storage Quota widget */}
          <Card className="p-5 border-none bg-[#222222] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-success/10 blur-[40px] rounded-full"></div>
            <h4 className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Cloud Space Occupancy</h4>
            <h3 className="text-2xl font-black mt-2">42.6 GB of 100 GB used</h3>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-success rounded-full" style={{ width: '42.6%' }}></div>
            </div>
            <span className="block text-[8px] text-white/40 mt-1 uppercase font-bold">Encrypted cloud space active</span>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Header Filters & View toggles */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-border p-3 rounded-2xl shadow-sm">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-3 text-text-secondary" />
              <input 
                type="text" 
                placeholder="Deep query OCR metadata..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full text-xs font-semibold text-text-primary border border-border bg-light-gray rounded-xl outline-none focus:bg-white focus:border-success"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
              {/* Sorting option */}
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-bold text-text-primary border border-border bg-light-gray rounded-xl px-2.5 py-1.5 outline-none"
              >
                <option value="name">Sort by Name</option>
                <option value="size">Sort by Size</option>
              </select>

              <div className="flex gap-1 bg-light-gray p-1 rounded-xl">
                {['grid', 'list', 'compact'].map(mode => (
                  <button 
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all", 
                      viewMode === mode ? "bg-white text-[#222222] shadow-sm" : "text-text-secondary"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Uploading status widget */}
          {uploadProgress !== null && (
            <Card className="p-4 border border-success/20 bg-success/5 rounded-2xl space-y-2 animate-in slide-in-from-top-2">
              <div className="flex justify-between items-center text-xs font-black text-success">
                <span className="flex items-center gap-1.5"><Loader2 className="w-4 h-4 animate-spin" /> Uploading background logs...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-success/20 rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-text-secondary">
                <span>Speed: {uploadSpeed}</span>
                <span>Remaining: {uploadRemaining}</span>
              </div>
            </Card>
          )}

          {/* Drag and Drop Zone */}
          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
              "border-2 border-dashed rounded-3xl p-6 text-center transition-all cursor-pointer",
              isDragging ? "border-success bg-success/5 scale-[0.99]" : "border-border hover:bg-light-gray/40"
            )}
          >
            <UploadCloud className="w-10 h-10 text-success mx-auto mb-2 animate-bounce" />
            <span className="text-xs font-black text-text-primary uppercase tracking-wider block">Drag files to launch background upload</span>
          </div>

          {/* Dynamic subpages based on activeCategory selection */}
          {activeCategory === 'File Analytics' ? (
            <Card className="p-6 border border-border bg-white shadow-sm space-y-6">
              <h3 className="font-black text-text-primary text-sm uppercase tracking-wider border-b border-border pb-3">Storage Analytics Breakdown</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-light-gray/50 rounded-2xl">
                  <span className="text-[10px] text-text-secondary block font-bold">Total Downloads</span>
                  <span className="text-xl font-black text-text-primary mt-1 block">1,894 times</span>
                </div>
                <div className="p-4 bg-light-gray/50 rounded-2xl">
                  <span className="text-[10px] text-text-secondary block font-bold">Active Collaborators</span>
                  <span className="text-xl font-black text-text-primary mt-1 block">24 users</span>
                </div>
                <div className="p-4 bg-light-gray/50 rounded-2xl">
                  <span className="text-[10px] text-text-secondary block font-bold">Encryption Status</span>
                  <span className="text-xs font-black text-success mt-1 block uppercase tracking-wider">AES-256 Passed</span>
                </div>
              </div>
            </Card>
          ) : activeCategory === 'Recent Activity' ? (
            <Card className="p-6 border border-border bg-white shadow-sm space-y-4">
              <h3 className="font-black text-text-primary text-sm uppercase tracking-wider border-b border-border pb-3">Security & Compliance Logs</h3>
              <div className="space-y-3 text-[11px] font-bold text-text-secondary">
                <div className="flex justify-between items-center p-2.5 bg-light-gray/40 rounded-xl">
                  <span>alex.m@forte.io modified "figma_landing_page_v3.fig"</span>
                  <span className="text-[9px] text-text-secondary font-semibold">20 minutes ago</span>
                </div>
                <div className="flex justify-between items-center p-2.5 bg-light-gray/40 rounded-xl">
                  <span>sarah.j@forte.io downloaded "nexus_database_schema.sql"</span>
                  <span className="text-[9px] text-text-secondary font-semibold">1 hour ago</span>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* Files representations Grid/List/Compact */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredAndSortedFiles.map(file => (
                    <Card 
                      key={file.id}
                      onClick={() => { setSelectedFile(file); setAiAnalysis(null); }}
                      className={cn(
                        "p-5 border bg-white rounded-3xl shadow-sm hover:border-success/30 cursor-pointer transition-all flex flex-col justify-between min-h-[160px]",
                        selectedFile?.id === file.id && "border-success bg-success/5"
                      )}
                    >
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <div className="p-2.5 bg-light-gray rounded-xl text-success">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex gap-1">
                            {file.locked && <Lock className="w-3.5 h-3.5 text-[#e63946]" />}
                          </div>
                        </div>

                        <h4 className="font-bold text-xs text-text-primary truncate">{file.name}</h4>
                        <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mt-0.5">{file.type} • {file.size}</p>
                      </div>

                      <div className="border-t border-border pt-3 mt-4 flex items-center justify-between">
                        <span className="text-[8px] font-black text-text-secondary uppercase tracking-wider">{file.date}</span>
                        <div className="flex gap-2">
                          <button onClick={(e) => { e.stopPropagation(); handleDownload(file.name); }} className="p-1 hover:bg-light-gray rounded text-text-secondary hover:text-success"><Download className="w-4 h-4" /></button>
                          <button onClick={(e) => { e.stopPropagation(); toggleLock(file.id); }} className="p-1 hover:bg-light-gray rounded text-text-secondary hover:text-success"><Lock className="w-4 h-4" /></button>
                          <button onClick={(e) => { e.stopPropagation(); handleDelete(file.id, file.name); }} className="p-1 hover:bg-light-gray rounded text-text-secondary hover:text-[#e63946]"><Trash className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {viewMode === 'list' && (
                <Card className="p-4 border border-border bg-white shadow-sm space-y-2">
                  {filteredAndSortedFiles.map(file => (
                    <div 
                      key={file.id}
                      onClick={() => { setSelectedFile(file); setAiAnalysis(null); }}
                      className={cn(
                        "flex justify-between items-center text-xs p-3 bg-light-gray/30 hover:bg-light-gray/70 rounded-xl cursor-pointer transition-all border border-transparent",
                        selectedFile?.id === file.id && "border-success bg-success/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-success" />
                        <div>
                          <h4 className="font-bold text-text-primary">{file.name}</h4>
                          <p className="text-[8px] font-black text-text-secondary uppercase tracking-wider">{file.size} • {file.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-bold text-text-secondary">{file.date}</span>
                        <button onClick={(e) => { e.stopPropagation(); handleDuplicate(file); }} className="text-text-secondary hover:text-success">Dup</button>
                      </div>
                    </div>
                  ))}
                </Card>
              )}

              {viewMode === 'compact' && (
                <Card className="p-3 border border-border bg-white shadow-sm space-y-1">
                  {filteredAndSortedFiles.map(file => (
                    <div 
                      key={file.id}
                      onClick={() => { setSelectedFile(file); setAiAnalysis(null); }}
                      className={cn(
                        "flex justify-between items-center text-[10px] p-2 hover:bg-light-gray/50 rounded-lg cursor-pointer transition-all",
                        selectedFile?.id === file.id && "bg-success/5 text-success"
                      )}
                    >
                      <span className="font-bold truncate max-w-[200px]">{file.name}</span>
                      <span className="text-text-secondary font-semibold">{file.size}</span>
                    </div>
                  ))}
                </Card>
              )}

              {filteredAndSortedFiles.length === 0 && (
                <div className="text-center py-16 bg-white border border-border rounded-3xl shadow-sm">
                  <Folder className="w-12 h-12 text-text-secondary mx-auto mb-3" />
                  <h4 className="font-black text-text-primary text-base">No assets discovered</h4>
                  <p className="text-xs text-text-secondary mt-1 font-semibold">Upload a new engineering file or adjust filters.</p>
                </div>
              )}
            </>
          )}

        </div>

        {/* Right Side Inspector Drawer Details */}
        <div className="lg:col-span-1">
          {selectedFile ? (
            <Card className="p-5 border border-border bg-white shadow-md space-y-6 text-xs font-bold text-text-secondary animate-in slide-in-from-right-4 duration-200">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h3 className="font-black text-text-primary text-xs uppercase tracking-wider">File Metadata</h3>
                <button onClick={() => setSelectedFile(null)} className="text-text-secondary hover:text-text-primary"><X className="w-4 h-4" /></button>
              </div>

              {/* Version & basic info */}
              <div className="space-y-3">
                <div>
                  <span className="uppercase text-[8px] tracking-wider text-text-primary block">Asset Name</span>
                  <span className="text-text-primary text-xs font-black block truncate mt-0.5">{selectedFile.name}</span>
                </div>

                <div>
                  <span className="uppercase text-[8px] tracking-wider text-text-primary block">Version Audits</span>
                  <span className="text-text-primary text-xs font-black block mt-0.5">{selectedFile.version}</span>
                </div>

                <div>
                  <span className="uppercase text-[8px] tracking-wider text-text-primary block">Description</span>
                  <p className="text-[10px] font-semibold text-text-secondary leading-relaxed mt-1">
                    "{selectedFile.desc}"
                  </p>
                </div>

                <div>
                  <span className="uppercase text-[8px] tracking-wider text-text-primary block">Approval Governance</span>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border mt-1 inline-block",
                    selectedFile.approvalStatus === 'Approved' ? "bg-success/15 text-success border-success/20" : "bg-warning/15 text-warning border-warning/20"
                  )}>
                    {selectedFile.approvalStatus}
                  </span>
                </div>
              </div>

              {/* Actions panel */}
              <div className="border-t border-border pt-4 space-y-2">
                <span className="uppercase text-[8px] tracking-wider text-text-primary block mb-2">Workspace Controls</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" onClick={() => toggleLock(selectedFile.id)} className="w-full text-[10px] py-1.5">
                    {selectedFile.locked ? 'Unlock Asset' : 'Lock Asset'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => requestApproval(selectedFile.id)} className="w-full text-[10px] py-1.5">
                    Request Approval
                  </Button>
                </div>

                <Button 
                  onClick={() => handleDuplicate(selectedFile)}
                  variant="outline" 
                  size="sm" 
                  className="w-full text-[10px] py-1.5 mt-1 bg-white"
                >
                  Duplicate File
                </Button>
              </div>

              {/* Tags Section */}
              <div className="border-t border-border pt-4 space-y-2">
                <span className="uppercase text-[8px] tracking-wider text-text-primary block">Categorization Tags</span>
                <div className="flex flex-wrap gap-1">
                  {selectedFile.tags.map(t => (
                    <span key={t} className="px-2 py-0.5 bg-light-gray text-text-secondary text-[9px] rounded font-black">#{t}</span>
                  ))}
                </div>
                <button 
                  onClick={() => handleAddTag(selectedFile, 'cloud-audited')}
                  className="text-[9px] text-success hover:underline"
                >
                  + Add compliance tag
                </button>
              </div>

              {/* AI OCR summary extract buttons */}
              <div className="border-t border-border pt-4">
                {aiAnalysis ? (
                  <div className="bg-success/5 border border-success/20 rounded-2xl p-4 space-y-2">
                    <h4 className="font-black text-[10px] text-success flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> AI Scan Complete
                    </h4>
                    <p className="text-[9px] font-semibold text-text-secondary leading-relaxed">
                      {aiAnalysis.summary}
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={() => triggerAISummary(selectedFile)}
                    variant="primary" 
                    className="w-full py-2.5 bg-success hover:bg-success/95 font-bold rounded-xl text-xs flex justify-center gap-1.5 border-none"
                    icon={<Sparkles size={14} />}
                  >
                    Initiate AI OCR Summary
                  </Button>
                )}
              </div>

            </Card>
          ) : (
            <Card className="p-6 border border-border bg-light-gray rounded-3xl text-center space-y-2 text-xs font-bold text-text-secondary">
              <Info className="w-8 h-8 text-text-secondary mx-auto" />
              <h4 className="font-black text-text-primary text-xs uppercase tracking-wider">Asset Inspector</h4>
              <p className="text-[10px] font-semibold text-text-secondary leading-relaxed">
                Click on any file card to inspect cloud version history, edit access logs, and generate protected share links.
              </p>
            </Card>
          )}
        </div>

      </div>

      {/* --- UPLOAD NEW ASSET MODAL --- */}
      {activeModal === 'upload' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl relative bg-white border border-border p-6 rounded-3xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-success" />
                Upload New Asset
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-bold text-text-secondary">
              <div>
                <label className="block mb-1.5 uppercase tracking-widest text-[9px]">Select Payout Contract or Deliverable PDF</label>
                <input 
                  type="text" 
                  placeholder="e.g. design_specification.pdf"
                  required
                  className="w-full rounded-xl border border-border bg-light-gray px-3.5 py-2.5 text-xs text-text-primary focus:bg-white focus:border-success outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary" className="bg-success hover:bg-success/95 font-bold rounded-xl text-xs border-none px-4">Upload Secure Document</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* --- CREATE NEW FOLDER MODAL --- */}
      {activeModal === 'create_folder' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl relative bg-white border border-border p-6 rounded-3xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-success" />
                Create New Folder
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleCreateFolder} className="space-y-4 text-xs font-bold text-text-secondary">
              <div>
                <label className="block mb-1.5 uppercase tracking-widest text-[9px]">Folder Title</label>
                <input 
                  type="text" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Brand Assets"
                  required
                  className="w-full rounded-xl border border-border bg-light-gray px-3.5 py-2.5 text-xs text-text-primary focus:bg-white focus:border-success outline-none"
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary" className="bg-success hover:bg-success/95 font-bold rounded-xl text-xs border-none px-4">Create Folder</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}

const UploadCloud = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const XIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

