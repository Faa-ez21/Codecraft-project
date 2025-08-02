import { useParams } from "react-router-dom";
import { useState } from "react";
import Select from "react-select";

export default function EditProduct() {
  const { id } = useParams();
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", { materials, colors, sizes });
  };

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

  const fields = ["Product Name", "Description", "Price (GHS)", "Stock Quantity", "Category", "Image URL"];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          Edit Product (ID: {id})
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map((label) => (
            <div key={label}>
              <label className="block text-sm font-semibold mb-1 text-gray-700 dark:text-gray-200">
                {label}
              </label>
              <input
                type="text"
                placeholder={`Enter ${label.toLowerCase()}`}
                className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-lime-500"
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
            className="bg-lime-500 hover:bg-lime-600 text-white px-6 py-2 rounded-lg font-medium shadow transition duration-200"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}
