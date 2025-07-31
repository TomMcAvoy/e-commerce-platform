'use client';

import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitMessage('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Have questions, feedback, or need help? We're here to assist you and would love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">support@whitestart.com</p>
                    <p className="text-sm text-gray-500">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <PhoneIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-sm text-gray-500">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <MapPinIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">
                      123 Commerce Street<br />
                      Suite 100<br />
                      Toronto, ON M5V 3C3<br />
                      Canada
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <div className="text-gray-600 text-sm space-y-1">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                      <p className="text-blue-600 font-medium">24/7 Online Support</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Quick Links */}
              <div className="mt-12">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Help</h3>
                <div className="space-y-2">
                  <a href="/help" className="block text-blue-600 hover:text-blue-700 text-sm">
                    📚 View Help Center
                  </a>
                  <a href="/track-order" className="block text-blue-600 hover:text-blue-700 text-sm">
                    📦 Track Your Order
                  </a>
                  <a href="/account" className="block text-blue-600 hover:text-blue-700 text-sm">
                    👤 Manage Account
                  </a>
                  <a href="/social" className="block text-blue-600 hover:text-blue-700 text-sm">
                    💬 Community Support
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                {submitMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700">{submitMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Question</option>
                      <option value="technical">Technical Issue</option>
                      <option value="billing">Billing Question</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="feedback">Feedback & Suggestions</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Please describe your inquiry in detail..."
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="newsletter"
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="newsletter" className="text-sm text-gray-600">
                      I'd like to receive updates about new products, features, and community events.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Help Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Other Ways to Get Help</h2>
            <p className="text-lg text-gray-600">Choose the method that works best for you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">Get instant help from our support team</p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Start Chat
              </button>
            </div>

            <div className="text-center p-6 rounded-xl bg-purple-50 hover:bg-purple-100 transition-colors duration-200">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community</h3>
              <p className="text-gray-600 mb-4">Ask questions and help other users</p>
              <a 
                href="/social" 
                className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Join Community
              </a>
            </div>

            <div className="text-center p-6 rounded-xl bg-green-50 hover:bg-green-100 transition-colors duration-200">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Help Center</h3>
              <p className="text-gray-600 mb-4">Browse our comprehensive knowledge base</p>
              <a 
                href="/help" 
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200"
              >
                Browse Articles
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}