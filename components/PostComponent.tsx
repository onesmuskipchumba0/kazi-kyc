"use client";

import { useState, ChangeEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import { Upload } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type PostComponentProps = {
  userId: string;
  modalId: string; // 👈 DaisyUI modal id
};

export default function PostComponent({ userId, modalId }: PostComponentProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    if (e.target.files.length + images.length > 2) {
      alert("Maximum 2 images allowed");
      return;
    }
    if (e.target.files) {
      setImages((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handlePost = async () => {
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

      // Upload images
      for (const file of images) {
        const filePath = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("post_images")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("post_images")
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrlData.publicUrl);
      }

      // Insert post
      const { error: insertError } = await supabase.from("posts").insert([
        {
          title,
          description,
          imageURL: uploadedUrls,
          likes: 0,
          comments: 0,
          shares: 0,
          userId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      // Reset form
      setTitle("");
      setDescription("");
      setImages([]);

      // Close modal via DaisyUI checkbox
      (document.getElementById(modalId) as HTMLInputElement).checked = false;
    } catch (err: any) {
      console.error("Error posting:", err.message);
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
          <h2 className="text-xl font-semibold mb-4">New Post</h2>

          <input
            type="text"
            placeholder="Title"
            className="input input-bordered w-full mb-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            className="textarea textarea-bordered w-full mb-3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label className="btn btn-outline w-full mb-3 flex items-center gap-2">
            <Upload size={18} /> Upload Images (Max 2)
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleImageChange}
            />
          </label>

          <div className="flex gap-2 flex-wrap mb-3">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>

          <div className="modal-action">
            <button
              className={`btn btn-primary ${loading ? "loading" : ""}`}
              onClick={handlePost}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
            <label htmlFor={modalId} className="btn">
              Cancel
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
