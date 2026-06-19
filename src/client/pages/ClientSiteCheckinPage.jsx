import React, { useState } from 'react';
import { 
  QrCode, Camera, MapPin, CheckCircle, 
  Upload, Terminal, Navigation, AlertTriangle 
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import Card from '../../platform/components/common/Card';
import Button from '../../platform/components/common/Button';

export default function ClientSiteCheckinPage() {
  const [scanned, setScanned] = useState(false);
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);

  const triggerQrSim = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Scanning site-encoded QR Badge...',
        success: () => {
          setScanned(true);
          return 'QR Code verified! Matching site ID: LOC-9892. ✅';
        },
        error: 'Scan failed.'
      }
    );
  };

  const verifyGps = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1200)),
      {
        loading: 'Interrogating mobile device GPS coordinates...',
        success: () => {
          setGpsVerified(true);
          return 'Geo-coordinates match site centroid (± 4 meters)! 📍';
        },
        error: 'Geo-coordinates verification failed.'
      }
    );
  };

  const uploadPhoto = () => {
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Analyzing image metadata and EXIF payload...',
        success: () => {
          setPhotoUploaded(true);
          return 'Image EXIF location match confirmed! Photo approved. 📸';
        },
        error: 'EXIF parsing failed.'
      }
    );
  };

  const handleSubmit = () => {
    if (!scanned || !photoUploaded || !gpsVerified) {
      toast.error('Please complete all three verification checkmarks.');
      return;
    }

    toast.success('Site Check-In authenticated! Working hours active.');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 font-sans text-white">
      <Toaster position="top-right" />

      {/* Title */}
      <div className="border-b border-white/5 pb-6 mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-black tracking-tight">Onsite Check-In Terminal</h1>
        <p className="text-xs font-semibold text-light-gray/50 mt-1">Simulate photographic proof-of-presence, localized GPS authentication, and secure QR badge scanning.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Step 1: QR Badge Scanning */}
        <Card className={`p-6 border rounded-3xl flex flex-col justify-between items-center text-center ${
          scanned ? 'border-success/30 bg-success/5' : 'border-white/10 bg-white/5'
        }`}>
          <div className="space-y-4">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
              scanned ? 'bg-success/20 text-success' : 'bg-success/20 text-success'
            }`}>
              <QrCode className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-black">1. Site QR Badge Code</h3>
              <p className="text-[10px] text-light-gray/50 font-semibold mt-1">Scan physical site QR code located at entrance gates.</p>
            </div>
          </div>

          <Button 
            onClick={triggerQrSim}
            disabled={scanned}
            className={`w-full mt-6 border-none font-bold text-xs py-2 rounded-xl ${
              scanned ? 'bg-success/20 text-success' : 'bg-success hover:bg-success/90'
            }`}
          >
            {scanned ? 'QR Code Authenticated' : 'Simulate Badge Scan'}
          </Button>
        </Card>

        {/* Step 2: GPS coordinate verification */}
        <Card className={`p-6 border rounded-3xl flex flex-col justify-between items-center text-center ${
          gpsVerified ? 'border-success/30 bg-success/5' : 'border-white/10 bg-white/5'
        }`}>
          <div className="space-y-4">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
              gpsVerified ? 'bg-success/20 text-success' : 'bg-success/20 text-success'
            }`}>
              <MapPin className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-black">2. Localized GPS Position</h3>
              <p className="text-[10px] text-light-gray/50 font-semibold mt-1">Validate mobile location against assigned site boundaries.</p>
            </div>
          </div>

          <Button 
            onClick={verifyGps}
            disabled={gpsVerified}
            className={`w-full mt-6 border-none font-bold text-xs py-2 rounded-xl ${
              gpsVerified ? 'bg-success/20 text-success' : 'bg-success hover:bg-success/90'
            }`}
          >
            {gpsVerified ? 'GPS Location Valid' : 'Verify GPS Coordinates'}
          </Button>
        </Card>

        {/* Step 3: Photo validation */}
        <Card className={`p-6 border rounded-3xl flex flex-col justify-between items-center text-center ${
          photoUploaded ? 'border-success/30 bg-success/5' : 'border-white/10 bg-white/5'
        }`}>
          <div className="space-y-4">
            <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center ${
              photoUploaded ? 'bg-success/20 text-success' : 'bg-success/20 text-success'
            }`}>
              <Camera className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-sm font-black">3. Photographic Proof</h3>
              <p className="text-[10px] text-light-gray/50 font-semibold mt-1">Capture selfie or site entry photo with geo-tagged EXIF.</p>
            </div>
          </div>

          <Button 
            onClick={uploadPhoto}
            disabled={photoUploaded}
            className={`w-full mt-6 border-none font-bold text-xs py-2 rounded-xl ${
              photoUploaded ? 'bg-success/20 text-success' : 'bg-success hover:bg-success/90'
            }`}
          >
            {photoUploaded ? 'EXIF Tag Valid' : 'Simulate Photo Upload'}
          </Button>
        </Card>

      </div>

      <div className="mt-8 flex justify-center">
        <Button 
          onClick={handleSubmit}
          className="bg-success hover:bg-success/90 border-none font-bold text-sm py-3.5 px-12 rounded-2xl flex items-center gap-2 shadow-lg shadow-[#4C1D95]/15"
        >
          <CheckCircle className="w-5 h-5" /> Authenticate Site Entry
        </Button>
      </div>
    </div>
  );
}


