// Imports

const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
require('dotenv').config();
const cors = require('cors');
const fetch = require('node-fetch');

// Vars

const app = express();
const port = 3000;
app.use(cors());

// Helper functions

function ifExists(item, tester) {
	if (tester) {
		console.log(tester);
		return null;
	} else {
		return null;
	}
}

// Schema

const schema = buildSchema(`

enum Units {
    standard
    metric
    imperial
  }

type Weather {
    temperature: Float
    description: String
    feelsLike: String
    tempMin: Int
    tempMax: Int
    pressure: Int
	humidity: Int
	cod: Int
}

type Query {
    getWeather(zip: Int!, unit: Units): Weather!
}

`);

// Resolver

const root = {
	getWeather: async ({ zip, unit }) => {
		const apiKey = process.env.API_KEY;
		const url = `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&appid=${apiKey}&units=${unit}`;
		const res = await fetch(url);
		const json = await res.json();
		console.log(json);
		// const temperature = json.cod != 200 ? json.main.temp : null;
		// const description = json.cod != 200 ? json.weather[0].description : null;
		// const feelsLike = json.cod != 200 ? json.main.feels_like : null;
		// const tempMin = json.cod != 200 ? json.main.temp_min : null;
		// const tempMax = json.cod != 200 ? json.main.tempMax : null;
		// const pressure = json.cod != 200 ? json.main.pressure : null;
		// const humidity = json.cod != 200 ? json.main.humidity : null;

		const temperature = json.main.temp;
		const description = json.weather[0].description;
		const feelsLike = json.main.feels_like;
		const tempMin = json.main.temp_min;
		const tempMax = json.main.tempMax;
		const pressure = json.main.pressure;
		const humidity = json.main.humidity;
		const cod = json.cod;
		return {
			temperature,
			description,
			feelsLike,
			tempMin,
			tempMax,
			pressure,
			humidity,
			cod,
		};
	},
};

// Route

app.use(
	'/graphql',
	graphqlHTTP({
		schema,
		rootValue: root,
		graphiql: true,
	})
);

// Start app

app.listen(port, () => {
	console.log(`Running on port ${port}`);
});
