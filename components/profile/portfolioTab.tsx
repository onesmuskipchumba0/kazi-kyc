"use client"
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import UserDebugInfo from '../UserDebugInfo';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  location: string;
  created_at: string;
  user_id: string;
}

interface FormData {
  title: string;
  description: string;
  imageUrl: string;
  location: string;
}

const PortfolioTab: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    imageUrl: '',
    location: ''
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Fetch portfolio items
  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data.portfolioItems || []);
      } else {
        toast.error('Failed to fetch portfolio items');
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      toast.error('Error fetching portfolio items');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  // Cleanup preview URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.length > 100) {
      newErrors.location = 'Location must be less than 100 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image selection and preview
  const handleImageSelect = (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setSelectedFile(file);
    
    // Clear any previous image URL from form data
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  // Handle image upload to server
  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await fetch('/api/portfolio/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
        toast.success('Image uploaded successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we have a selected file but haven't uploaded it yet
    if (selectedFile && !formData.imageUrl) {
      toast.error('Please upload the selected image before submitting');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      const url = isEditing ? '/api/portfolio' : '/api/portfolio';
      const method = isEditing ? 'PUT' : 'POST';
      const body = isEditing 
        ? { id: editingId, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast.success(isEditing ? 'Portfolio item updated successfully' : 'Portfolio item created successfully');
        setIsModalOpen(false);
        resetForm();
        fetchPortfolioItems();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Operation failed');
        console.error('API Error:', error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Operation failed');
    }
  };

  // Handle edit
  const handleEdit = (item: PortfolioItem) => {
    setFormData({
      title: item.title,
      description: item.description,
      imageUrl: item.image_url,
      location: item.location
    });
    setImagePreview(item.image_url);
    setSelectedFile(null); // Clear selected file for editing
    setIsEditing(true);
    setEditingId(item.id);
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Portfolio item deleted successfully');
        fetchPortfolioItems();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Delete failed');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Delete failed');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      location: ''
    });
    setErrors({});
    setImagePreview(null);
    setSelectedFile(null);
    setIsEditing(false);
    setEditingId(null);
  };

  // Open modal for creating new item
  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Portfolio</h2>
        <button
          onClick={openCreateModal}
          className="btn btn-primary gap-2"
        >
          <Plus size={20} />
          Add Portfolio Item
        </button>
      </div>

      {/* Debug Info - Remove this after fixing the issue */}
      <div className="mb-6">
        <UserDebugInfo />
      </div>

      {portfolioItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <Upload size={48} className="mx-auto mb-2" />
            <p>No portfolio items yet</p>
            <p className="text-sm">Click "Add Portfolio Item" to get started</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolioItems.map((item) => (
            <div key={item.id} className="card bg-base-100 shadow-md overflow-hidden">
              <figure>
                <img 
                  src={item.image_url} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title">{item.title}</h3>
                <p>{item.description}</p>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>{item.location}</span>
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                </div>
                <div className="card-actions justify-end mt-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="btn btn-sm btn-outline btn-primary gap-1"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn btn-sm btn-outline btn-error gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box w-11/12 max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                {isEditing ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-circle btn-ghost"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Title *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter project title"
                  className={`input input-bordered ${errors.title ? 'input-error' : ''}`}
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                {errors.title && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.title}</span>
                  </label>
                )}
              </div>

              {/* Description */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Description *</span>
                </label>
                <textarea
                  placeholder="Describe your project"
                  className={`textarea textarea-bordered h-24 ${errors.description ? 'textarea-error' : ''}`}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                {errors.description && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.description}</span>
                  </label>
                )}
              </div>

              {/* Image Upload */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Project Image *</span>
                </label>
                
                {/* File Input */}
                <div className="flex gap-2 mb-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="file-input file-input-bordered flex-1"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageSelect(file);
                    }}
                    disabled={isUploading}
                  />
                  {selectedFile && !formData.imageUrl && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      className="btn btn-primary btn-sm"
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="loading loading-spinner loading-sm"></div>
                      ) : (
                        'Upload'
                      )}
                    </button>
                  )}
                </div>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                    />
                    {selectedFile && !formData.imageUrl && (
                      <p className="text-sm text-warning mt-1">
                        ⚠️ Please click "Upload" to upload this image before submitting
                      </p>
                    )}
                    {formData.imageUrl && (
                      <p className="text-sm text-success mt-1">
                        ✅ Image uploaded successfully
                      </p>
                    )}
                  </div>
                )}

                {errors.imageUrl && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.imageUrl}</span>
                  </label>
                )}
              </div>

              {/* Location */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location *</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter project location"
                  className={`input input-bordered ${errors.location ? 'input-error' : ''}`}
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
                {errors.location && (
                  <label className="label">
                    <span className="label-text-alt text-error">{errors.location}</span>
                  </label>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="modal-action">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isUploading}
                >
                  {isEditing ? 'Update' : 'Create'} Portfolio Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioTab;