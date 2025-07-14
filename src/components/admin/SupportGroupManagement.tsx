import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Calendar,
  MapPin,
  Globe,
  User,
  Clock,
  Shield,
  Tag,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import type { SupportGroup } from '../../context/AdminContext';

interface SupportGroupManagementProps {
  onClose?: () => void;
}

const SupportGroupManagement: React.FC<SupportGroupManagementProps> = ({ onClose }) => {
  const { supportGroups, addSupportGroup, updateSupportGroup, deleteSupportGroup } = useAdmin();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SupportGroup | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'general' as SupportGroup['category'],
    facilitator: '',
    facilitatorBio: '',
    maxMembers: 12,
    meetingSchedule: '',
    meetingType: 'online' as SupportGroup['meetingType'],
    meetingLink: '',
    location: '',
    isActive: true,
    isPublic: true,
    requirements: '',
    tags: ''
  });

  const categories = [
    { value: 'anxiety', label: 'Anxiety Support', color: 'bg-blue-100 text-blue-800' },
    { value: 'depression', label: 'Depression Support', color: 'bg-purple-100 text-purple-800' },
    { value: 'trauma', label: 'Trauma Recovery', color: 'bg-red-100 text-red-800' },
    { value: 'relationships', label: 'Relationships', color: 'bg-pink-100 text-pink-800' },
    { value: 'self-care', label: 'Self-Care', color: 'bg-green-100 text-green-800' },
    { value: 'general', label: 'General Support', color: 'bg-gray-100 text-gray-800' }
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'general',
      facilitator: '',
      facilitatorBio: '',
      maxMembers: 12,
      meetingSchedule: '',
      meetingType: 'online',
      meetingLink: '',
      location: '',
      isActive: true,
      isPublic: true,
      requirements: '',
      tags: ''
    });
    setEditingGroup(null);
    setShowAddForm(false);
  };

  const handleEdit = (group: SupportGroup) => {
    setFormData({
      name: group.name,
      description: group.description,
      category: group.category,
      facilitator: group.facilitator,
      facilitatorBio: group.facilitatorBio || '',
      maxMembers: group.maxMembers,
      meetingSchedule: group.meetingSchedule,
      meetingType: group.meetingType,
      meetingLink: group.meetingLink || '',
      location: group.location || '',
      isActive: group.isActive,
      isPublic: group.isPublic,
      requirements: group.requirements?.join(', ') || '',
      tags: group.tags.join(', ')
    });
    setEditingGroup(group);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const groupData = {
        ...formData,
        requirements: formData.requirements.split(',').map(req => req.trim()).filter(Boolean),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      };

      let success = false;
      if (editingGroup) {
        success = await updateSupportGroup(editingGroup.id, groupData);
      } else {
        success = await addSupportGroup(groupData);
      }

      if (success) {
        resetForm();
      }
    } catch (error) {
      console.error('Error saving support group:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this support group?')) {
      await deleteSupportGroup(id);
    }
  };

  const toggleActive = async (group: SupportGroup) => {
    await updateSupportGroup(group.id, { isActive: !group.isActive });
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Support Group Management</h2>
          <p className="text-gray-600 text-sm sm:text-base">Manage support groups and community sessions</p>
        </div>
        <div className="flex gap-2 sm:gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1 sm:gap-2 bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 text-sm sm:text-base"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Add Group</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="flex items-center gap-1 sm:gap-2 bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Close</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border"
        >
          <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
            {editingGroup ? 'Edit Support Group' : 'Add New Support Group'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                  placeholder="Enter group name"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as SupportGroup['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                placeholder="Enter group description"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Facilitator
                </label>
                <input
                  type="text"
                  required
                  value={formData.facilitator}
                  onChange={(e) => setFormData({ ...formData, facilitator: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                  placeholder="Enter facilitator name"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Max Members
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.maxMembers}
                  onChange={(e) => setFormData({ ...formData, maxMembers: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Meeting Schedule
                </label>
                <input
                  type="text"
                  required
                  value={formData.meetingSchedule}
                  onChange={(e) => setFormData({ ...formData, meetingSchedule: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                  placeholder="e.g., Every Tuesday at 7:00 PM EST"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Meeting Type
                </label>
                <select
                  value={formData.meetingType}
                  onChange={(e) => setFormData({ ...formData, meetingType: e.target.value as SupportGroup['meetingType'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                >
                  <option value="online">Online</option>
                  <option value="in-person">In-Person</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>

            {(formData.meetingType === 'online' || formData.meetingType === 'hybrid') && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                  placeholder="https://meet.example.com/group-session"
                />
              </div>
            )}

            {(formData.meetingType === 'in-person' || formData.meetingType === 'hybrid') && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                  placeholder="Enter meeting location"
                />
              </div>
            )}

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Facilitator Bio (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.facilitatorBio}
                onChange={(e) => setFormData({ ...formData, facilitatorBio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                placeholder="Brief bio about the facilitator"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Requirements (comma separated)
              </label>
              <input
                type="text"
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                placeholder="18+ years old, Regular attendance, etc."
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
                placeholder="anxiety, support, weekly, etc."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-xs sm:text-sm text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.isPublic}
                  onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                  className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-xs sm:text-sm text-gray-700">
                  Public
                </label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1 sm:gap-2 bg-purple-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 text-sm sm:text-base"
              >
                <Save className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{editingGroup ? 'Update Group' : 'Create Group'}</span>
                <span className="sm:hidden">{editingGroup ? 'Update' : 'Create'}</span>
              </motion.button>
              
              <motion.button
                type="button"
                onClick={resetForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1 sm:gap-2 bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-300 text-sm sm:text-base"
              >
                <X className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Cancel</span>
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Support Groups List */}
      <div className="space-y-3 sm:space-y-4">
        {supportGroups.length === 0 ? (
          <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-lg px-4">
            <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">No support groups yet</h3>
            <p className="text-gray-600 text-sm sm:text-base">Create your first support group to get started.</p>
          </div>
        ) : (
          supportGroups.map((group) => {
            const category = categories.find(cat => cat.value === group.category);
            
            return (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{group.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${category?.color}`}>
                          {category?.label}
                        </span>
                        {!group.isActive && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            Inactive
                          </span>
                        )}
                        {!group.isPublic && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                            Private
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2 sm:mb-3 line-clamp-2 text-sm sm:text-base">{group.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3 sm:h-4 sm:w-4" />
                        {group.facilitator}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        {group.currentMembers}/{group.maxMembers}
                        <span className="hidden sm:inline">members</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">{group.meetingSchedule}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        {group.meetingType === 'online' ? (
                          <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
                        ) : (
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        )}
                        <span className="capitalize">{group.meetingType}</span>
                      </span>
                      {group.tags.length > 0 && (
                        <span className="flex items-center gap-1 max-w-full">
                          <Tag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="truncate">{group.tags.join(', ')}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-0 sm:ml-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleActive(group)}
                      className={`p-1.5 sm:p-2 rounded-lg ${group.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                      title={group.isActive ? 'Active' : 'Inactive'}
                    >
                      {group.isActive ? <Eye className="h-3 w-3 sm:h-4 sm:w-4" /> : <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(group)}
                      className="p-1.5 sm:p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                      title="Edit group"
                    >
                      <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(group.id)}
                      className="p-1.5 sm:p-2 rounded-lg text-red-600 hover:bg-red-50"
                      title="Delete group"
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SupportGroupManagement;
