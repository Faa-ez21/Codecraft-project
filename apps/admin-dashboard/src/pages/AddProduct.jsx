import { useState } from "react";
import Select from "react-select";

export default function AddProduct() {
  const [preview, setPreview] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      materials,
      colors,
      sizes,
    };
    console.log("Product Data:", productData);
  };

  // Options for dropdowns
  const materialOptions = [
    { value: "Wood", label: "Wood" },
    { value: "Metal", label: "Metal" },
    { value: "Glass", label: "Glass" },
    { value: "Plastic", label: "Plastic" },
  ];

  const colorOptions = [
    { value: "Black", label: "Black" },
    { value: "White", label: "White" },
    { value: "Brown", label: "Brown" },
    { value: "Gray", label: "Gray" },
  ];

  const sizeOptions = [
    { value: "Small", label: "Small" },
    { value: "Medium", label: "Medium" },
    { value: "Large", label: "Large" },
    { value: "Extra Large", label: "Extra Large" },
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Product Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full text-sm text-gray-700 dark:text-gray-200"
          />
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="mt-2 h-32 object-cover rounded border"
            />
          )}
        </div>

        {/* Text Inputs */}
        {["Product Name", "Description", "Quantity", "Category", "Subcategory", "Weight", "Dimensions", "SKU", "Barcode", "Status"].map((label) => (
          <div key={label}>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              {label}
            </label>
            <input
              type="text"
              placeholder={`Enter ${label.toLowerCase()}`}
              className="w-full px-3 py-2 rounded bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"
            />
          </div>
        ))}

        {/* Multi-select Dropdowns */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Material
          </label>
          <Select
            isMulti
            options={materialOptions}
            value={materials}
            onChange={setMaterials}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Color
          </label>
          <Select
            isMulti
            options={colorOptions}
            value={colors}
            onChange={setColors}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
            Size
          </label>
          <Select
            isMulti
            options={sizeOptions}
            value={sizes}
            onChange={setSizes}
            className="react-select-container"
            classNamePrefix="react-select"
          />
        </div>

        <button
          type="submit"
          className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded font-medium"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
