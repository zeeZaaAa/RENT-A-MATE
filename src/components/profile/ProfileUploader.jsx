import { useState } from "react";
import api from "../../api/apiClient";

export default function ProfileUploader({ initialImage, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialImage || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    if (selected.size > 5 * 1024 * 1024) {
      setError("File size should be 5MB or less");
      return;
    }

    if (!selected.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setError("");
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const uploadFile = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/profile/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newPic = res.data.pic.secure_url;
      setPreview(newPic);
      setFile(null);

      if (onUploadSuccess) onUploadSuccess(res.data.pic);

      alert("Upload successful!");
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center backdrop-blur-sm transition-transform hover:scale-[1.02]">
        {/* Preview */}
        <div
          className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-blue-200 mb-5 shadow-lg"
          role="img"
          aria-label="Profile preview"
        >
          <img
            src={preview}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* File input */}
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100
                     mb-4 transition-colors"
        />

        {/* Error message */}
        {error && (
          <p className="text-red-600 text-sm mb-3 text-center" role="alert">
            {error}
          </p>
        )}

        {/* Upload button */}
        <button
          onClick={uploadFile}
          disabled={loading || !file}
          className={`w-full py-3 rounded-full text-white font-semibold text-sm sm:text-base transition-colors
            ${loading || !file
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
}
