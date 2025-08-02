import { Link, useNavigate } from "react-router-dom";

const products = [
  {
    id: 1,
    image: "/pics/sofa.png",
    alt: "Modern Sofa",
    title: "Product List",
    description: "Manage your products, inventory, and variants.",
    link: "/product-list",
    button: "View",
  },
  {
    id: 2,
    image: "/pics/desk2.jpg",
    alt: "Wooden Bench",
    title: "Add Product",
    description: "Add a new product to your store.",
    link: "/add-product",
    button: "Add",
  },
  {
    id: 3,
    image: "/pics/desk.jpg",
    alt: "Rattan Settee",
    title: "Edit Product",
    description: "Edit an existing product in your store.",
    link: "/edit-product/1",
    button: "Edit",
  },
];

export default function Products() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-10 text-gray-800 dark:text-white tracking-tight">
        Products
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-center"
          >
            {/* Enlarged Image */}
            <div className="w-full h-[220px] overflow-hidden rounded-xl mb-4">
              <img
                src={product.image}
                alt={product.alt}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Title and Description */}
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
              {product.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              {product.description}
            </p>

            {/* Subtle Button Under Image */}
            {product.title === "Edit Product" ? (
              <button
                onClick={() => navigate(product.link)}
                className="text-green-700 dark:text-green-400 text-sm hover:underline bg-transparent shadow-none"
              >
                {product.button}
              </button>
            ) : (
              <Link
                to={product.link}
                className="text-green-700 dark:text-green-400 text-sm hover:underline bg-transparent shadow-none"
              >
                {product.button}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
