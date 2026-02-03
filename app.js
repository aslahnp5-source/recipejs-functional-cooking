// Recipe data (pure data)
const recipes = [
    {
        name: "Pasta",
        ingredients: ["Noodles", "Tomato Sauce", "Cheese"]
    },
    {
        name: "Omelette",
        ingredients: ["Eggs", "Onion", "Salt"]
    },
    {
        name: "Fruit Salad",
        ingredients: ["Apple", "Banana", "Orange"]
    }
];

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
    </div>
`;

// Higher-order function: render all recipes
const renderRecipes = (recipes) => {
    const container = document.getElementById("recipe-container");
    container.innerHTML = recipes.map(createRecipeCard).join("");
};

// Call the function
renderRecipes(recipes);
