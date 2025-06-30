import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';
import Footer from '../components/footer';

interface FAQItem {
  question: string;
  answer: string;
}

function FAQAccordion({ item, isOpen, onToggle }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
      >
        <h3 className="text-lg font-medium text-white pr-4">{item.question}</h3>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-white/60 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-white/60 flex-shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div className="px-6 pb-4">
          <div className="border-t border-white/10 pt-4">
            <p className="text-white/80 text-sm leading-relaxed">{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  );
}

function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([0]); // First item open by default

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqItems: FAQItem[] = [
    {
      question: "What is My Earnings?",
      answer: "My Earnings is a transparency platform where entrepreneurs and businesses can publicly share their revenue streams, build trust with their audience, and connect with other transparent businesses."
    },
    {
      question: "Is it really completely free?",
      answer: "Yes! My Earnings is 100% free with no monthly subscriptions, hidden fees, or feature limitations. You get unlimited connections, full analytics, and all features forever."
    },
    {
      question: "How do I make my revenue information public?",
      answer: "When creating connections or updating your profile, you can choose which information to make public. You have full control over what's visible to others and what remains private."
    },
    {
      question: "Can I connect with other businesses?",
      answer: "Absolutely! You can search for and connect with unlimited other profiles on the platform. There are no restrictions on the number of connections you can make."
    },
    {
      question: "What's the difference between Free and Sponsor tiers?",
      answer: "The free version includes all features with no limitations. The Sponsor tier ($29/month) is a way to support the creator and includes a custom profile URL (like yourname.myearnings.online)."
    },
    {
      question: "Is my financial data secure?",
      answer: "Yes, we use industry-standard encryption and security measures. You control what information is public vs private, and all data is protected with enterprise-grade security."
    },
    {
      question: "Are there any connection limits?",
      answer: "No! You can connect to unlimited income sources and destinations. Build your complete revenue transparency network without any restrictions."
    },
    {
      question: "Can I delete my account anytime?",
      answer: "Yes, you can delete your account at any time. Contact our support team and we'll permanently remove your data from our systems within 30 days."
    },
    {
      question: "Will it always be free?",
      answer: "Yes! The core platform will always remain free with all features included. The sponsor tier is optional and only for those who want to support the project's development."
    }
  ];

  return (
    <div className="min-h-screen relative">
      <Navbar />

      <div className="bg-dark-gradient">
        <div className="py-16 px-4 sm:px-6 lg:px-8 bg-noise">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="py-16">
              <Link 
                to="/" 
                className="inline-flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
              
              <div className="flex items-center space-x-3 mb-6">
                <HelpCircle className="w-8 h-8 text-blue-400" />
                <h1 className="text-4xl font-bold text-white">Frequently Asked Questions</h1>
              </div>
              
              <p className="text-lg text-white/80">
                Find answers to common questions about My Earnings and revenue transparency.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4 mb-20">
              {faqItems.map((item, index) => (
                <FAQAccordion
                  key={index}
                  item={item}
                  isOpen={openItems.includes(index)}
                  onToggle={() => toggleItem(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default FAQ;