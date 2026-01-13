import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { SiteInspectionModal } from '../components/SiteInspectionModal';
import { 
  MapPin, 
  Star, 
  Award, 
  Shield, 
  CheckCircle, 
  ArrowLeft, 
  ExternalLink,
  Users,
  Briefcase,
  Calendar,
  Share2
} from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  date: string;
  image: string;
}

interface VendorData {
  id: string;
  name: string;
  location: string;
  rating: number;
  experience: string;
  yearsInBusiness: number;
  foundedYear: number;
  image: string;
  verified: boolean;
  recommended?: boolean;
  badges: string[];
  reviewCount?: number;
  about: string;
  category: string;
  languages: string[];
  services: string[];
  portfolio: PortfolioItem[];
  pricePerSqft: string;
  trustedByCount: number;
  homeownersServed: number;
  projectsFinished: number;
  certifications: string[];
}

const vendorsData: VendorData[] = [
  {
    id: '1',
    name: 'Apex Construction Ltd.',
    location: 'Hyderabad',
    rating: 4.5,
    experience: '12+ Years Experience',
    yearsInBusiness: 12,
    foundedYear: 2014,
    image: 'https://images.unsplash.com/photo-1765648580890-732fa6d769c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBjb250cmFjdG9yJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzY3NzYyOTU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
    badges: ['GST Verified', 'Approved'],
    reviewCount: 127,
    about: 'Apex Construction Ltd. is a premier construction company specializing in residential and commercial projects. With over 12 years of experience in the industry, we have successfully delivered hundreds of projects across Hyderabad.',
    category: 'Construction & Interior Design',
    languages: ['Telugu', 'Hindi', 'English'],
    services: [
      'Electrical Wiring',
      'Painting',
      'Modular Kitchen',
      'Bathroom Remodeling',
      'Custom Furniture',
      'Full Home Renovation'
    ],
    portfolio: [
      {
        id: '1',
        title: '3BHK Villa Construction',
        date: 'Dec 2023',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'
      },
      {
        id: '2',
        title: '2BHK Full Renovation',
        date: 'Sep 2023',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'
      },
      {
        id: '3',
        title: 'Modern Kitchen Design',
        date: 'Jul 2023',
        image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=400'
      }
    ],
    pricePerSqft: '1,200',
    trustedByCount: 500,
    homeownersServed: 450,
    projectsFinished: 320,
    certifications: ['GSTIN Verified', 'Certified Builder', 'ISO 9001:2015']
  },
  {
    id: '2',
    name: 'BuildRight Solutions',
    location: 'Bangalore',
    rating: 4.8,
    experience: '10+ Years Experience',
    yearsInBusiness: 10,
    foundedYear: 2016,
    image: 'https://images.unsplash.com/photo-1626885930974-4b69aa21bbf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBtYW5hZ2VyfGVufDF8fHx8MTc2NzY4ODQ2Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
    recommended: true,
    badges: ['GST Verified', 'CZ Approved'],
    reviewCount: 203,
    about: 'BuildRight Solutions is a trusted name in construction and project management. Serving clients across Bangalore for over a decade, we pride ourselves on innovative design solutions and sustainable building practices.',
    category: 'Residential Construction',
    languages: ['Kannada', 'Hindi', 'English'],
    services: [
      'Electrical Wiring',
      'Painting',
      'Modular Kitchen',
      'Bathroom Remodeling',
      'Custom Furniture',
      'Full Home Renovation'
    ],
    portfolio: [
      {
        id: '1',
        title: 'Luxury Villa Project',
        date: 'Jan 2024',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'
      },
      {
        id: '2',
        title: '4BHK Apartment',
        date: 'Nov 2023',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400'
      },
      {
        id: '3',
        title: 'Office Interior',
        date: 'Aug 2023',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
      }
    ],
    pricePerSqft: '1,450',
    trustedByCount: 800,
    homeownersServed: 720,
    projectsFinished: 485,
    certifications: ['GSTIN Verified', 'Certified Contractor', 'Green Building Certified']
  },
  {
    id: '3',
    name: 'Urban Infra Group',
    location: 'Hyderabad',
    rating: 4.5,
    experience: '8+ Years Experience',
    yearsInBusiness: 8,
    foundedYear: 2018,
    image: 'https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2NzcxODk1Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    verified: true,
    badges: ['GST Verified', 'CZ Approved'],
    reviewCount: 94,
    about: 'Urban Infra Group is a rapidly growing construction company focused on delivering modern infrastructure solutions. We specialize in residential construction, renovations, and interior projects.',
    category: 'Construction & Renovation',
    languages: ['Telugu', 'Hindi', 'English'],
    services: [
      'Electrical Wiring',
      'Painting',
      'Modular Kitchen',
      'Bathroom Remodeling',
      'Custom Furniture',
      'Full Home Renovation'
    ],
    portfolio: [
      {
        id: '1',
        title: 'Modern Apartment',
        date: 'Oct 2023',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400'
      },
      {
        id: '2',
        title: 'Kitchen Renovation',
        date: 'Aug 2023',
        image: 'https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=400'
      },
      {
        id: '3',
        title: 'Living Room Design',
        date: 'Jun 2023',
        image: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400'
      }
    ],
    pricePerSqft: '1,100',
    trustedByCount: 350,
    homeownersServed: 280,
    projectsFinished: 210,
    certifications: ['GSTIN Verified', 'Certified Electrician', 'Safety Certified']
  },
];

