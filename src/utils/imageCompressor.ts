/**
 * Compresses images for rural artisans on low bandwidth / 2G/3G connections.
 * - Resizes longest edge to max 1600px maintaining aspect ratio
 * - Compresses JPEG output until size is under 500KB
 * - Returns detailed metrics (original size, compressed size, dimensions)
 */

export interface CompressionResult {
  dataUrl: string;
  originalSizeBytes: number;
  compressedSizeBytes: number;
  originalDimensions: { width: number; height: number };
  compressedDimensions: { width: number; height: number };
  compressionRatioPercent: number;
  isUnder500KB: boolean;
}

export async function compressAndResizeImage(
  fileOrDataUrl: File | string,
  onProgress?: (percent: number, statusText: string) => void
): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    onProgress?.(10, 'Loading image...');

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      onProgress?.(30, 'Calculating dimensions...');
      let { width, height } = img;
      const originalDimensions = { width, height };

      // Max 1600px on the longest edge
      const MAX_EDGE = 1600;
      if (width > MAX_EDGE || height > MAX_EDGE) {
        if (width > height) {
          height = Math.round((height * MAX_EDGE) / width);
          width = MAX_EDGE;
        } else {
          width = Math.round((width * MAX_EDGE) / height);
          height = MAX_EDGE;
        }
      }

      onProgress?.(50, 'Optimizing for rural network (<500KB)...');
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context could not be created'));
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 1, width, height);

      // Iteratively find quality that fits under 500KB (500 * 1024 bytes = 512,000)
      const MAX_BYTES = 500 * 1024;
      let quality = 0.85;
      let dataUrl = canvas.toDataURL('image/jpeg', quality);

      // Estimate byte length from dataUrl base64 string
      const getByteLength = (str: string) => Math.round((str.length * 3) / 4);
      let byteLength = getByteLength(dataUrl);

      onProgress?.(70, 'Compressing under 500KB...');
      while (byteLength > MAX_BYTES && quality > 0.4) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        byteLength = getByteLength(dataUrl);
      }

      const originalEstimatedBytes =
        fileOrDataUrl instanceof File
          ? fileOrDataUrl.size
          : Math.round(originalDimensions.width * originalDimensions.height * 1.5);

      const ratio = Math.max(
        0,
        Math.round(((originalEstimatedBytes - byteLength) / originalEstimatedBytes) * 100)
      );

      onProgress?.(100, 'Optimized & Ready');

      resolve({
        dataUrl,
        originalSizeBytes: originalEstimatedBytes,
        compressedSizeBytes: byteLength,
        originalDimensions,
        compressedDimensions: { width, height },
        compressionRatioPercent: ratio,
        isUnder500KB: byteLength <= MAX_BYTES,
      });
    };

    img.onerror = (err) => {
      reject(err);
    };

    if (fileOrDataUrl instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(fileOrDataUrl);
    } else {
      img.src = fileOrDataUrl;
    }
  });
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}
