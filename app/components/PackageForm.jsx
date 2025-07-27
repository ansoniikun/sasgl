import { useState } from "react";

const TOGGLE_OPTIONS = [
  "Golf Cart",
  "Green Fee",
  "Golf Shirt",
  "Golf Cap / Hat",
  "Watering Hole Access",
  "Caddy Services",
  "Breakfast / Morning Snack",
  "Beverage Voucher (e.g. beer/gin)",
  "Dinner / Prize-Giving Meal",
  "Event Welcome Pack",
  "Marketing Activations",
  "Banner Advertising",
];

const PackageForm = ({ packageIndex, onSubmit }) => {
  const [form, setForm] = useState({
    title: "",
    type: "",
    maxSlots: 1,
    price: "",
    includes: {},
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (item) => {
    setForm((prev) => ({
      ...prev,
      includes: {
        ...prev.includes,
        [item]: !prev.includes[item],
      },
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-6">Package {packageIndex + 1}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Package Title *
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. 1 Ball"
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Package Type *
          </label>
          <input
            name="type"
            value={form.type}
            onChange={handleChange}
            placeholder='"Standard", "Sponsorship" etc.'
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            required
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Max Slots *
          </label>
          <select
            name="maxSlots"
            value={form.maxSlots}
            onChange={handleChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          >
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-1">
            Price (R) *
          </label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="e.g. R8000"
            className="border border-gray-300 rounded px-3 py-2 text-sm"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Packages Includes *
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {TOGGLE_OPTIONS.map((item) => (
            <div key={item} className="flex flex-col">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.includes[item] || false}
                  onChange={() => handleToggle(item)}
                  className="sr-only peer"
                />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                <span className="ml-2 text-sm text-gray-700">{item}</span>
              </label>
              <span className="text-xs text-gray-400">
                Enable or disable by toggle.
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="bg-green-700 text-white font-semibold py-2 px-6 rounded"
      >
        Continue
      </button>
    </form>
  );
};

export default PackageForm;
