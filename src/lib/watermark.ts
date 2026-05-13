/**
 * Adds a watermark logo to an image file.
 * @param file The original image file
 * @param logoSrc Path to the watermark logo
 * @returns A new File object with the watermark applied
 */
export async function addWatermark(file: File, logoSrc: string = '/watermark-logo.png'): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Gagal memuat gambar asli'));
      img.onload = () => {
        const logo = new Image();
        logo.onerror = () => reject(new Error('Gagal memuat logo watermark'));
        logo.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Gagal mendapatkan canvas context'));

          // Set canvas dimensions to match image
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw main image
          ctx.drawImage(img, 0, 0);

          // Calculate watermark size (e.g., 25% of image width, with a minimum size)
          const watermarkWidth = Math.max(img.width * 0.25, 100);
          const watermarkHeight = (logo.height / logo.width) * watermarkWidth;

          // Set opacity for the watermark
          ctx.globalAlpha = 0.4;

          // Draw logo in the center
          const x = (img.width - watermarkWidth) / 2;
          const y = (img.height - watermarkHeight) / 2;

          // Alternatively, draw it multiple times or at the bottom corner
          // Let's do a central one for now
          ctx.drawImage(logo, x, y, watermarkWidth, watermarkHeight);

          // Reset alpha
          ctx.globalAlpha = 1.0;

          // Convert back to file
          canvas.toBlob(
            (blob) => {
              if (!blob) return reject(new Error('Gagal membuat blob gambar'));
              const watermarkedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(watermarkedFile);
            },
            file.type,
            0.9 // Quality
          );
        };
        logo.src = logoSrc;
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal membaca file'));
    reader.readAsDataURL(file);
  });
}
