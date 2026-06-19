import React, { useState } from 'react';
import Card from '../../../platform/components/common/Card';
import Button from '../../../platform/components/common/Button';
import { 
  Upload, Cloud, X, FileText, CheckCircle2, AlertCircle, RefreshCw, Trash2
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { cn } from '../../../admin/utils/cn';
import { useAgencyUploadCenter } from '../services/agencyHooks';

export default function UploadCenterPage() {
  const { data: response, isLoading } = useAgencyUploadCenter();
  const queueData = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
  
  const fallbackQueue = [
    { id: 1, name: 'api_endpoints_documentation.pdf', size: '4.8 MB', progress: 100, status: 'Completed' },
    { id: 2, name: 'database_migration_v2.sql', size: '1.2 MB', progress: 45, status: 'Uploading' },
    { id: 3, name: 'production_deployment_logs.txt', size: '8.4 MB', progress: 0, status: 'Pending' }
  ];

  const initialQueue = queueData.length > 0 ? queueData : fallbackQueue;
  const [queue, setQueue] = useState(initialQueue);

  const [dragOver, setDragOver] = useState(false);

  const simulateBatchUpload = () => {
    toast.promise(
      new Promise((resolve) => {
        let prog = 45;
        const interval = setInterval(() => {
          prog = Math.min(prog + 15, 100);
          setQueue(q => q.map(item => {
            if (item.id === 2) {
              return { ...item, progress: prog, status: prog === 100 ? 'Completed' : 'Uploading' };
            }
            if (item.id === 3 && prog > 60) {
              const pendingProg = Math.min((prog - 60) * 2.5, 100);
              return { ...item, progress: Math.round(pendingProg), status: pendingProg === 100 ? 'Completed' : 'Uploading' };
            }
            return item;
          }));

          if (prog === 100) {
            clearInterval(interval);
            setTimeout(resolve, 800);
          }
        }, 300);
      }),
      {
        loading: 'Uploading queued deliverables to agency server...',
        success: 'Batch file upload successfully completed! 🚀',
        error: 'Upload aborted.'
      }
    );
  };

  const handleDrag = (e, state) => {
    e.preventDefault();
    setDragOver(state);
  };

  const handleDropSimulate = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const newFile = {
      id: Date.now(),
      name: 'dropped_mock_asset.png',
      size: '3.4 MB',
      progress: 0,
      status: 'Pending'
    };

    setQueue([...queue, newFile]);
    toast.success('Asset successfully queued for upload!');
  };

  const removeQueueItem = (id, name) => {
    setQueue(queue.filter(item => item.id !== id));
    toast.success(`Removed from queue: ${name}`);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans animate-in slide-in-from-bottom-4 duration-500 relative">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
            <Upload className="w-8 h-8 text-success" />
            Upload Center
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Batch-upload assets, deliverables, and specifications to the shared project directories.
          </p>
        </div>
        <Button 
          variant="primary" 
          icon={<RefreshCw size={18} />}
          onClick={simulateBatchUpload}
          disabled={!queue.some(i => i.status !== 'Completed')}
        >
          Process Queue
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns: Upload Zone */}
        <div className="lg:col-span-1 space-y-6">
          <Card 
            onDragOver={(e) => handleDrag(e, true)}
            onDragLeave={(e) => handleDrag(e, false)}
            onDrop={handleDropSimulate}
            className={cn(
              "border-2 border-dashed rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px] cursor-pointer transition-all bg-white",
              dragOver ? "border-success bg-success/5 scale-[1.01]" : "border-border hover:border-success/60"
            )}
          >
            <Cloud className={cn("w-16 h-16 mb-4 animate-bounce", dragOver ? "text-success" : "text-text-secondary")} />
            <h3 className="font-black text-text-primary text-base">Drag & Drop Files Here</h3>
            <p className="text-xs text-text-secondary mt-2 max-w-[200px] leading-relaxed">
              Supports PDF, PNG, JPG, ZIP, and SQL scripts up to 500MB per file.
            </p>
            <button className="mt-6 px-5 py-2.5 bg-success/10 text-success font-black rounded-xl text-xs hover:bg-success hover:text-white transition-all shadow-sm">
              Browse Files
            </button>
          </Card>
        </div>

        {/* Right Columns: Active Batch Queue */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white border border-border p-6 rounded-2xl shadow-md">
            <h3 className="text-base font-black text-text-primary mb-6 border-b border-border pb-3 flex justify-between items-center">
              <span>Active Batch Queue ({queue.length})</span>
            </h3>

            <div className="space-y-4">
              {queue.map((item) => (
                <div key={item.id} className="p-4 border border-border/80 rounded-2xl bg-light-gray/25 hover:bg-white hover:shadow-sm transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-success/10 text-success rounded-xl shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-text-primary line-clamp-1">{item.name}</h4>
                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-wider">{item.size} • {item.status}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto self-end sm:self-center">
                    {/* Progress indicator */}
                    <div className="flex-1 sm:w-28 space-y-1">
                      <div className="flex justify-between text-[10px] font-black text-text-secondary uppercase tracking-widest">
                        <span>Speed: 3.4 MB/s</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-light-gray rounded-full h-1.5 overflow-hidden border border-border">
                        <div className="h-full bg-success rounded-full transition-all" style={{ width: `${item.progress}%` }}></div>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeQueueItem(item.id, item.name)}
                      className="p-2 text-text-secondary hover:text-[#e63946] hover:bg-light-gray rounded-xl transition-all"
                      title="Remove Deliverable"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {queue.length === 0 && (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-3 animate-pulse" />
                  <h4 className="font-bold text-text-primary">All uploads processed</h4>
                  <p className="text-xs text-text-secondary mt-1">Drag new assets on the left to initialize uploads.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
