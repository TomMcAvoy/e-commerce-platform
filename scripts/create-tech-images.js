const fs = require('fs');
const path = require('path');

// Create tech-inspired image URLs from Unsplash
const TECH_IMAGES = [
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop', // Circuit board
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop', // Abstract tech
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop', // Digital network
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop', // Geometric patterns
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop', // Cyber security
  'https://images.unsplash.com/photo-1563206767-5b18f218e8de?w=800&h=600&fit=crop', // Data visualization
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop', // Tech background
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop'  // Computer code
];

function createTechImagesConfig() {
  const imagesDir = path.join(__dirname, '../frontend/public/tech-images');
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  const imageConfig = TECH_IMAGES.map((url, index) => ({
    id: index + 1,
    url,
    alt: `Technology background ${index + 1}`,
    section: ['hero', 'services', 'technology', 'contact'][index % 4]
  }));
  
  fs.writeFileSync(
    path.join(imagesDir, 'config.json'),
    JSON.stringify(imageConfig, null, 2)
  );
  
  console.log('✅ Tech images configuration created');
  console.log(`📁 Location: frontend/public/tech-images/config.json`);
  console.log(`🖼️  ${imageConfig.length} tech images configured`);
}

createTechImagesConfig();