import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Send, 
  Building2, 
  Users, 
  Heart, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Phone,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ContactRequest {
  type: 'partner' | 'ngo' | 'group';
  organizationName: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  services: string;
  location: string;
  message: string;
}

export default function ContactUs() {
  console.log('📧 ContactUs page loaded');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [adminContactInfo, setAdminContactInfo] = useState({
    adminEmail: 'admin@mental-wellness.app',
    adminPhone: '+1 (555) 123-HELP',
    adminName: 'Admin',
    location: 'Mental Health Wellness Center'
  });
  const [formData, setFormData] = useState<ContactRequest>({
    type: 'partner',
    organizationName: '',
    contactPerson: '',
    email: '',
    phone: '',
    website: '',
    description: '',
    services: '',
    location: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load admin contact info on component mount and set up real-time updates
  React.useEffect(() => {
    const loadContactInfo = () => {
      const savedContactInfo = localStorage.getItem('admin_contact_info');
      if (savedContactInfo) {
        const contactInfo = JSON.parse(savedContactInfo);
        setAdminContactInfo(contactInfo);
        console.log('📧 Loaded admin contact info:', contactInfo);
      }
    };

    // Load initially
    loadContactInfo();

    // Set up real-time updates by checking for changes every second
    const interval = setInterval(() => {
      loadContactInfo();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Create the request object
      const request = {
        id: Date.now().toString(),
        userId: user?.id,
        userEmail: user?.email,
        userName: user?.username || user?.email?.split('@')[0],
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      // Save to localStorage (in real app, this would be sent to backend)
      const existingRequests = JSON.parse(localStorage.getItem('contact_requests') || '[]');
      existingRequests.push(request);
      localStorage.setItem('contact_requests', JSON.stringify(existingRequests));

      // Simulate email notification (in real app, backend would handle this)
      console.log('📧 Email notification sent to admin:', {
        to: adminContactInfo.adminEmail,
        subject: `New ${formData.type} Request from ${formData.contactPerson}`,
        body: `
          New ${formData.type} request submitted:
          
          Organization: ${formData.organizationName}
          Contact Person: ${formData.contactPerson}
          Email: ${formData.email}
          Phone: ${formData.phone}
          Website: ${formData.website}
          Location: ${formData.location}
          
          Description: ${formData.description}
          Services: ${formData.services}
          
          Message: ${formData.message}
          
          Submitted by: ${user?.username} (${user?.email})
          Date: ${new Date().toLocaleString()}
        `
      });

      // Simulate user confirmation email
      console.log('📧 Confirmation email sent to user:', {
        to: formData.email,
        subject: `Request Received - ${formData.organizationName}`,
        body: `
          Dear ${formData.contactPerson},
          
          Thank you for your interest in partnering with our Mental Health Wellness Platform.
          
          We have received your request to add "${formData.organizationName}" as a ${formData.type}.
          
          Our admin team will review your submission and contact you within 2-3 business days.
          
          Request Details:
          - Organization: ${formData.organizationName}
          - Type: ${formData.type}
          - Submitted: ${new Date().toLocaleString()}
          
          Best regards,
          Mental Health Wellness Platform Team
        `
      });

      setSubmitStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          type: 'partner',
          organizationName: '',
          contactPerson: '',
          email: '',
          phone: '',
          website: '',
          description: '',
          services: '',
          location: '',
          message: ''
        });
        setSubmitStatus('idle');
      }, 3000);

    } catch (error) {
      console.error('❌ Error submitting contact request:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'partner': return <Building2 className="h-5 w-5" />;
      case 'ngo': return <Heart className="h-5 w-5" />;
      case 'group': return <Users className="h-5 w-5" />;
      default: return <Building2 className="h-5 w-5" />;
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'partner': return 'Healthcare providers, therapy centers, wellness clinics';
      case 'ngo': return 'Non-profit organizations focused on mental health support';
      case 'group': return 'Support groups, community organizations, advocacy groups';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Want to add your organization to our platform? Submit a request and our admin team will review it.
            </p>
          </motion.div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { type: 'partner', title: 'Healthcare Partners', desc: 'Therapy centers, clinics, wellness providers' },
            { type: 'ngo', title: 'NGO Partners', desc: 'Non-profit mental health organizations' },
            { type: 'group', title: 'Support Groups', desc: 'Community groups and advocacy organizations' }
          ].map((item) => (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg p-6 shadow-lg border-2 border-transparent hover:border-purple-200 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                {getTypeIcon(item.type)}
                <h3 className="font-semibold text-gray-900">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-6 w-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Submit Partnership Request</h2>
          </div>

          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2"
            >
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Request Submitted Successfully!</p>
                <p className="text-sm">Our admin team will review your request and contact you within 2-3 business days.</p>
              </div>
            </motion.div>
          )}

          {submitStatus === 'error' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Submission Failed</p>
                <p className="text-sm">Please try again or contact us directly.</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="partner">Healthcare Partner</option>
                <option value="ngo">NGO Partner</option>
                <option value="group">Support Group</option>
              </select>
              <p className="text-sm text-gray-500 mt-1">{getTypeDescription(formData.type)}</p>
            </div>

            {/* Organization Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter organization name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person *
                </label>
                <input
                  type="text"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="contact@organization.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Website and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://organization.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="City, State/Country"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Describe your organization, mission, and goals..."
              />
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services Offered *
              </label>
              <textarea
                name="services"
                value={formData.services}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="List the services you provide (e.g., counseling, support groups, crisis intervention...)"
              />
            </div>

            {/* Additional Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Any additional information you'd like to share..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Request
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Contact Information */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Email Us</p>
                  <p className="text-sm">{adminContactInfo.adminEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium">Call Us</p>
                  <p className="text-sm">{adminContactInfo.adminPhone}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Note:</strong> Only administrators can add new partners, NGOs, and groups to the platform.
                Your request will be reviewed by our admin team, and you'll receive an email confirmation once processed.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
