import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getVendorBySlug, getVendorProducts } from '../../../services/vendorService';
import VendorDetail from '../../../components/features/vendors/VendorDetail';
import ProductGrid from '../../../components/features/products/ProductGrid';

// Define page props
interface VendorPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the page
export async function generateMetadata({ params }: VendorPageProps): Promise<Metadata> {
  const vendor = await getVendorBySlug(params.slug);
  
  if (!vendor) {
    return {
      title: 'Vendor Not Found',
      description: 'The requested vendor could not be found.'
    };
  }
  
  return {
    title: vendor.businessName,
    description: `Shop products from ${vendor.businessName} on our marketplace.`,
    openGraph: {
      title: vendor.businessName,
      description: `Shop products from ${vendor.businessName} on our marketplace.`,
      type: 'website',
    }
  };
}

/**
 * Vendor detail page
 */
export default async function VendorPage({ params }: VendorPageProps) {
  const { slug } = params;
  
  // Fetch vendor data
  const vendor = await getVendorBySlug(slug);
  
  // If vendor not found, show 404 page
  if (!vendor) {
    notFound();
  }
  
  // Fetch vendor products
  const products = await getVendorProducts(vendor._id);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Vendor details */}
      <VendorDetail vendor={vendor} />
      
      {/* Vendor products */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Products from {vendor.businessName}</h2>
        
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-gray-500">No products available from this vendor yet.</p>
        )}
      </div>
    </div>
  );
}