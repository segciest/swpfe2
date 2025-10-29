'use client';
export default function FilterBar({ selected, onChange }: { selected: string; onChange: (val: string) => void }) {
    const categories = ["All", "Battery", "Electric Bike", "Electric Motorcycle", "Electric Car"];
    return (
        <div className="flex gap-3 mb-6">
            {categories.map((c) => (
                <button
                    key={c}
                    onClick={() => onChange(c)}
                    className={`px-4 py-2 rounded-full border ${selected === c ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                        }`}
                >
                    {c}
                </button>
            ))}
        </div>
    );
}
