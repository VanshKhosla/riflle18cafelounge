import React, { useMemo, useState, useEffect } from "react";

const CATEGORIES = [
  "All", "Add-Ons", "Veg Pizza", "Non Veg Pizza",
  "Small Bites (Veg)", "Small Bites (Non-Veg)", "Breakfast",
  "Sandwich (Veg)", "Sandwich (Non-Veg)", "Burger (Veg)", "Burger (Non-Veg)",
  "Breads & More (Veg)", "Breads & More (Non-Veg)",
  "Kathi Roll & Grilled Wraps (Veg)", "Kathi Roll & Grilled Wraps (Non-Veg)",
  "Sizzlers (Veg)", "Sizzlers (Non-Veg)",
  "Nachos (Veg)", "Nachos (Non-Veg)",
  "Pan & Baked Pasta (Veg)", "Pan & Baked Pasta (Non-Veg)",
  "Salads (Veg)", "Salads (Non-Veg)",
  "Main Course (Veg)", "Main Course (Non-Veg)",
  "Indo-Chinese (Veg)", "Indo-Chinese (Non-Veg)",
  "Waffles", "Soups", "Hot Beverages", "Hot Latte",
  "Premium Hot Latte", "Hot Tea", "Iced Tea",
  "Cold Beverages", "Premium Cold Beverages",
  "Mocktails", "Premium Mocktails", "Shakes",
  "Premium Chocolate Shakes", "Smoothies", "Sundae"
];

const GOLD_GRADIENT = {
  background: "linear-gradient(90deg, #b8860b, #ffd700, #b8860b)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  fontWeight: "bold"
};

const GOLD_SOFT = { color: "#ffd700" };

// ⬇ SAMPLE (EMPTY) menu. You will paste your menu here later.
// Menu items removed - loaded via fetch now

function getItemType(category) {
  if (category.toLowerCase().includes("non")) return "nonveg";
  return "veg";
}




export default function RestaurantMenu() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [allMenuItems, setAllMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch ALL data once on mount
  useEffect(() => {
    setLoading(true);
    fetch("/data/all.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data) => {
        setAllMenuItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch menu:", err);
        setAllMenuItems([]);
        setLoading(false);
      });
  }, []);

  // 2. Filter client-side
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    // First filter by category
    let items = allMenuItems;
    if (category !== "All") {
      items = items.filter((it) => it.category === category);
    }

    // Then filter by search query
    if (q) {
      items = items.filter((it) =>
        it.name.toLowerCase().includes(q) ||
        it.description.toLowerCase().includes(q)
      );
    }

    return items;
  }, [query, category, allMenuItems]);

  return (
    <div
      className="min-h-screen p-6 sm:p-12"
      style={{ backgroundColor: "#4e513c" }}
    >
      {/* HEADER */}
      <header className="max-w-6xl mx-auto mb-8 flex items-center gap-4">
        <img
          src="/Images/logo.png"
          alt="Cafe Logo"
          className="w-14 h-14 rounded-full bg-white p-1 object-contain shadow"
          style={{ border: "2px solid rgba(255,255,255,0.4)" }}
        />

        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight" style={GOLD_GRADIENT}>
            Rifle 18 Cafe & Lounge
          </h1>
          <p style={{ ...GOLD_SOFT, opacity: 0.75 }}>
            Modern restaurant menu — filter, search & animate.
          </p>
        </div>
      </header>

      {/* LAYOUT */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* SIDEBAR */}
        <aside
          className="lg:col-span-1 p-5 rounded-2xl shadow-xl"
          style={{ backgroundColor: "#4e513c", color: "#ffd700" }}
        >
          {/* SEARCH */}
          <div className="mb-4">
            <label className="block text-sm mb-2" style={GOLD_SOFT}>Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes..."
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: "#3f4230",
                color: "#ffd700",
                borderColor: "#b89f40",
              }}
            />
          </div>

          {/* CATEGORY DROPDOWN */}
          <div className="mb-4">
            <label className="block text-sm mb-2" style={GOLD_SOFT}>Category</label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border"
              style={{
                backgroundColor: "#3f4230",
                color: "#ffd700",
                borderColor: "#b89f40",
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} style={{ color: "#ffffff" }}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </aside>

        {/* MENU LIST */}
        <section className="lg:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-xl font-bold" style={GOLD_SOFT}>Loading menu...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

              {/* LIST WITHOUT ANIMATION — FIXES iOS CRASH */}
              {filtered.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl shadow-xl overflow-hidden transition"
                  style={{ backgroundColor: "#4e513c" }}
                >
                  {/* IMAGE */}
                  <div className="relative h-44 sm:h-56">
                    <img
                      src={item.img}
                      alt={item.name}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />

                    <div
                      className="absolute top-3 left-3 text-xs px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.4)",
                        ...GOLD_SOFT
                      }}
                    >
                      {item.category}
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-4">

                    {/* NAME + DOT */}
                    <div className="flex items-center justify-between">

                      <h3 className="font-semibold text-lg" style={GOLD_GRADIENT}>
                        {item.name}
                      </h3>

                      {/* Only show dot if type exists */}
                      {item.type && (
                        <span
                          style={{
                            width: "12px",
                            height: "12px",
                            borderRadius: "50%",
                            backgroundColor:
                              item.type === "veg" ? "#0f8a0f" : "#c40000",
                            border: "2px solid #ffd700",
                            display: "inline-block",
                            marginLeft: "8px",
                            boxShadow: "0 0 6px rgba(255,215,0,0.4)"
                          }}
                        />
                      )}
                    </div>

                    {/* DESCRIPTION */}
                    {item.description && (
                      <p
                        className="text-sm mt-1 leading-snug"
                        style={{ ...GOLD_SOFT, opacity: 0.8 }}
                      >
                        {item.description}
                      </p>
                    )}

                    {/* VARIANTS */}
                    {item.variants && (
                      <div
                        className="mt-3 p-3 rounded-lg text-sm"
                        style={{
                          backgroundColor: "rgba(255, 215, 0, 0.08)",
                          border: "1px solid rgba(255,215,0,0.3)",
                          color: "#ffd700"
                        }}
                      >
                        {item.variants.map((v, i) => (
                          <div
                            key={i}
                            className="flex justify-between py-1 border-b last:border-none"
                            style={{ borderColor: "rgba(255,215,0,0.2)" }}
                          >
                            <span>{v.size}</span>
                            <span>₹{v.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}

            </div>
          )}
        </section>
      </main>

      <footer
        className="max-w-6xl mx-auto mt-12 text-center text-sm"
        style={{ color: "#ffd700" }}
      >
        © Rifle 18 — Built with ❤️
      </footer>
    </div>
  );
}
