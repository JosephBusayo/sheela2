"use client"

import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isSignedIn, isLoaded } = useUser();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    // API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setEmail('');
    //add toast notification here
  };

  const categories = [
    { name: 'Women', href: '/store/women' },
    { name: 'Men', href: '/store/men' },
   
  ];

  const quickLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Help', href: '/contact-us' },
    { name: 'T&Cs', href: '/terms' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Return item', href: '/return' }
  ];

  const socialLinks = [
    { name: 'Instagram', href: '#', icon: 'instagram' },
    { name: 'Facebook', href: '#', icon: 'facebook' },
    { name: 'TikTok', href: '#', icon: 'tiktok' }
  ];



  return (
   
      <footer className="w-full mx-auto md:my-6 my-2 px-4 sm:px-6 lg:px-8 md:py-16 py-6 bg-bt-green justify-center">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 justify-between">
          
          {/* Brand Section */}
          <div className="lg:col-span-1 gap-2">
            <Image src="/images/sheela.png" alt='logo' width={200} height={50} className='w-20 h-7 md:w-36 md:h-12' />
            <p className="text-gray-300 my-6 text-xs md:text-lg font-normal ">
              Handmade Elegance, Straight from Africa
            </p>
            <Link href={"/store/women"}>

            <Button className="bg-white text-bt-green px-1 !py-0 md:px-6 md:py-2 hover:bg-gray-100 transition-colors duration-200 font-extralight  md:font-medium cursor-pointer border-none text-xs md:text-lg shadow-none rounded-none" >
              PLACE YOUR ORDER
            </Button>
            </Link>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider md:mb-4 mb-2 text-gray-200">
              Categories
            </h3>
            <ul className="space-y-1 md:space-y-3">
              {categories.map((category) => (
                <li key={category.name}>
                  <Link
                    href={category.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-lg"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold md:text-sm uppercase tracking-wider md:mb-4 mb-2  text-gray-200">
              Quick Links
            </h3>
            <ul className="space-y-1 md:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-lg"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            {isSignedIn && isLoaded && (user?.publicMetadata?.role === "admin" ||
              (Array.isArray(user?.publicMetadata?.roles) && user.publicMetadata.roles.includes("admin"))) && (
              <div className='flex flex-row mt-6 gap-2'>
                <h2 className='text-white font-normal'>Admin</h2>
                <Link href={"/admin/dashboard"} className="text-gray-300 hover:text-white transition-colors duration-200 font-normal underline">
                  <h3>Dashboard</h3>
                </Link>
              </div>
            )}
          </div>

          {/* Socials */}
          <div>
            <h3 className="text-xs md:text-sm font-semibold uppercase tracking-wider md:mb-4 mb-2  text-gray-200">
              Socials
            </h3>
            <ul className="space-y-2 md:space-y-3">
              {socialLinks.map((social) => (
                <li key={social.name}>
                  <Link
                    href={social.href}
                    className="flex items-center  text-gray-300 hover:text-white transition-colors duration-200 text-xs md:text-lg"
                  >
                    {/* <SocialIcon icon={social.icon} /> */}
                    <span>{social.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter and Footer Bottom */}
        <div className="mt-2 md:mt-12 md:pt-8 pt-3 border-t border-gray-600">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-6 lg:space-y-0">
            
            {/* Copyright */}
            <div className="text-xs md:text-sm text-gray-300">
              © {new Date().getFullYear()} SHEELA ALL RIGHTS RESERVED.
            </div>

            {/* Newsletter */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <span className="text-xs md:text-sm font-medium whitespace-nowrap text-gray-300">
                JOIN OUR NEWSLETTER
              </span>
              <form onSubmit={handleNewsletterSubmit} className="w-full sm:w-auto">
                <div className="flex items-center bg-white pr-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Your Email"
                    className="bg-transparent text-gray-900 px-4 py-2 flex-1 focus:outline-none"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-bt-green text-white px-4 py-2 rounded-none cursor-pointer hover:bg-bt-green/90 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Subscribe to newsletter"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin"/>
                    ) : (
                      'Send'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </footer>
 
  );
};

export default Footer;