export function VendorProfile() {
  const { vendorId } = useParams<{ vendorId: string }>();
  const navigate = useNavigate();

  // Find vendor by ID
  const vendor = vendorsData.find((v) => v.id === vendorId);

  // If vendor not found, show error
  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Vendor Not Found</h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:underline"
          >
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  // Reusable Pricing CTA Card Component
  const PricingCTACard = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <div className="text-center mb-4">
        <p className="text-gray-600 text-sm mb-1">Starting at</p>
        <p className="text-4xl font-bold text-gray-900 mb-1">₹{vendor.pricePerSqft}</p>
        <p className="text-gray-500 text-sm">per sqft</p>
      </div>
      
      <button 
        onClick={() => setSelectedVendorId(vendor.id)}
        className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-[#1A1A1A] active:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors shadow-md mb-4"
      >
        Request Site Inspection
      </button>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
        <Star className="w-4 h-4 fill-[#F5B301] text-[#F5B301]" />
        <span className="font-medium">{vendor.rating}</span>
        <span>({vendor.reviewCount} reviews)</span>
      </div>
    </div>
  );

  // State to control the modal
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* TOP NAV: Back Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to My Projects</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <div className="max-w-[1200px] mx-auto px-8 py-8">
        
        {/* ROW 1: HEADER + PRICE CTA */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* LEFT: Header Card (8 columns) */}
          <div className="col-span-8 bg-white rounded-xl p-8 shadow-sm">
            <div className="flex items-start gap-6">
              {/* Circular vendor avatar */}
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                <ImageWithFallback
                  src={vendor.image}
                  alt={vendor.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Vendor Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-semibold">{vendor.name}</h1>
                  {vendor.verified && (
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="w-4 h-4" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>
                
                {/* Tagline */}
                <p className="text-gray-600 mb-4">
                  Transforming Homes Since {vendor.foundedYear}
                </p>

                {/* Meta row */}
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{vendor.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span>{vendor.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Pricing CTA Card (4 columns) */}
          <div className="col-span-4">
            <PricingCTACard />
          </div>
        </div>

        {/* ROW 2: ABOUT + TRUST CARD */}
        <div className="grid grid-cols-12 gap-6 mb-6">
          {/* LEFT: About Card (8 columns) */}
          <div className="col-span-8 bg-white rounded-xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              {vendor.about}
            </p>

            <div className="border-t border-gray-200 pt-6">
              {/* 2-column info grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{vendor.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium text-gray-900">{vendor.languages.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium text-gray-900">{vendor.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience</span>
                  <span className="font-medium text-gray-900">{vendor.yearsInBusiness} Years</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Trust Card (4 columns) */}
          <div className="col-span-4 bg-gradient-to-br from-blue-50 to-orange-50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-700">Trusted by</p>
                <p className="text-3xl font-bold text-gray-900">{vendor.trustedByCount}+</p>
              </div>
            </div>
            <p className="text-gray-700 font-medium mb-4">homeowners</p>
            
            {/* Rating stars (visual only) */}
            <div className="flex items-center gap-1 pt-4 border-t border-white/50">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.floor(vendor.rating)
                      ? 'fill-[#F5B301] text-[#F5B301]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm font-medium text-gray-700">
                {vendor.rating} / 5.0
              </span>
            </div>
          </div>
        </div>

        {/* ROW 3: PORTFOLIO (FULL WIDTH) */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Portfolio</h2>
            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
              See all
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Exactly 3 image cards in a row */}
          <div className="grid grid-cols-3 gap-4">
            {vendor.portfolio.map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 4: SERVICES OFFERED (FULL WIDTH) */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-6">Services Offered</h2>
          
          {/* Two-column checklist layout */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {vendor.services.map((service, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{service}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 5: CERTIFICATIONS + STATS (FULL WIDTH) */}
        <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
          <h2 className="text-xl font-semibold mb-6">Certifications</h2>
          
          {/* Badge-style rows */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {vendor.certifications.map((cert, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">{cert}</span>
              </div>
            ))}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <span className="text-gray-700 font-medium">{vendor.yearsInBusiness} Years in Business</span>
            </div>
          </div>

          {/* Divider line */}
          <div className="border-t border-gray-200 pt-6">
            {/* Stats row with icons */}
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{vendor.homeownersServed}+</p>
                  <p className="text-gray-600 text-sm">Homeowners Served</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{vendor.projectsFinished}+</p>
                  <p className="text-gray-600 text-sm">Finished Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTIONS (LEFT-ALIGNED BUTTONS) */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
            <Share2 className="w-4 h-4" />
            Share Vendor Page
          </button>
          <button
            className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-[#1A1A1A] active:bg-black focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition-colors shadow-md"
            onClick={() => setSelectedVendorId(vendor.id)}
          >
            Request Site Inspection
          </button>
        </div>

        {/* Site Inspection Modal */}
        {selectedVendorId && (
          <SiteInspectionModal
            vendorId={selectedVendorId}
            onClose={() => setSelectedVendorId(null)}
          />
        )}
      </div>
    </div>
  );
}