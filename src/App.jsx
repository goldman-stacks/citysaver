import React, { useState, useEffect, useMemo } from "react";
import "./App.css";

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Heinz Baked Beans 415g",
    retailer: "Tesco",
    pricePer100g: 0.18,
    nutritionScore: 0.7,
    envScore: 0.6,
    imageUrl:
      "https://via.placeholder.com/120x120.png?text=Heinz+Beans",
  },
  {
    id: 2,
    name: "Own Brand Baked Beans 410g",
    retailer: "Asda",
    pricePer100g: 0.11,
    nutritionScore: 0.65,
    envScore: 0.65,
    imageUrl:
      "https://via.placeholder.com/120x120.png?text=Own+Brand",
  },
  {
    id: 3,
    name: "Organic Baked Beans 400g",
    retailer: "Waitrose",
    pricePer100g: 0.26,
    nutritionScore: 0.8,
    envScore: 0.8,
    imageUrl:
      "https://via.placeholder.com/120x120.png?text=Organic",
  },
];

const PREF_KEY = "citySaverPreferences";

const rankToWeight = (rank) => {
  if (!rank) return 0;
  const map = { 1: 0.5, 2: 0.3, 3: 0.2 };
  return map[rank] || 0.2;
};

function App() {
  const [products] = useState(MOCK_PRODUCTS);

  const [rankPrice, setRankPrice] = useState("");
  const [rankNutrition, setRankNutrition] = useState("");
  const [rankEnv, setRankEnv] = useState("");
  const [showPrefsModal, setShowPrefsModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PREF_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setRankPrice(parsed.rankPrice);
      setRankNutrition(parsed.rankNutrition);
      setRankEnv(parsed.rankEnv);
      setShowPrefsModal(false);
    } else {
      setShowPrefsModal(true);
    }
  }, []);

  const handleSavePrefs = () => {
    const ranks = [rankPrice, rankNutrition, rankEnv];
    const unique = new Set(ranks.filter(Boolean));
    if (unique.size !== 3) {
      alert("Please assign each rank (1, 2, 3) exactly once.");
      return;
    }
    const prefs = { rankPrice, rankNutrition, rankEnv };
    localStorage.setItem(PREF_KEY, JSON.stringify(prefs));
    setShowPrefsModal(false);
  };

  const weightedProducts = useMemo(() => {
    const wPrice = rankToWeight(rankPrice);
    const wNut = rankToWeight(rankNutrition);
    const wEnv = rankToWeight(rankEnv);

    return products
      .map((p) => {
        const priceScore = 1 / p.pricePer100g;
        const nutScore = p.nutritionScore;
        const envScore = p.envScore;

        const combined =
          wPrice * priceScore + wNut * nutScore + wEnv * envScore;

        return {
          ...p,
          combinedScore: combined,
        };
      })
      .sort((a, b) => b.combinedScore - a.combinedScore);
  }, [products, rankPrice, rankNutrition, rankEnv]);

  return (
    <div className="app-root">
      <div className="mobile-shell">
        <header className="header">
          <div>
            <h1 className="brand">CitySaver</h1>
            <p className="tagline">Smarter grocery savings in your city.</p>
          </div>
          <button
            className="pill-button"
            onClick={() => setShowPrefsModal(true)}
          >
            Preferences
          </button>
        </header>

        <section className="prefs-summary">
          <p className="prefs-title">Your priorities</p>
          <ul>
            <li>
              {rankPrice && (
                <>
                  {rankPrice === "1" && "1st "}
                  {rankPrice === "2" && "2nd "}
                  {rankPrice === "3" && "3rd "}
                  – Unit price
                </>
              )}
            </li>
            <li>
              {rankNutrition && (
                <>
                  {rankNutrition === "1" && "1st "}
                  {rankNutrition === "2" && "2nd "}
                  {rankNutrition === "3" && "3rd "}
                  – Nutrition
                </>
              )}
            </li>
            <li>
              {rankEnv && (
                <>
                  {rankEnv === "1" && "1st "}
                  {rankEnv === "2" && "2nd "}
                  {rankEnv === "3" && "3rd "}
                  – Environmental impact
                </>
              )}
            </li>
          </ul>
        </section>

        <main className="product-list">
          {weightedProducts.map((p) => (
            <article key={p.id} className="product-card">
              <div className="product-image">
                <img src={p.imageUrl} alt={p.name} />
              </div>
              <div className="product-main">
                <div>
                  <h2 className="product-name">{p.name}</h2>
                  <p className="retailer">{p.retailer}</p>
                </div>
                <div className="product-footer">
                  <div className="product-meta">
                    <div>£{p.pricePer100g.toFixed(2)} / 100g</div>
                    <div className="meta-sub">
                      Nutri: {(p.nutritionScore * 100).toFixed(0)} / 100
                    </div>
                    <div className="meta-sub">
                      Env: {(p.envScore * 100).toFixed(0)} / 100
                    </div>
                  </div>
                  <div className="score-block">
                    <div className="score-label">CitySaver score</div>
                    <div className="score-value">
                      {p.combinedScore.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </main>
      </div>

      {showPrefsModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2 className="modal-title">Set your priorities</h2>
            <p className="modal-text">
              Rank what matters most to you. Each rank (1, 2, 3) must be used
              once.
            </p>

            <div className="modal-row">
              <span>Unit price</span>
              <select
                value={rankPrice}
                onChange={(e) => setRankPrice(e.target.value)}
              >
                <option value="">Rank</option>
                <option value="1">1 (most important)</option>
                <option value="2">2</option>
                <option value="3">3 (least important)</option>
              </select>
            </div>
            <div className="modal-row">
              <span>Nutrition</span>
              <select
                value={rankNutrition}
                onChange={(e) => setRankNutrition(e.target.value)}
              >
                <option value="">Rank</option>
                <option value="1">1 (most important)</option>
                <option value="2">2</option>
                <option value="3">3 (least important)</option>
              </select>
            </div>
            <div className="modal-row">
              <span>Environmental impact</span>
              <select
                value={rankEnv}
                onChange={(e) => setRankEnv(e.target.value)}
              >
                <option value="">Rank</option>
                <option value="1">1 (most important)</option>
                <option value="2">2</option>
                <option value="3">3 (least important)</option>
              </select>
            </div>

            <div className="modal-actions">
              <button
                className="secondary"
                onClick={() => setShowPrefsModal(false)}
              >
                Cancel
              </button>
              <button className="primary" onClick={handleSavePrefs}>
                Save & continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
