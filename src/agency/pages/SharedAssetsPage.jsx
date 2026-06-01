import React, { useState } from 'react';
import { 
  Plus, Search, X, FolderOpen, Image as ImageIcon, FileText, Download, ShieldCheck, Tag, Star
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { cn } from '../../admin/utils/cn';

export default function SharedAssetsPage() {
  const [assets, setAssets] = useState([
    { id: 1, name: 'Acme Logo Package (SVG/PNG)', category: 'Logos', size: '8.5 MB', version: 'v2.1', favorite: true },
    { id: 2, name: 'Corporate Presentation Pitch Deck', category: 'Templates', size: '24.2 MB', version: 'v1.4', favorite: true },
    { id: 3, name: 'Typography & Type Scale Guide', category: 'Guidelines', size: '4.1 MB', version: 'v1.0', favorite: false },
    { id: 4, name: 'Stripe Payment Gateway Mockups', category: 'Templates', size: '12.4 MB', version: 'v3.0', favorite: false }
  ]);

  const [activeModal, setActiveModal] = useState(null); // 'add'
  const [searchTerm, setSearchTerm] = useState('');
  
  const [assetForm, setAssetForm] = useState({
    name: '',
    category: 'Logos',
    size: '2.5 MB',
    version: 'v1.0'
  });

  const handleAddAsset = (e) => {
    e.preventDefault();
    if (!assetForm.name.trim()) return;

    const newAsset = {
      id: Date.now(),
      name: assetForm.name.trim(),
      category: assetForm.category,
      size: assetForm.size,
      version: assetForm.version,
      favorite: false
    };

    setAssets([...assets, newAsset]);
    setActiveModal(null);
    toast.success(`Successfully cataloged asset: ${newAsset.name}!`);
  };

  const deleteAsset = (id, name) => {
    setAssets(assets.filter(a => a.id !== id));
    toast.success(`Asset removed: ${name}`);
  };

  const toggleFavorite = (id) => {
    setAssets(assets.map(a => a.id === id ? { ...a, favorite: !a.favorite } : a));
    toast.success('Updated favorite preferences.');
  };

  const handleDownloadSimulate = (name) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 800)),
      {
        loading: `Downloading ${name}...`,
        success: `${name} downloaded successfully! 📁`,
        error: 'Download failed.'
      }
    );
  };

  const filteredAssets = assets.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <FolderOpen className="w-8 h-8 text-success" />
            Brand Assets Directory
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Access, download, and catalog approved corporate logo packages, font parameters, and design guidelines.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus size={18} />}
          onClick={() => setActiveModal('add')}
        >
          Add Brand Asset
        </Button>
      </div>

      <div className="mb-6 max-w-xs">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -tranzinc-y-1/2 text-text-secondary" />
          <input 
            type="text" 
            placeholder="Search assets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-border rounded-xl bg-light-gray/40 text-sm focus:outline-none focus:border-success text-text-primary"
          />
        </div>
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAssets.map((asset) => (
          <Card key={asset.id} className="bg-white border border-border rounded-3xl p-6 shadow-md hover:shadow-lg transition-all relative flex flex-col justify-between min-h-[220px] group">
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-success/10 text-success border-success/20">
                  {asset.category}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => toggleFavorite(asset.id)} className="p-1 text-text-secondary hover:text-amber-500">
                    <Star size={16} className={cn(asset.favorite && "fill-amber-500 text-amber-500")} />
                  </button>
                  <button onClick={() => deleteAsset(asset.id, asset.name)} className="p-1 text-text-secondary hover:text-[#e63946]">
                    <X size={16} />
                  </button>
                </div>
              </div>

              <h3 className="font-black text-sm text-text-primary mb-2 line-clamp-2">{asset.name}</h3>
              
              <div className="flex items-center gap-2 mt-4 text-xs font-bold text-text-secondary">
                <Tag size={12} />
                <span>Version: {asset.version}</span>
                <span>•</span>
                <span>{asset.size}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex justify-end">
              <button 
                onClick={() => handleDownloadSimulate(asset.name)}
                className="flex items-center gap-1 px-4 py-2 bg-light-gray/60 hover:bg-success hover:text-white text-text-primary rounded-xl text-xs font-black transition-all shadow-sm"
              >
                <Download size={14} /> Download Asset
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* --- ADD ASSET MODAL --- */}
      {activeModal === 'add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <Card className="w-full max-w-md shadow-2xl relative bg-white border border-border p-6 rounded-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-4 border-b border-border pb-3">
              <h3 className="text-lg font-black text-text-primary flex items-center gap-2">
                <Plus className="w-5 h-5 text-success" />
                Catalog Brand Asset
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-1.5 hover:bg-light-gray rounded-md transition-colors text-text-secondary"><X size={18} /></button>
            </div>
            
            <form onSubmit={handleAddAsset} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Asset Name</label>
                <input 
                  type="text" 
                  value={assetForm.name} 
                  onChange={(e) => setAssetForm({ ...assetForm, name: e.target.value })} 
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-sm text-text-primary"
                  placeholder="e.g. Acme Branding Kit"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Category</label>
                  <select
                    value={assetForm.category}
                    onChange={(e) => setAssetForm({ ...assetForm, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-xs font-black text-text-primary appearance-none"
                  >
                    <option value="Logos">Logos</option>
                    <option value="Guidelines">Guidelines</option>
                    <option value="Templates">Templates</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">Version</label>
                  <input 
                    type="text" 
                    value={assetForm.version} 
                    onChange={(e) => setAssetForm({ ...assetForm, version: e.target.value })} 
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-xs font-black text-text-primary"
                    placeholder="e.g. v1.0"
                    required
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-black uppercase text-text-secondary tracking-widest mb-1">File Size</label>
                  <input 
                    type="text" 
                    value={assetForm.size} 
                    onChange={(e) => setAssetForm({ ...assetForm, size: e.target.value })} 
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-light-gray focus:outline-none focus:border-success text-xs font-black text-text-primary"
                    placeholder="e.g. 4.8 MB"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-border mt-6">
                <Button type="button" variant="outline" onClick={() => setActiveModal(null)}>Cancel</Button>
                <Button type="submit" variant="primary">Catalog Asset</Button>
              </div>
            </form>
          </Card>
        </div>
      )}

    </div>
  );
}
