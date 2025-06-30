import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Euro, Globe } from "lucide-react";
import boltnewimg from "../white_circle_360x360.png";
import styled from "styled-components";

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 relative">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Euro className="w-8 h-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">
                MyEarnings.online
              </span>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Transparency creates trust. Track your money flow and business
              ventures in visual streams.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://emp.lv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Homepage"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/emilsplavenieks/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://www.facebook.com/emils.plavenieks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/emplv/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/features"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/integrations"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/about"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/team"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Team
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/faq"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>

          <a href="https://bolt.new" target="_blank" rel="noopener noreferrer">
            <BoltNewImage src={boltnewimg} alt="Built by Bolt.new" />
          </a>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 SIA EMP. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link
                to="/terms"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Terms and Conditions
              </Link>
              <Link
                to="/privacy"
                className="text-gray-500 hover:text-gray-700 text-sm transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const BoltNewImage = styled.img`
  position: absolute;
  bottom: -30px;
  right: 0px;
  width: 120px;
  height: 120px;
  transform: rotate(-45deg);
`;

export default Footer;
