"use client";

import { useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Upload, X } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";

type PostComponentProps = {
  userId: string;
  modalId: string; // 👈 DaisyUI modal id
};

interface FormData {
  title: string;
  description: string;
  imageUrl: string[];
}

export default function PostComponent({ userId, modalId }: PostComponentProps) {
  const { getToken } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    imageUrl: [],
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    if (formData.imageUrl.length === 0 && selectedFiles.length === 0) {
      newErrors.imageUrl = ["At least one image is required"];
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle image selection and preview
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileArr = Array.from(e.target.files);
    if (fileArr.length > 2) {
      toast.error("Maximum 2 images allowed");
      return;
    }
    setSelectedFiles(fileArr);
    setImagePreview(URL.createObjectURL(fileArr[0]));
    setFormData(prev => ({ ...prev, imageUrl: [] }));
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select images first");
      return;
    }
    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/posts/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Upload failed');
        }

        const data = await response.json();
        uploadedUrls.push(data.url);
      }

      setFormData(prev => ({
        ...prev,
        imageUrl: uploadedUrls
      }));

      toast.success("Images uploaded successfully!");
    } catch (error: any) {
      console.error("Error uploading images:", error);
      toast.error(error.message || "Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length > 0 && formData.imageUrl.length === 0) {
      toast.error("Please upload the selected images before posting");
      return;
    }
    if (!validateForm()) {
      toast.error("Please fix the errors before posting");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          imageURL: formData.imageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create post');
      }

      // Reset form and close modal after successful post
      setFormData({ title: "", description: "", imageUrl: [] });
      setSelectedFiles([]);
      setImagePreview(null);
      setErrors({});
      
      // Close the modal
      const modalCheckbox = document.getElementById(modalId) as HTMLInputElement;
      if (modalCheckbox) modalCheckbox.checked = false;
      
      toast.success("Post created successfully!");
    } catch (err: any) {
      console.error("An error occurred while posting:", err);
      toast.error("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* DaisyUI modal toggle */}
      <input type="checkbox" id={modalId} className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">New Post</h2>
            <label htmlFor={modalId} className="btn btn-sm btn-circle btn-ghost">
              <X size={20} />
            </label>
          </div>

          <form onSubmit={handlePost} className="space-y-4">
            {/* Title */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title *</span>
              </label>
              <input
                type="text"
                placeholder="Enter post title"
                className={`input input-bordered ${errors.title ? "input-error" : ""}`}
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
              {errors.title && <label className="label text-error">{errors.title}</label>}
            </div>

            {/* Description */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description *</span>
              </label>
              <textarea
                placeholder="Describe your post"
                className={`textarea textarea-bordered h-24 ${errors.description ? "textarea-error" : ""}`}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
              {errors.description && <label className="label text-error">{errors.description}</label>}
            </div>

            {/* Image Upload */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Images *</span>
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="file-input file-input-bordered flex-1"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
                {selectedFiles.length > 0 && formData.imageUrl.length === 0 && (
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={handleImageUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? "Uploading..." : "Upload Images"}
                  </button>
                )}
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="preview"
                  className="w-32 h-32 object-cover rounded mb-2"
                />
              )}
              {errors.imageUrl && <label className="label text-error">{errors.imageUrl}</label>}
            </div>

            {/* Submit Buttons */}
            <div className="modal-action">
              <label htmlFor={modalId} className="btn btn-ghost">
                Cancel
              </label>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading || isUploading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
