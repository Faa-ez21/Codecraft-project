// src/components/StatCard.jsx
export default function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 flex items-center gap-4">
      <div className={`p-4 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold">{value}</h2>
      </div>
    </div>
  );
}
