/**
 * Cloudinary Media Service
 * Handles image uploads with a built-in Mock Mode for local development.
 * 
 * In Mock Mode:
 * - No network requests are made to Cloudinary.
 * - Files are converted to local Object URLs for immediate preview.
 * - Simulates network latency for realistic UX testing.
 */

const IS_MOCK = process.env.REACT_APP_CLOUDINARY_MOCK === 'true' || !process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

/**
 * Uploads a file to Cloudinary or returns a mock URL.
 * @param {File} file - The file object to upload.
 * @param {Object} options - Additional Cloudinary options (folder, tags, etc.)
 * @returns {Promise<Object>} - The upload result containing the URL.
 */
export const uploadImage = async (file, options = {}) => {
  if (IS_MOCK) {
    return mockUpload(file);
  }

  return realUpload(file, options);
};

/**
 * Simulates a Cloudinary upload by returning a local preview URL.
 */
const mockUpload = (file) => {
  return new Promise((resolve, reject) => {
    console.warn('☁️ [Cloudinary Mock] Uploading file:', file.name);
    
    // Simulate network delay
    setTimeout(() => {
      if (!file) {
        reject(new Error('No file provided'));
        return;
      }

      // Create a local URL for the file
      const mockUrl = URL.createObjectURL(file);
      
      resolve({
        url: mockUrl,
        secure_url: mockUrl,
        public_id: `mock_${Math.random().toString(36).substring(7)}`,
        format: file.type.split('/')[1],
        resource_type: 'image',
        created_at: new Date().toISOString(),
        bytes: file.size,
        width: 800,
        height: 600,
        is_mock: true
      });
    }, 1200); // Realistic latency
  });
};

/**
 * Actual Cloudinary upload implementation.
 */
const realUpload = async (file, options) => {
  const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing in environment variables.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  
  if (options.folder) formData.append('folder', options.folder);
  if (options.tags) formData.append('tags', options.tags);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Upload failed');
  }

  return response.json();
};

/**
 * Helper to delete local mock URLs to prevent memory leaks.
 */
export const revokeMockUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
