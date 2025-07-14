import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Star, 
  Calendar,
  Tag,
  Save,
  X,
  ExternalLink
} from 'lucide-react';
import { useAdmin, Resource } from '../../context/AdminContext';

export const ResourceManagement: React.FC = () => {
  const { 
    resources, 
    addResource, 
    updateResource, 
    deleteResource,
    isLoading 
  } = useAdmin();
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'self-care' as Resource['category'],
    type: 'article' as Resource['type'],
    url: '',
    imageUrl: '',
    tags: '',
    isPublished: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const resourceData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    let success = false;
    if (editingResource) {
      success = await updateResource(editingResource.id, resourceData);
    } else {
      success = await addResource(resourceData);
    }

    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      category: 'self-care',
      type: 'article',
      url: '',
      imageUrl: '',
      tags: '',
      isPublished: true
    });
    setShowAddForm(false);
    setEditingResource(null);
  };

  const handleEdit = (resource: Resource) => {
    setFormData({
      title: resource.title,
      description: resource.description,
      content: resource.content,
      category: resource.category,
      type: resource.type,
      url: resource.url || '',
      imageUrl: resource.imageUrl || '',
      tags: resource.tags.join(', '),
      isPublished: resource.isPublished
    });
    setEditingResource(resource);
    setShowAddForm(true);
  };

  const handleDelete = async (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      await deleteResource(resourceId);
    }
  };

  const togglePublished = async (resource: Resource) => {
    await updateResource(resource.id, { isPublished: !resource.isPublished });
  };

  const categories = [
    { value: 'self-care', label: 'Self Care', color: 'bg-green-100 text-green-800' },
    { value: 'therapy', label: 'Therapy', color: 'bg-blue-100 text-blue-800' },
    { value: 'crisis', label: 'Crisis Support', color: 'bg-red-100 text-red-800' },
    { value: 'education', label: 'Education', color: 'bg-purple-100 text-purple-800' },
    { value: 'tools', label: 'Tools', color: 'bg-orange-100 text-orange-800' }
  ];

  const types = [
    { value: 'article', label: 'Article' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'pdf', label: 'PDF' },
    { value: 'external-link', label: 'External Link' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
          <p className="text-gray-600">Manage mental health resources and educational content</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" />
          Add Resource
        </motion.button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 border"
        >
          <h3 className="text-lg font-semibold mb-4">
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter resource title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as Resource['category'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                required
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                placeholder="Brief description of the resource"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                required
                rows={4}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                placeholder="Detailed content of the resource"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as Resource['type'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                >
                  {types.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                Publish immediately
              </label>
            </div>

            <div className="flex gap-3">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {editingResource ? 'Update Resource' : 'Create Resource'}
              </motion.button>
              
              <motion.button
                type="button"
                onClick={resetForm}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                <X className="h-4 w-4" />
                Cancel
              </motion.button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Resources List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No resources yet</h3>
            <p className="text-gray-600">Create your first resource to get started.</p>
          </div>
        ) : (
          resources.map((resource) => {
            const category = categories.find(cat => cat.value === resource.category);
            
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {resource.imageUrl && (
                  <img 
                    src={resource.imageUrl} 
                    alt={resource.title}
                    className="w-full h-32 object-cover"
                  />
                )}
                
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${category?.color}`}>
                      {category?.label}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      {resource.type}
                    </span>
                    {!resource.isPublished && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                        Draft
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {resource.views} views
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {resource.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  {resource.url && (
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm mb-3"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View Resource
                    </a>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => togglePublished(resource)}
                        className={`p-1 rounded ${resource.isPublished ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                        title={resource.isPublished ? 'Published' : 'Unpublished'}
                      >
                        {resource.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEdit(resource)}
                        className="p-1 rounded text-blue-600 hover:bg-blue-50"
                        title="Edit resource"
                      >
                        <Edit className="h-4 w-4" />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDelete(resource.id)}
                        className="p-1 rounded text-red-600 hover:bg-red-50"
                        title="Delete resource"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                    
                    {resource.tags.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Tag className="h-3 w-3" />
                        <span className="truncate">{resource.tags.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
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
