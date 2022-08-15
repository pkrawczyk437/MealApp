'use strict';
import { getData } from './functions/getData.js';
let areDetailsVisible = false;

const mealsWrapper = document.createElement('section');
const mealContainer = document.createElement('div');
const detailsContainer = document.createElement('div');
mealsWrapper.classList.add('container');
mealContainer.classList.add('meal');
detailsContainer.classList.add('details');

const createButton = (type, className, buttonContent) => {
	const button = document.createElement('button');
	button.type = type;
	button.classList.add(className);
	button.innerText = buttonContent;
	return button;
};

const randomMealBtn = createButton(
	'button',
	'randomMealBtn',
	'Get Random Meal',
);

const detailsButton = createButton('button', 'detailsBtn', 'Details');

const getMeal = async () => {
	const response = await getData();
	const { meals } = await response.json();
	mealContainer.replaceChildren();
	detailsContainer.replaceChildren();
	const meal = meals.map((meal) => {
		const { strMeal, strMealThumb, strInstructions, strYoutube } = meal;
		return {
			mealName: strMeal,
			mealImageSrc: strMealThumb,
			mealInstruction: strInstructions,
			mealTutorialLink: strYoutube,
			ingredients: Object.keys(meal)
				.map((key) => {
					if (key.startsWith('strIngredient')) {
						const index = key.slice('strIngredient'.length);
						const strIngredient = meal[`strIngredient${index}`];
						const strMeasure = meal[`strMeasure${index}`]?.trim();
						if (strIngredient && strMeasure)
							return {
								ingredientName: strIngredient,
								measure: strMeasure,
							};
					}
					return null;
				})
				.filter(Boolean),
		};
	});
	renderMeal(meal);
};

const getYoutubeLink = (url) => {
	const videoID = url.slice('https://www.youtube.com/watch?v='.length);
	return `http://www.youtube.com/embed/${videoID}`;
};

const getMealDetails = (ingredients, mealInstruction, mealTutorialLink) => {
	const ingredientsContainer = document.createElement('div');
	const instructionContainer = document.createElement('div');
	const ingredientsTitle = document.createElement('h2');
	const ingredientsList = document.createElement('ul');
	const preparationMethod = document.createElement('h1');
	const instruction = document.createElement('p');
	const videoFrame = document.createElement('iframe');

	ingredientsContainer.classList.add('ingredients');
	instructionContainer.classList.add('instruction');
	ingredientsTitle.innerText = 'Ingredients:';
	ingredientsTitle.classList.add('details__ingredientsTitle');

	preparationMethod.innerText = 'Preparation Method';
	preparationMethod.classList.add('instruction__title');
	instruction.innerText = mealInstruction;
	instruction.classList.add('instruction__content');

	videoFrame.src = getYoutubeLink(mealTutorialLink);
	videoFrame.width = '640';
	videoFrame.height = '360';
	videoFrame.allowFullscreen = true;

	ingredients.forEach(({ ingredientName, measure }) => {
		let ingredient = document.createElement('li');
		ingredient.innerText = `${measure} ${ingredientName}`;
		ingredientsList.append(ingredient);
	});
	ingredientsContainer.append(ingredientsTitle, ingredientsList);
	instructionContainer.append(preparationMethod, instruction, videoFrame);
	detailsContainer.append(ingredientsContainer, instructionContainer);
	mealsWrapper.append(detailsContainer);
};

const toggleButtonContent = () => {
	areDetailsVisible = !areDetailsVisible;
	const buttonContent = areDetailsVisible ? 'Go back' : 'Details';
	detailsButton.innerText = buttonContent;
};

const toggleDetailsAndOverview = () => {
	mealContainer.classList.toggle('meal--hidden');
	detailsContainer.classList.toggle('details--active');
	randomMealBtn.classList.toggle('randomMealBtn--hidden');
	toggleButtonContent();
};

const addListener = (element, eventType, callback) =>
	element.addEventListener(eventType, callback);

const renderMeal = (meal) => {
	meal.forEach(
		({
			mealName,
			mealImageSrc,
			mealInstruction,
			ingredients,
			mealTutorialLink,
		}) => {
			const nameOfMeal = document.createElement('h1');
			const mealImage = document.createElement('img');
			mealImage.src = mealImageSrc;
			mealImage.alt = 'Meal Image';
			mealImage.classList.add('meal__image');
			nameOfMeal.classList.add('meal__name');
			nameOfMeal.innerText = mealName;
			addListener(detailsButton, 'click', () => {
				getMealDetails(ingredients, mealInstruction, mealTutorialLink);
				toggleDetailsAndOverview();
			});
			mealContainer.append(nameOfMeal, mealImage);
		},
		mealsWrapper.append(mealContainer, detailsButton),
	);
};

mealsWrapper.append(randomMealBtn);
addListener(randomMealBtn, 'click', getMeal);
document.body.append(mealsWrapper);
