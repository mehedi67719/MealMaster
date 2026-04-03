import React from 'react';
import Link from 'next/link';
import { 
  Utensils, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Heart,

} from 'lucide-react';
import { FaFacebook, FaTwitter } from 'react-icons/fa';
import { FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Meal List', href: '/meal-list' },
    { name: 'Contact', href: '/contact' },
  ];

  const supportLinks = [
    { name: 'FAQ', href: '/faq' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Help Center', href: '/help' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com' },
    { name: 'Instagram', icon: FiInstagram, href: 'https://instagram.com' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center shadow-md">
                <Utensils className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                SmartMeal
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              SmartMeal helps you manage your mess meals efficiently. Join thousands of satisfied users today.
            </p>
            <div className="flex gap-3">
              {socialLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all hover:scale-110 hover:shadow-lg text-gray-600"
                  aria-label={name}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-emerald-600 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></span>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map(({ name, href }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="text-gray-500 hover:text-emerald-600 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover:scale-125 transition-transform"></span>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          
          <div>
            <h3 className="font-semibold text-lg mb-4 text-gray-800">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-gray-500 text-sm group">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                <span>123 Food Street, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-gray-500 text-sm group">
                <Mail className="w-4 h-4 flex-shrink-0 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                <a href="mailto:info@smartmeal.com" className="hover:text-emerald-600 transition-colors">
                  info@smartmeal.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-500 text-sm group">
                <Phone className="w-4 h-4 flex-shrink-0 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                <a href="tel:+880123456789" className="hover:text-emerald-600 transition-colors">
                  +880 1234 56789
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-500 text-sm group">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        
        <div className="border-t border-gray-200 mt-10 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-gray-400 text-xs text-center sm:text-left">
              © {currentYear} SmartMeal. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs flex items-center gap-1">
              Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> by SmartMeal Team
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;