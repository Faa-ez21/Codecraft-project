import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";
import { uploadImage } from "../lib/imageUpload";
import {
  Upload,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Package,
  DollarSign,
  Hash,
  FileText,
  Layers,
  Palette,
  Tag,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

export default function AddProduct({ productId = null }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    subcategory: "",
    image_url: "",
    additional_images: [],
    materials: [],
    colors: [],
    sku: uuidv4().slice(0, 8),
    status: "active",
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    if (productId) {
      fetchProductData(productId);
    }
  }, [productId]);

  const fetchCategories = async () => {
    const { data: cats, error } = await supabase.from("categories").select("*");
    if (!error) setCategories(cats);
  };

  const fetchProductData = async (id) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (data && !error) {
      setForm({
        ...data,
        category: data.category_id,
        subcategory: data.subcategory_id,
        materials: data.materials || [],
        colors: data.colors || [],
        additional_images: data.additional_images || [],
      });

      // Set up image previews
      const previews = [];
      if (data.image_url) previews.push(data.image_url);
      if (
        data.additional_images &&
        Array.isArray(data.additional_images) &&
        data.additional_images.length > 0
      ) {
        // Limit to prevent excessive images
        const validAdditionalImages = data.additional_images.slice(0, 4);
        previews.push(...validAdditionalImages);
      }
      console.log("Setting up image previews:", previews);
      setImagePreviews(previews);
    } else {
      toast.error("Error fetching product.");
    }
  };

  // Handle multiple image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Limit to 5 images total
    const maxImages = 5;
    const currentImageCount = imagePreviews.length;
    const remainingSlots = maxImages - currentImageCount;

    if (files.length > remainingSlots) {
      toast.warning(
        `You can only add ${remainingSlots} more image(s). Maximum ${maxImages} images allowed.`
      );
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image file.`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error(`${file.name} is too large. Maximum file size is 5MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    // Add new files to the existing array
    setImageFiles((prev) => [...prev, ...validFiles]);

    // Create previews for new files
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews((prev) => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image at specific index
  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Set main image (move to first position)
  const setAsMainImage = (index) => {
    if (index === 0) return; // Already main image

    setImagePreviews((prev) => {
      const newPreviews = [...prev];
      const mainImage = newPreviews.splice(index, 1)[0];
      return [mainImage, ...newPreviews];
    });

    setImageFiles((prev) => {
      const newFiles = [...prev];
      const mainFile = newFiles.splice(index, 1)[0];
      return [mainFile, ...newFiles];
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.price || parseFloat(form.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!form.stock_quantity || parseInt(form.stock_quantity) < 0)
      newErrors.stock_quantity = "Valid stock quantity is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.subcategory) newErrors.subcategory = "Subcategory is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    if (imagePreviews.length === 0) {
      toast.error("Please add at least one product image.");
      return;
    }

    setLoading(true);
    setUploadingImages(true);

    try {
      // Upload all images
      const uploadedImages = [];

      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        if (file) {
          toast.info(`Uploading image ${i + 1} of ${imageFiles.length}...`);
          const imageUrl = await uploadImage(file);
          uploadedImages.push(imageUrl);
        }
      }

      // For existing images (when editing), keep URLs that are already uploaded
      const existingImageUrls = imagePreviews.filter(
        (preview) => typeof preview === "string" && preview.startsWith("http")
      );

      const allImageUrls = [...existingImageUrls, ...uploadedImages];
      const mainImageUrl = allImageUrls[0]; // First image is main
      const additionalImages = allImageUrls.slice(1, 5); // Limit to 4 additional images max

      console.log("Final image URLs:", { mainImageUrl, additionalImages });

      const productPayload = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        image_url: mainImageUrl,
        additional_images: additionalImages,
        materials: form.materials,
        colors: form.colors,
        category_id: form.category,
        subcategory_id: form.subcategory,
        sku: form.sku || uuidv4().slice(0, 8),
        status: form.status || "active",
        created_at: new Date().toISOString(),
      };

      if (productId) {
        const { error } = await supabase
          .from("products")
          .update(productPayload)
          .eq("id", productId);
        if (error) throw error;
        toast.success("Product updated successfully!");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([productPayload]);
        if (error) throw error;
        toast.success("Product added successfully!");
      }

      // Navigate back to products list
      setTimeout(() => {
        navigate("/products");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred. Please check inputs.");
    } finally {
      setLoading(false);
      setUploadingImages(false);
    }
  };

  useEffect(() => {
    const fetchSubcategories = async () => {
      const selectedCategory = form.category;
      if (selectedCategory) {
        const { data: subcats } = await supabase
          .from("subcategories")
          .select("*")
          .eq("category_id", selectedCategory);
        setSubcategories(subcats);
      }
    };

    if (form.category) {
      fetchSubcategories();
    } else {
      setSubcategories([]);
    }
  }, [form.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMultiSelectChange = (name, values) => {
    setForm((prev) => ({
      ...prev,
      [name]: values
        .split(",")
        .map((v) => v.trim())
        .filter((v) => v.length > 0),
    }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/products")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {productId ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {productId
              ? "Update product information and details"
              : "Create a new product for your store"}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Product Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Package className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Basic Information
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className={`w-full px-4 py-3 border ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe your product..."
                  rows={4}
                  className={`w-full px-4 py-3 border ${
                    errors.description
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 resize-none`}
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Price (GH₵) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={`w-full px-4 py-3 border ${
                      errors.price
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-600"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700`}
                    required
                  />
                  {errors.price && (
                    <p className="text-red-500 text-xs mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Hash className="w-4 h-4 inline mr-1" />
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={form.stock_quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className={`w-full px-4 py-3 border ${
                      errors.stock_quantity
                        ? "border-red-500"
                        : "border-gray-200 dark:border-gray-600"
                    } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700`}
                    required
                  />
                  {errors.stock_quantity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.stock_quantity}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Tag className="w-4 h-4 inline mr-1" />
                  SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="Auto-generated"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Layers className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Categories
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.category
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700`}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-xs mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subcategory *
                </label>
                <select
                  name="subcategory"
                  value={form.subcategory}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border ${
                    errors.subcategory
                      ? "border-red-500"
                      : "border-gray-200 dark:border-gray-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700`}
                  required
                  disabled={!form.category}
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
                {errors.subcategory && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.subcategory}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Product Attributes */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <Palette className="w-5 h-5 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Product Attributes
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Materials (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Wood, Metal, Fabric"
                  value={form.materials.join(", ")}
                  onChange={(e) =>
                    handleMultiSelectChange("materials", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Colors (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Black, White, Brown"
                  value={form.colors.join(", ")}
                  onChange={(e) =>
                    handleMultiSelectChange("colors", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Product Images */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-orange-600" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Product Images
                </h2>
              </div>
              <span className="text-sm text-gray-500">
                {imagePreviews.length}/5 images
              </span>
            </div>

            <div className="space-y-6">
              {/* Image Previews Grid */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Product preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-xl border-2 border-gray-200 dark:border-gray-600"
                      />

                      {/* Main Image Badge */}
                      {index === 0 && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Main
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                        {index !== 0 && (
                          <button
                            type="button"
                            onClick={() => setAsMainImage(index)}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                            title="Set as main image"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          title="Remove image"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Area */}
              {imagePreviews.length < 5 && (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB each. Maximum 5 images.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      First image will be the main product image
                    </p>
                  </label>
                </div>
              )}

              {uploadingImages && (
                <div className="flex items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500 mr-3"></div>
                  <span className="text-sm text-gray-600">
                    Uploading images...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Product Status */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Status
              </h2>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={form.status === "active"}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Active
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Product will be visible to customers
                  </p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={form.status === "inactive"}
                  onChange={handleChange}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Inactive
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Product will be hidden from customers
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-yellow-500 text-white rounded-xl hover:from-green-600 hover:to-yellow-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {loading
                  ? "Saving..."
                  : productId
                  ? "Update Product"
                  : "Save Product"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/products")}
                className="w-full px-6 py-3 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
