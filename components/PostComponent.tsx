"use client";

import { useState, ChangeEvent } from "react";
import { createClient } from "@supabase/supabase-js";
import { Plus, Upload } from "lucide-react";
import { FaTimes } from "react-icons/fa";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

type PostComponentProps = {
  userId: string;
};

export default function PostComponent({ userId }: PostComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
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
    setImages((prev) => [...prev, ...Array.from(e.target.files as FileList)]);
  };

  const handlePost = async () => {
    if (!title || !description) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

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

      setTitle("");
      setDescription("");
      setImages([]);
      setIsOpen(false);
    } catch (err: any) {
      console.error("Error posting:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button className="btn btn-primary flex items-center gap-2" onClick={() => setIsOpen(true)}>
        <Plus size={18} /> Create Post
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">New Post</h2>
              <button onClick={() => setIsOpen(false)}>
                <FaTimes />
              </button>
            </div>

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
              <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
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

            <button
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              onClick={handlePost}
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}