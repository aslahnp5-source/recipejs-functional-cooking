// Recipe data (pure data)
const recipes = [
    {
        name: "Pasta",
        ingredients: ["Noodles", "Tomato Sauce", "Cheese"],
        difficulty: "easy",
        time: 25
    },
    {
        name: "Omelette",
        ingredients: ["Eggs", "Onion", "Salt"],
        difficulty: "easy",
        time: 10
    },
    {
        name: "Fruit Salad",
        ingredients: ["Apple", "Banana", "Orange"],
        difficulty: "easy",
        time: 15
    },
    {
        name: "Veg Curry",
        ingredients: ["Vegetables", "Spices"],
        difficulty: "medium",
        time: 40
    },
    {
        name: "Fried Rice",
        ingredients: ["Rice", "Vegetables", "Sauce"],
        difficulty: "medium",
        time: 30
    },
    {
        name: "Paneer Masala",
        ingredients: ["Paneer", "Tomato", "Spices"],
        difficulty: "hard",
        time: 50
    },
    {
        name: "Biryani",
        ingredients: ["Rice", "Spices", "Vegetables"],
        difficulty: "hard",
        time: 60
    },
    {
        name: "Sandwich",
        ingredients: ["Bread", "Vegetables", "Sauce"],
        difficulty: "easy",
        time: 5
    }
];

// State management
let currentFilter = "all";
let currentSort = "none";

// Pure function: creates ingredient list
const createIngredientList = (ingredients) =>
    ingredients.map(item => `<li>${item}</li>`).join("");

// Pure function: creates a recipe card
const createRecipeCard = (recipe) => `
    <div class="recipe-card">
        <h2>${recipe.name}</h2>
        <ul>
            ${createIngredientList(recipe.ingredients)}
        </ul>
        <p><strong>Difficulty:</strong> ${recipe.difficulty}</p>
        <p><strong>Time:</strong> ${recipe.time} mins</p>
    </div>
`;

// Higher-order function: render recipes
const renderRecipes = (recipes) => {
    const container = document.getElementById("recipe-container");
    container.innerHTML = recipes.map(createRecipeCard).join("");
};

// DOM references
const filterButtons = document.querySelectorAll("[data-filter]");
const sortButtons = document.querySelectorAll("[data-sort]");

// Pure function: filter recipes
const filterRecipes = (recipes, filter) => {
    if (filter === "all") return recipes;
    return recipes.filter(recipe => recipe.difficulty === filter);
};

// Pure function: sort recipes
const sortRecipes = (recipes, sortType) => {
    if (sortType === "time") {
        return [...recipes].sort((a, b) => a.time - b.time);
    }

    if (sortType === "name") {
        return [...recipes].sort((a, b) => a.name.localeCompare(b.name));
    }

    return recipes;
};

// Apply filter + sort
const updateRecipes = () => {
    let updatedRecipes = filterRecipes(recipes, currentFilter);
    updatedRecipes = sortRecipes(updatedRecipes, currentSort);
    renderRecipes(updatedRecipes);
};

// Filter button events
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentFilter = button.dataset.filter;
        updateRecipes();
    });
});

// Sort button events
sortButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentSort = button.dataset.sort;
        updateRecipes();
    });
});

// Initial render
updateRecipes();
