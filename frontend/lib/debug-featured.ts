export async function debugFeaturedProducts() {
  try {
    const categoriesResponse = await fetch('http://localhost:3000/api/categories');
    const categories = await categoriesResponse.json();
    
    const featuredResponse = await fetch('http://localhost:3000/api/products?featured=true&category=alarm-systems');
    const featuredProducts = await featuredResponse.json();
    
    const allAlarmResponse = await fetch('http://localhost:3000/api/products?category=alarm-systems');
    const allAlarmProducts = await allAlarmResponse.json();
    
    console.log('Categories:', categories);
    console.log('Featured Alarm Products:', featuredProducts);
    console.log('All Alarm Products:', allAlarmProducts);
    
    return { categories, featuredProducts, allAlarmProducts };
  } catch (error) {
    console.error('Debug API Error:', error);
    return null;
  }
}
