'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ProductImagesProps {
  images: string[];
  productName: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({ images = [], productName }) => {
  const [mainImage, setMainImage] = useState(images[0] || '/placeholder.png');

  if (!images || images.length === 0) {
    return (
      <div>
        <Image
          src="/placeholder.png"
          alt="No product image available"
          width={500}
          height={500}
          style={{ objectFit: 'cover', borderRadius: '8px' }}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ position: 'relative', width: '100%', paddingTop: '100%', border: '1px solid #eee', borderRadius: '8px' }}>
        <Image
          src={mainImage}
          alt={`Main image for ${productName}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: 'contain', borderRadius: '8px' }}
          priority // The main image is important for LCP
        />
      </div>
      {images.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setMainImage(image)}
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                cursor: 'pointer',
                border: mainImage === image ? '2px solid #0070f3' : '1px solid #ccc',
                borderRadius: '4px',
                overflow: 'hidden'
              }}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1} for ${productName}`}
                fill
                sizes="80px"
                style={{ objectFit: 'cover' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;