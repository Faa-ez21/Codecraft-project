// src/pages/Discounts.jsx
import { Link } from "react-router-dom";

const discounts = [
  {
    name: "Summer Sale",
    code: "SUMMER20",
    type: "Percentage",
    value: "20%",
    startDate: "2023-06-01",
    endDate: "2023-08-31",
    status: "Active",
  },
  {
    name: "Back to School",
    code: "SCHOOL15",
    type: "Percentage",
    value: "15%",
    startDate: "2023-08-15",
    endDate: "2023-09-30",
    status: "Active",
  },
];

export default function Discounts() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Discounts</h1>
        <Link
          to="/discounts/create"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        >
          New Discount
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto text-left text-sm">
          <thead className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3">Name</th>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr
                key={d.code}
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <td className="p-3">{d.name}</td>
                <td>{d.code}</td>
                <td>{d.type}</td>
                <td>{d.value}</td>
                <td>{d.startDate}</td>
                <td>{d.endDate}</td>
                <td>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                    {d.status}
                  </span>
                </td>
                <td className="text-right">
                  <Link
                    to={`/discounts/edit/${d.code}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
