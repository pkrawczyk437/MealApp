const baseURL = 'https://www.themealdb.com/api/json/v1/1/random.php';

export const getData = async () => await fetch(baseURL);
