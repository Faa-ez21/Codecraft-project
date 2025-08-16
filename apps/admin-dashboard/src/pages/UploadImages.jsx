import { useState, useRef, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import {
  Upload,
  Image as ImageIcon,
  X,
  Check,
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  Copy,
  FolderOpen,
  Grid,
  List,
  Filter,
  Search,
  RefreshCw,
  Plus,
  Maximize2,
  Edit3,
  Share2,
  CheckCircle,
  Clock,
  AlertCircle,
  Zap,
  Monitor,
  Smartphone,
  Camera,
  Layers,
  Tag,
} from "lucide-react";

export default function UploadImages() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const fileInputRef = useRef(null);
  const dragRef = useRef(null);

  const categories = [
    { value: "all", label: "All Images" },
    { value: "products", label: "Product Images" },
    { value: "banners", label: "Banner Images" },
    { value: "profiles", label: "Profile Images" },
    { value: "gallery", label: "Gallery Images" },
  ];

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const fetchUploadedImages = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.storage
        .from("product-images")
        .list("uploads", {
          limit: 100,
          offset: 0,
        });

      if (error) {
        showNotification("Failed to fetch images", "error");
      } else {
        const imagesWithUrls = data
          .filter((file) => file.name !== ".emptyFolderPlaceholder")
          .map((file) => {
            const { data: urlData } = supabase.storage
              .from("product-images")
              .getPublicUrl(`uploads/${file.name}`);

            return {
              ...file,
              url: urlData.publicUrl,
              category: "products", // Default category
              uploaded_at: file.created_at || new Date().toISOString(),
            };
          });

        setUploadedImages(imagesWithUrls);
      }
    } catch (err) {
      showNotification("An error occurred while fetching images", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const imageFiles = droppedFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== droppedFiles.length) {
      showNotification("Only image files are allowed", "error");
    }

    setFiles((prev) => [
      ...prev,
      ...imageFiles.map((file) => ({
        file,
        id: uuidv4(),
        preview: URL.createObjectURL(file),
        status: "pending",
      })),
    ]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [
      ...prev,
      ...selectedFiles.map((file) => ({
        file,
        id: uuidv4(),
        preview: URL.createObjectURL(file),
        status: "pending",
      })),
    ]);
  };

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      showNotification("Please select files to upload", "error");
      return;
    }

    setUploading(true);
    const uploadPromises = files.map(async (fileObj) => {
      const { file, id } = fileObj;

      setUploadProgress((prev) => ({ ...prev, [id]: 0 }));

      try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, file);

        if (uploadError) {
          setFiles((prev) =>
            prev.map((f) =>
              f.id === id
                ? { ...f, status: "error", error: uploadError.message }
                : f
            )
          );
          return null;
        }

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: "success", url: data.publicUrl } : f
          )
        );

        setUploadProgress((prev) => ({ ...prev, [id]: 100 }));

        return {
          name: fileName,
          url: data.publicUrl,
          size: file.size,
          category: selectedCategory === "all" ? "products" : selectedCategory,
          uploaded_at: new Date().toISOString(),
        };
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === id ? { ...f, status: "error", error: error.message } : f
          )
        );
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(Boolean);

    setUploading(false);

    if (successfulUploads.length > 0) {
      showNotification(
        `${successfulUploads.length} image(s) uploaded successfully!`
      );
      setUploadedImages((prev) => [...successfulUploads, ...prev]);
      setFiles([]);
      setUploadProgress({});
    }
  };

  const copyUrl = (url) => {
    navigator.clipboard.writeText(url);
    showNotification("URL copied to clipboard!");
  };

  const deleteImage = async (imageName) => {
    try {
      const { error } = await supabase.storage
        .from("product-images")
        .remove([`uploads/${imageName}`]);

      if (error) {
        showNotification("Failed to delete image", "error");
      } else {
        setUploadedImages((prev) =>
          prev.filter((img) => img.name !== imageName)
        );
        showNotification("Image deleted successfully");
      }
    } catch (err) {
      showNotification("An error occurred while deleting", "error");
    }
  };

  const filteredImages = uploadedImages.filter((image) => {
    const matchesSearch = image.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Image Management
            </h1>
            <p className="text-gray-600 mt-1">
              Upload, organize, and manage your product images
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Images
            </button>

            <button
              onClick={fetchUploadedImages}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-white/50 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Notification */}
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              notification.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Upload Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Upload className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Upload New Images
            </h2>
          </div>

          {/* Drag & Drop Zone */}
          <div
            ref={dragRef}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }`}
          >
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-full w-fit mx-auto">
                <ImageIcon className="w-12 h-12 text-gray-400" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  Drop images here or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Support for JPG, PNG, GIF up to 10MB each
                </p>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Selected Files Preview */}
          {files.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Selected Files ({files.length})
                </h3>
                <button
                  onClick={uploadFiles}
                  disabled={uploading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {uploading ? "Uploading..." : "Upload All"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((fileObj) => (
                  <div
                    key={fileObj.id}
                    className="bg-white rounded-lg border p-4"
                  >
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <img
                        src={fileObj.preview}
                        alt={fileObj.file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {fileObj.file.name}
                        </p>
                        <button
                          onClick={() => removeFile(fileObj.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileObj.file.size)}
                      </p>

                      {fileObj.status === "pending" &&
                        uploadProgress[fileObj.id] !== undefined && (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${uploadProgress[fileObj.id]}%`,
                              }}
                            />
                          </div>
                        )}

                      {fileObj.status === "success" && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Check className="w-4 h-4" />
                          <span className="text-xs">Uploaded</span>
                        </div>
                      )}

                      {fileObj.status === "error" && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-xs">Failed</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Gallery Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Image Gallery
                </h2>
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                  {filteredImages.length} images
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search images..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>

                <div className="flex items-center border border-gray-200 rounded-lg">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 ${
                      viewMode === "grid"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 ${
                      viewMode === "list"
                        ? "bg-blue-100 text-blue-600"
                        : "text-gray-400"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Images Grid/List */}
          {filteredImages.length > 0 ? (
            <div className="p-6">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredImages.map((image, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-lg border overflow-hidden group hover:shadow-lg transition-all"
                    >
                      <div className="aspect-video bg-gray-100 overflow-hidden relative">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setSelectedImage(image);
                              setShowPreview(true);
                            }}
                            className="p-2 bg-white/90 text-gray-700 rounded-lg hover:bg-white transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 truncate mb-2">
                          {image.name}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                          <span>
                            {formatFileSize(image.metadata?.size || 0)}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {image.category}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyUrl(image.url)}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                            <span className="text-xs">Copy URL</span>
                          </button>
                          <button
                            onClick={() => deleteImage(image.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredImages.map((image, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:shadow-md transition-shadow"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={image.url}
                          alt={image.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">
                          {image.name}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                          <span>
                            {formatFileSize(image.metadata?.size || 0)}
                          </span>
                          <span>
                            Uploaded{" "}
                            {new Date(image.uploaded_at).toLocaleDateString()}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                            {image.category}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedImage(image);
                            setShowPreview(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => copyUrl(image.url)}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteImage(image.name)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Images Found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== "all"
                  ? "No images match your current filters."
                  : "Start by uploading your first image."}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Upload Images
              </button>
            </div>
          )}
        </div>

        {/* Image Preview Modal */}
        {showPreview && selectedImage && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedImage.name}
                </h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-6">
                  <img
                    src={selectedImage.url}
                    alt={selectedImage.name}
                    className="w-full h-auto max-h-96 object-contain mx-auto"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Image Details
                    </h4>
                    <div className="space-y-2 text-gray-600">
                      <div>File name: {selectedImage.name}</div>
                      <div>
                        Size:{" "}
                        {formatFileSize(selectedImage.metadata?.size || 0)}
                      </div>
                      <div>Category: {selectedImage.category}</div>
                      <div>
                        Uploaded:{" "}
                        {new Date(
                          selectedImage.uploaded_at
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => copyUrl(selectedImage.url)}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Copy URL
                      </button>
                      <a
                        href={selectedImage.url}
                        download
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
