// components/HelpSupport.tsx
'use client';

import { useState } from 'react';
import { 
  Mail, 
  Github, 
  MessageSquare, 
  HelpCircle, 
  User, 
  Send, 
  ChevronDown,
  ChevronUp,
  Code2,
  Smartphone,
  Globe,
  Shield,
  CreditCard
} from 'lucide-react';
import { FaQuestionCircle, FaEnvelope, FaUserTie } from 'react-icons/fa';

const HelpSupport = () => {
  const [activeTab, setActiveTab] = useState('contact');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: "How do I update my profile information?",
      answer: "You can update your profile by navigating to the 'My Profile' section in your account settings. Click the edit button next to any field you wish to change.",
      icon: <User className="w-5 h-5" />
    },
    {
      question: "How can I change my password?",
      answer: "To change your password, go to Account Settings > Security. You'll need to enter your current password before setting a new one.",
      icon: <Shield className="w-5 h-5" />
    },
    {
      question: "What should I do if I encounter a bug?",
      answer: "Please report any bugs through our contact form with details about the issue, including what you were doing when it occurred and any error messages you saw.",
      icon: <Code2 className="w-5 h-5" />
    },
    {
      question: "How do I delete my account?",
      answer: "Account deletion can be requested by contacting our support team. We'll guide you through the process and confirm deletion once initiated.",
      icon: <User className="w-5 h-5" />
    },
    {
      question: "Is the app available on mobile?",
      answer: "Yes, our web app is fully responsive and works on all mobile devices. We're also developing native mobile apps for iOS and Android.",
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      question: "How do I change my subscription plan?",
      answer: "You can upgrade or downgrade your subscription at any time from the Billing section in your account settings.",
      icon: <CreditCard className="w-5 h-5" />
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log({ name, email, subject, message });
    setIsSubmitted(true);
    // Reset form after submission
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    
    // Reset submission status after 3 seconds
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Help & Support Center</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">Get assistance, report issues, or learn how to make the most of our platform. We're here to help!</p>
      </div>
      
      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="tabs tabs-boxed bg-base-200">
          <button 
            className={`tab tab-lg ${activeTab === 'contact' ? 'tab-active tab-primary' : ''} flex items-center gap-2`}
            onClick={() => setActiveTab('contact')}
          >
            <FaEnvelope className="w-4 h-4" />
            Contact Us
          </button>
          <button 
            className={`tab tab-lg ${activeTab === 'faq' ? 'tab-active tab-primary' : ''} flex items-center gap-2`}
            onClick={() => setActiveTab('faq')}
          >
            <FaQuestionCircle className="w-4 h-4" />
            FAQs
          </button>
          <button 
            className={`tab tab-lg ${activeTab === 'developer' ? 'tab-active tab-primary' : ''} flex items-center gap-2`}
            onClick={() => setActiveTab('developer')}
          >
            <FaUserTie className="w-4 h-4" />
            Developer
          </button>
        </div>
      </div>
      
      {/* Contact Form */}
      {activeTab === 'contact' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-8 h-8 text-primary" />
              <h2 className="card-title text-2xl">Get in Touch</h2>
            </div>
            
            <p className="text-gray-600 mb-8 text-lg">Have questions or need assistance? Fill out the form below and we'll get back to you within 24 hours.</p>
            
            {isSubmitted && (
              <div className="alert alert-success mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg">Your message has been sent successfully!</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">Your Name</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="text" 
                      className="input input-bordered input-lg pl-12 w-full" 
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text text-lg font-semibold">Your Email</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input 
                      type="email" 
                      className="input input-bordered input-lg pl-12 w-full" 
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Subject</span>
                </label>
                <div className="relative">
                  <HelpCircle className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    className="input input-bordered input-lg pl-12 w-full" 
                    placeholder="What is this regarding?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text text-lg font-semibold">Your Message</span>
                </label>
                <textarea 
                  className="textarea textarea-bordered textarea-lg h-40 text-lg p-4" 
                  placeholder="Please describe your issue or question in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="form-control mt-8">
                <button type="submit" className="btn btn-primary btn-lg w-full md:w-auto">
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* FAQ Section */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-8 h-8 text-primary" />
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((item, index) => (
              <div key={index} className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow">
                <div 
                  className="card-body cursor-pointer" 
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-primary">
                        {item.icon}
                      </div>
                      <h3 className="card-title text-lg">{item.question}</h3>
                    </div>
                    {openFaqIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  {openFaqIndex === index && (
                    <div className="mt-4 pl-8">
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Developer Info */}
      {activeTab === 'developer' && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-8">
              <User className="w-8 h-8 text-primary" />
              <h2 className="card-title text-2xl">Developer Information</h2>
            </div>
            
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-base-200 rounded-box">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-24">
                    <span className="text-3xl">OB</span>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold">Onesmus Bett</h3>
                  <p className="text-lg text-gray-600">Full Stack Developer</p>
                  <p className="mt-2 text-gray-500">Passionate about creating intuitive and efficient web applications</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-base-200 p-6 rounded-box">
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Contact Information
                  </h4>
                  <div className="space-y-3">
                    <a href="mailto:onesmuskipchumba5@gmail.com" className="flex items-center gap-3 link link-primary text-lg">
                      <Mail className="w-5 h-5" />
                      onesmuskipchumba5@gmail.com
                    </a>
                    <a href="https://github.com/onesmukipchumba0" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 link link-primary text-lg">
                      <Github className="w-5 h-5" />
                      github.com/onesmukipchumba0
                    </a>
                  </div>
                </div>
                
                <div className="bg-base-200 p-6 rounded-box">
                  <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-primary" />
                    Technical Stack
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Next.js & React
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      TypeScript
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Tailwind CSS & DaisyUI
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      Node.js & Express
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-primary/10 p-6 rounded-box">
                <h4 className="font-semibold text-lg mb-3">About This Application</h4>
                <p className="text-gray-700">
                  This application was built with a focus on user experience, performance, and security. 
                  It utilizes modern web technologies to provide a seamless experience across all devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSupport;