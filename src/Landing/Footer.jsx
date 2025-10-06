import React from "react";



export default function Footer () {
  return (
    <footer className="bg-white  mt-12">
      <div className=" mx-auto px-6 py-10 grid grid-cols-2 border-t border-gray-400 md:grid-cols-5 gap-8 text-gray-700">
        {/* Logo */}
        <div className="col-span-2 md:col-span-1 flex items-center">
          <img src="/icons/logo dv.svg" alt="La Dolce Vita" className="h-20 w-30 md:mx-auto" />
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-medium mb-3 text-black">Quick links</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><a href="#" className="hover:text-red-600">Home</a></li>
            <li><a href="#" className="hover:text-red-600">Shop</a></li>
            <li><a href="#" className="hover:text-red-600">Contact</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h4 className="font-medium text-black mb-3">Social</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li className="flex items-center gap-2">
              <img className="h-5 w-5" src="/icons/tiktok-logo.png" alt="icon" />
               TikTok
            </li>
            <li className="flex items-center gap-2">
              <img className="h-5 w-5" src="/icons/instagram-logo.png" alt="icon" />
               Instagram
            </li>
            <li className="flex items-center gap-2">
              <img className="h-5 w-5" src="/icons/facebook-icon.svg" alt="icon" />
               Facebook
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-medium text-black mb-3">Legal</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-red-600">Terms & condition</a></li>
            <li><a href="#" className="hover:text-red-600">Privacy</a></li>
            <li><a href="#" className="hover:text-red-600">Legal Notice</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-medium text-black mb-3">Support</h4>
          <ul className="space-y-2 text-gray-500 text-sm">
            <li><a href="#" className="hover:text-red-600">FAQ</a></li>
            <li><a href="#" className="hover:text-red-600">Returns</a></li>
            <li><a href="#" className="hover:text-red-600">Shipping</a></li>
          </ul>
        </div>
      </div>

       <hr className="text-gray-500" />
       <p className="text-center text-gray-500 my-2 text-sm">@ 2025 La Dolce Vita. All rights reserved</p>
     
    </footer>
  );
}
