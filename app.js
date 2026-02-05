const RecipeApp = (() => {
  // =========================
  // Recipe Data
  // =========================
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

  // =========================
  // State
  // =========================
  let currentFilter = "all";
  let currentSort = "none";

  // =========================
  // Recursive Steps Renderer
  // =========================
  const renderSteps = (steps, level = 0) => {
    return steps
      .map(step => {
        if (typeof step === "string") {
          return `<li style="margin-left:${level * 20}px">➡️ ${step}</li>`;
        }

        if (step.substeps) {
          return `
            <li style="margin-left:${level * 20}px">
              🔹 ${step.text}
              <ul>
                ${renderSteps(step.substeps, level + 1)}
              </ul>
            </li>
          `;
        }
      })
      .join("");
  };

  // =========================
  // Card Creator
  // =========================
  const createRecipeCard = recipe => `
    <div class="recipe-card">
      <h2>${recipe.name}</h2>

      <button class="toggle-steps" data-id="${recipe.id}">
        Show Steps
      </button>

      <div class="steps-container" id="steps-${recipe.id}" style="display:none">
        <ul>
          ${renderSteps(recipe.steps)}
        </ul>
      </div>

      <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
      <p><strong>Time:</strong> ${recipe.time} mins</p>
    </div>
  `;

  // =========================
  // Render Recipes
  // =========================
  const renderRecipes = list => {
    const container = document.getElementById("recipe-container");
    container.innerHTML = list.map(createRecipeCard).join("");
  };

  // =========================
  // Filter & Sort
  // =========================
  const filterRecipes = (list, filter) => {
    if (filter === "all") return list;
    return list.filter(r => r.difficulty === filter);
  };

  const sortRecipes = (list, sortType) => {
    if (sortType === "time") {
      return [...list].sort((a, b) => a.time - b.time);
    }
    if (sortType === "name") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  };

  const updateRecipes = () => {
    let updated = filterRecipes(recipes, currentFilter);
    updated = sortRecipes(updated, currentSort);
    renderRecipes(updated);
  };

  // =========================
  // Event Delegation
  // =========================
  const setupEventListeners = () => {
    document
      .getElementById("recipe-container")
      .addEventListener("click", e => {
        if (e.target.classList.contains("toggle-steps")) {
          const id = e.target.dataset.id;
          const stepsDiv = document.getElementById(`steps-${id}`);

          if (stepsDiv.style.display === "none") {
            stepsDiv.style.display = "block";
            e.target.textContent = "Hide Steps";
          } else {
            stepsDiv.style.display = "none";
            e.target.textContent = "Show Steps";
          }
        }
      });

    document.querySelectorAll("[data-filter]").forEach(btn => {
      btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        updateRecipes();
      });
    });

    document.querySelectorAll("[data-sort]").forEach(btn => {
      btn.addEventListener("click", () => {
        currentSort = btn.dataset.sort;
        updateRecipes();
      });
    });
  };

  // =========================
  // Public Init
  // =========================
  const init = () => {
    console.log("RecipeApp initializing...");
    setupEventListeners();
    updateRecipes();
    console.log("RecipeApp ready!");
  };

  return { init };
})();

// Start App
RecipeApp.init();
