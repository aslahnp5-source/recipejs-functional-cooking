(() => {
  /* =======================
     Recipe Data
  ======================= */
  const recipes = [
    {
      id: 1,
      name: "Pasta",
      difficulty: "easy",
      time: 25,
      ingredients: ["Pasta", "Tomato sauce", "Garlic", "Olive oil", "Cheese"],
      steps: [
        "Boil water",
        "Add pasta",
        {
          text: "Prepare sauce",
          substeps: [
            "Heat oil",
            "Add garlic",
            "Add tomato sauce",
            {
              text: "Season sauce",
              substeps: ["Add salt", "Add pepper"]
            }
          ]
        },
        "Mix pasta with sauce",
        "Serve hot"
      ]
    },
    {
      id: 2,
      name: "Omelette",
      difficulty: "easy",
      time: 10,
      ingredients: ["Eggs", "Onion", "Salt", "Oil"],
      steps: [
        "Crack eggs",
        "Beat eggs",
        "Heat pan",
        "Add onion",
        "Pour eggs",
        "Cook and serve"
      ]
    },
    {
      id: 3,
      name: "Fruit Salad",
      difficulty: "easy",
      time: 15,
      ingredients: ["Apple", "Banana", "Orange", "Honey"],
      steps: [
        "Chop fruits",
        {
          text: "Mix fruits",
          substeps: ["Add apple", "Add banana", "Add orange"]
        },
        "Add honey",
        "Serve fresh"
      ]
    }
  ];

  /* =======================
     State
  ======================= */
  let currentFilter = "all";
  let currentSort = "none";
  let searchQuery = "";
  let favorites = JSON.parse(localStorage.getItem("recipeFavorites")) || [];
  let debounceTimer;

  /* =======================
     DOM References
  ======================= */
  const recipeContainer = document.getElementById("recipe-container");
  const filterButtons = document.querySelectorAll("[data-filter]");
  const sortButtons = document.querySelectorAll("[data-sort]");
  const searchInput = document.getElementById("search-input");
  const clearSearchBtn = document.getElementById("clear-search");
  const recipeCounter = document.getElementById("recipe-counter");

  /* =======================
     Helpers
  ======================= */
  const saveFavorites = () =>
    localStorage.setItem("recipeFavorites", JSON.stringify(favorites));

  const toggleFavorite = (id) => {
    favorites = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];

    saveFavorites();
    updateDisplay();
  };

  const renderIngredients = (ingredients) =>
    ingredients.map(item => `<li>${item}</li>`).join("");

  const renderSteps = (steps, level = 0) =>
    steps.map(step => {
      if (typeof step === "string") {
        return `<li style="margin-left:${level * 20}px">➡️ ${step}</li>`;
      }
      return `
        <li style="margin-left:${level * 20}px">
          🔹 ${step.text}
          <ul>${renderSteps(step.substeps, level + 1)}</ul>
        </li>
      `;
    }).join("");

  const createRecipeCard = (recipe) => `
    <div class="recipe-card">
      <h2>${recipe.name}</h2>

      <button
        class="favorite-btn"
        data-id="${recipe.id}"
      >
        ${favorites.includes(recipe.id) ? "❤️" : "🤍"}
      </button>

      <button class="toggle-steps" data-id="${recipe.id}">
        Show Steps
      </button>

      <div class="steps-container" id="steps-${recipe.id}" style="display:none">
        <ul>${renderSteps(recipe.steps)}</ul>
      </div>

      <ul>${renderIngredients(recipe.ingredients)}</ul>

      <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
      <p><strong>Time:</strong> ${recipe.time} mins</p>
    </div>
  `;

  const renderRecipes = (list) => {
    recipeContainer.innerHTML = list.map(createRecipeCard).join("");
    recipeCounter.textContent = `Showing ${list.length} of ${recipes.length} recipes`;
  };

  /* =======================
     Filters & Search
  ======================= */
  const applySearch = (list) => {
    if (!searchQuery) return list;

    const q = searchQuery.toLowerCase();
    return list.filter(recipe =>
      recipe.name.toLowerCase().includes(q) ||
      recipe.ingredients.some(i => i.toLowerCase().includes(q))
    );
  };

  const applyFilter = (list) => {
    if (currentFilter === "favorites") {
      return list.filter(r => favorites.includes(r.id));
    }

    if (currentFilter === "quick") {
      return list.filter(r => r.time < 30);
    }

    if (currentFilter === "all") return list;
    return list.filter(r => r.difficulty === currentFilter);
  };

  const applySort = (list) => {
    if (currentSort === "time") {
      return [...list].sort((a, b) => a.time - b.time);
    }
    if (currentSort === "name") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  };

  const updateDisplay = () => {
    let result = applySearch(recipes);
    result = applyFilter(result);
    result = applySort(result);
    renderRecipes(result);
  };

  /* =======================
     Events
  ======================= */
  filterButtons.forEach(btn =>
    btn.addEventListener("click", () => {
      currentFilter = btn.dataset.filter;
      updateDisplay();
    })
  );

  sortButtons.forEach(btn =>
    btn.addEventListener("click", () => {
      currentSort = btn.dataset.sort;
      updateDisplay();
    })
  );

  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    clearSearchBtn.style.display = "inline";

    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value.trim();
      updateDisplay();
    }, 300);
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.style.display = "none";
    updateDisplay();
  });

  recipeContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("toggle-steps")) {
      const id = e.target.dataset.id;
      const box = document.getElementById(`steps-${id}`);
      box.style.display = box.style.display === "none" ? "block" : "none";
      e.target.textContent =
        box.style.display === "none" ? "Show Steps" : "Hide Steps";
    }

    if (e.target.classList.contains("favorite-btn")) {
      toggleFavorite(Number(e.target.dataset.id));
    }
  });

  /* =======================
     Init
  ======================= */
  updateDisplay();
})();
