import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Eye,
  Check,
  X,
  Clock,
  Building2,
  Heart,
  Users,
  Phone,
  Globe,
  MapPin,
  Calendar,
  User,
  Send,
  Trash2
} from 'lucide-react';

interface ContactRequest {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
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
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export const ContactRequestManagement: React.FC = () => {
  console.log('📋 ContactRequestManagement component loaded');
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [filterType, setFilterType] = useState<'all' | 'partner' | 'ngo' | 'group'>('all');

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = () => {
    const savedRequests = localStorage.getItem('contact_requests');
    if (savedRequests) {
      setRequests(JSON.parse(savedRequests));
    }
  };

  const updateRequestStatus = (requestId: string, status: 'approved' | 'rejected') => {
    const updatedRequests = requests.map(request =>
      request.id === requestId
        ? {
            ...request,
            status,
            reviewedAt: new Date().toISOString(),
            reviewedBy: 'admin' // In real app, this would be the current admin user
          }
        : request
    );

    setRequests(updatedRequests);
    localStorage.setItem('contact_requests', JSON.stringify(updatedRequests));

    // Send email notification to user
    const request = requests.find(r => r.id === requestId);
    if (request) {
      sendStatusUpdateEmail(request, status);

      // If approved, add to the appropriate list for real-time reflection
      if (status === 'approved') {
        addToApprovedList(request);
      }
    }

    console.log(`✅ Request ${requestId} ${status}`);
  };

  const deleteRequest = (requestId: string) => {
    if (window.confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      const updatedRequests = requests.filter(request => request.id !== requestId);
      setRequests(updatedRequests);
      localStorage.setItem('contact_requests', JSON.stringify(updatedRequests));
      console.log(`🗑️ Request ${requestId} deleted`);
    }
  };

  const addToApprovedList = (request: ContactRequest) => {
    // Add to the appropriate list based on type for real-time reflection
    const newItem = {
      id: Date.now().toString(),
      name: request.organizationName,
      description: request.description,
      services: request.services.split(',').map(s => s.trim()),
      location: request.location,
      contact: {
        email: request.email,
        phone: request.phone,
        website: request.website
      },
      verified: true,
      addedAt: new Date().toISOString(),
      addedBy: 'admin',
      approvedFromRequest: true
    };

    if (request.type === 'partner') {
      const existingPartners = JSON.parse(localStorage.getItem('partners') || '[]');
      existingPartners.push(newItem);
      localStorage.setItem('partners', JSON.stringify(existingPartners));
      console.log('✅ Added to partners list:', newItem.name);

      // Trigger real-time update event
      window.dispatchEvent(new CustomEvent('partnersUpdated', { detail: existingPartners }));
    } else if (request.type === 'ngo') {
      const existingNGOs = JSON.parse(localStorage.getItem('ngos') || '[]');
      existingNGOs.push(newItem);
      localStorage.setItem('ngos', JSON.stringify(existingNGOs));
      console.log('✅ Added to NGOs list:', newItem.name);

      // Trigger real-time update event
      window.dispatchEvent(new CustomEvent('ngosUpdated', { detail: existingNGOs }));
    } else if (request.type === 'group') {
      const existingGroups = JSON.parse(localStorage.getItem('support_groups') || '[]');
      existingGroups.push(newItem);
      localStorage.setItem('support_groups', JSON.stringify(existingGroups));
      console.log('✅ Added to support groups list:', newItem.name);

      // Trigger real-time update event
      window.dispatchEvent(new CustomEvent('groupsUpdated', { detail: existingGroups }));
    }

    // Also trigger a general update event
    window.dispatchEvent(new CustomEvent('organizationsUpdated', {
      detail: { type: request.type, item: newItem }
    }));
  };

  const sendStatusUpdateEmail = (request: ContactRequest, status: 'approved' | 'rejected') => {
    // Simulate email notification (in real app, backend would handle this)
    console.log('📧 Status update email sent to user:', {
      to: request.email,
      subject: `Partnership Request ${status === 'approved' ? 'Approved' : 'Rejected'} - ${request.organizationName}`,
      body: status === 'approved' 
        ? `
          Dear ${request.contactPerson},
          
          Great news! Your request to add "${request.organizationName}" as a ${request.type} has been APPROVED.
          
          Your organization will be added to our platform within the next 24 hours.
          
          Next Steps:
          1. You will receive another email with your organization's profile link
          2. You can update your organization details through our admin panel
          3. Your services will be visible to all platform users
          
          Thank you for partnering with us!
          
          Best regards,
          Mental Health Wellness Platform Team
        `
        : `
          Dear ${request.contactPerson},
          
          Thank you for your interest in partnering with our Mental Health Wellness Platform.
          
          After careful review, we are unable to approve your request for "${request.organizationName}" at this time.
          
          This may be due to:
          - Incomplete information provided
          - Services not aligned with our platform focus
          - Current capacity limitations
          
          You are welcome to resubmit your request with additional information or contact us directly for feedback.
          
          Best regards,
          Mental Health Wellness Platform Team
        `
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'partner': return <Building2 className="h-4 w-4" />;
      case 'ngo': return <Heart className="h-4 w-4" />;
      case 'group': return <Users className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesType = filterType === 'all' || request.type === filterType;
    return matchesStatus && matchesType;
  });

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contact Requests</h2>
          <p className="text-gray-600">Manage partnership requests from users</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Mail className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <Check className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <X className="h-8 w-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="all">All Types</option>
          <option value="partner">Healthcare Partners</option>
          <option value="ngo">NGO Partners</option>
          <option value="group">Support Groups</option>
        </select>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
            <p className="text-gray-600">
              {filterStatus !== 'all' || filterType !== 'all'
                ? 'Try adjusting your filters.'
                : 'No partnership requests have been submitted yet.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(request.type)}
                      <h3 className="text-lg font-semibold text-gray-900">{request.organizationName}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="h-4 w-4" />
                          <span>{request.contactPerson}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{request.email}</span>
                        </div>
                        {request.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{request.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{request.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</span>
                        </div>
                        {request.website && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Globe className="h-4 w-4" />
                            <a href={request.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                              {request.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{request.description}</p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateRequestStatus(request.id, 'approved')}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                          title="Approve"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => updateRequestStatus(request.id, 'rejected')}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          title="Reject"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    )}

                    {/* Delete button for all requests */}
                    <button
                      onClick={() => deleteRequest(request.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete Request"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedRequest(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {getTypeIcon(selectedRequest.type)}
                  <h3 className="text-xl font-semibold text-gray-900">{selectedRequest.organizationName}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Organization Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Organization Details</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                    <p className="text-gray-900">{selectedRequest.organizationName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(selectedRequest.type)}
                      <span className="capitalize">{selectedRequest.type}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-900 text-sm">{selectedRequest.description}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered</label>
                    <p className="text-gray-900 text-sm">{selectedRequest.services}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">{selectedRequest.location}</span>
                    </div>
                  </div>

                  {selectedRequest.website && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <a
                          href={selectedRequest.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-700"
                        >
                          {selectedRequest.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 border-b pb-2">Contact Information</h4>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">{selectedRequest.contactPerson}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <a
                        href={`mailto:${selectedRequest.email}`}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        {selectedRequest.email}
                      </a>
                    </div>
                  </div>

                  {selectedRequest.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <a
                          href={`tel:${selectedRequest.phone}`}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          {selectedRequest.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submitted By</label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">{selectedRequest.userName} ({selectedRequest.userEmail})</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Submission Date</label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">{new Date(selectedRequest.submittedAt).toLocaleString()}</span>
                    </div>
                  </div>

                  {selectedRequest.reviewedAt && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Reviewed Date</label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-900">{new Date(selectedRequest.reviewedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Message */}
              {selectedRequest.message && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 border-b pb-2 mb-4">Additional Message</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 text-sm whitespace-pre-wrap">{selectedRequest.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <button
                    onClick={() => {
                      updateRequestStatus(selectedRequest.id, 'rejected');
                      setSelectedRequest(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Reject Request
                  </button>
                  <button
                    onClick={() => {
                      updateRequestStatus(selectedRequest.id, 'approved');
                      setSelectedRequest(null);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Check className="h-4 w-4" />
                    Approve Request
                  </button>
                </div>
              )}

              {/* Contact Actions */}
              <div className="flex justify-start gap-3 mt-6 pt-6 border-t">
                <a
                  href={`mailto:${selectedRequest.email}?subject=Re: Partnership Request - ${selectedRequest.organizationName}`}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                  Send Email
                </a>
                {selectedRequest.phone && (
                  <a
                    href={`tel:${selectedRequest.phone}`}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
