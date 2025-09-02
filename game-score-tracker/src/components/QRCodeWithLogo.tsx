'use client';

import React, { useRef } from 'react';
import QRCode from 'react-qr-code';
import { Button } from './ui/button';
import { Download, Share2, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import Image from 'next/image';

interface QRCodeWithLogoProps {
  url?: string;
  size?: number;
  className?: string;
}

const QRCodeWithLogo: React.FC<QRCodeWithLogoProps> = ({
  url = 'https://scoretracker.vishalthimmaiah.com',
  size = 200,
  className = ''
}) => {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = async () => {
    if (!qrRef.current) return;

    try {
      // Create a canvas to combine QR code and logo
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const qrSize = size;
      const logoSize = 24;
      canvas.width = qrSize;
      canvas.height = qrSize;

      // Get the SVG element
      const svgElement = qrRef.current.querySelector('svg');
      if (!svgElement) return;

      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const qrImage = new window.Image();
      qrImage.onload = () => {
        // Draw QR code
        ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

        // Create white background for logo
        const logoX = (qrSize - logoSize) / 2;
        const logoY = (qrSize - logoSize) / 2;
        const padding = 16;
        const circleRadius = (logoSize + padding) / 2;

        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(qrSize / 2, qrSize / 2, circleRadius, 0, 2 * Math.PI);
        ctx.fill();

        // Add border
        ctx.strokeStyle = '#E5E7EB';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Load and draw logo
        const logo = new window.Image();
        logo.crossOrigin = 'anonymous';
        logo.onload = () => {
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

          // Download the final image
          canvas.toBlob((blob) => {
            if (blob) {
              const link = document.createElement('a');
              link.download = 'game-score-tracker-qr.png';
              link.href = URL.createObjectURL(blob);
              link.click();
              URL.revokeObjectURL(link.href);
            }
          });
        };
        logo.src = '/logo.png';
        URL.revokeObjectURL(svgUrl);
      };
      qrImage.src = svgUrl;
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try again.');
    }
  };

  const shareQRCode = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Game Score Tracker',
          text: 'Scan this QR code to access the Game Score Tracker app!',
          url: url
        });
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(url);
        alert('App URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Share failed:', error);
      // Final fallback
      try {
        await navigator.clipboard.writeText(url);
        alert('App URL copied to clipboard!');
      } catch {
        alert(`Share the app: ${url}`);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <QrCode className="h-4 w-4" />
          QR Code
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Game Score Tracker</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-6">
          <div className={`relative bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border dark:border-gray-700 ${className}`}>
            <div ref={qrRef} className="relative">
              <QRCode
                value={url}
                size={size}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 ${size} ${size}`}
                level="H"
              />
              {/* Logo overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-sm border border-gray-200 dark:border-gray-600">
                  <Image
                    src="/logo.png"
                    alt="Logo"
                    width={28}
                    height={28}
                    className="w-7 h-7"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Scan this QR code to open the Game Score Tracker app in your browser
          </p>
          
          <div className="flex gap-2 w-full">
            <Button onClick={downloadQRCode} variant="outline" className="flex-1 gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button onClick={shareQRCode} variant="outline" className="flex-1 gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center break-all">
            {url}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeWithLogo;
