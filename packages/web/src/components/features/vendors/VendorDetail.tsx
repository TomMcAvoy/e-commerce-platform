'use client';

import { Vendor } from '@shoppingcart/shared/src/types/models/Vendor';
import Image from 'next/image';
import { MapPin, Phone, Mail, Globe, Star, Shield, Award } from 'lucide-react';
import { Badge } from '../../ui/Badge';

interface VendorDetailProps {
  vendor: Vendor;
}

/**
 * Vendor detail component
 */
export default function VendorDetail({ vendor }: VendorDetailProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Vendor header */}
      <div className="relative h-48 bg-gradient-to-r from-blue-500 to-indigo-600">
        {/* Vendor logo */}
        <div className="absolute -bottom-16 left-8">
          <div className="h-32 w-32 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center overflow-hidden">
            {/* If vendor has a logo, display it */}
            {vendor.logo ? (
              <Image 
                src={vendor.logo} 
                alt={vendor.businessName} 
                width={128} 
                height={128} 
                className="object-cover"
              />
            ) : (
              <div className="text-3xl font-bold text-gray-400">
                {vendor.businessName.charAt(0)}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Vendor info */}
      <div className="pt-20 px-8 pb-8">
        <div className="flex flex-wrap justify-between items-start">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">{vendor.businessName}</h1>
            
            <div className="flex items-center mt-2">
              {/* Vendor rating */}
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${
                      i < Math.floor(vendor.rating) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
                <span className="ml-2 text-gray-600">{vendor.rating.toFixed(1)}</span>
              </div>
              
              {/* Verification badge */}
              {vendor.isVerified && (
                <Badge className="ml-4 bg-green-100 text-green-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
          
          {/* Vendor stats */}
          <div className="flex flex-wrap gap-4">
            <div className="text-center px-4 py-2 bg-gray-50 rounded-md">
              <div className="text-2xl font-bold text-gray-900">{vendor.productCount || 0}</div>
              <div className="text-sm text-gray-500">Products</div>
            </div>
            
            <div className="text-center px-4 py-2 bg-gray-50 rounded-md">
              <div className="text-2xl font-bold text-gray-900">{vendor.totalSales}</div>
              <div className="text-sm text-gray-500">Sales</div>
            </div>
          </div>
        </div>
        
        {/* Contact information */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400 mr-3" />
                <span>{vendor.businessEmail}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <span>{vendor.businessPhone}</span>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                <div>
                  <p>{vendor.businessAddress.address1}</p>
                  {vendor.businessAddress.address2 && <p>{vendor.businessAddress.address2}</p>}
                  <p>
                    {vendor.businessAddress.city}, {vendor.businessAddress.state} {vendor.businessAddress.postalCode}
                  </p>
                  <p>{vendor.businessAddress.country}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Business information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <Award className="h-5 w-5 text-gray-400 mr-3" />
                <span>
                  {vendor.isVerified ? 'Verified Business' : 'Verification Pending'}
                </span>
              </div>
              
              {vendor.website && (
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-gray-400 mr-3" />
                  <a 
                    href={vendor.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {vendor.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}