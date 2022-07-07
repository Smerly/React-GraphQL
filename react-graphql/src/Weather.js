import { useState } from 'react';
import { gql } from '@apollo/client';
import { client } from './index';
import { useLazyQuery } from '@apollo/client';

function Weather() {
	const [zip, setZip] = useState('');
	const [weather, setWeather] = useState(null);
	const [validZip, setvalidZip] = useState(true);
	const [lat, setLat] = useState(37.7616245);
	const [lon, setLon] = useState(-122.2408917);
	const [unit, setUnit] = useState('');

	// Query

	const getWeatherQuery = gql`
	    query {
	      getWeather(lat: ${lat}, lon: ${lon}) {
	      temperature
	      description
	      humidity
	      pressure
	      feelsLike
	      cod
	    }
	  }
	  `;
	// const getWeatherQuery = gql`
	// 	query GetWeather($lat: Int!, $lon: Int!) {
	// 		getWeather(lat: $lat, lon: $lon) {
	// 			temperature
	// 			description
	// 			humidity
	// 			pressure
	// 			feelsLike
	// 			cod
	// 		}
	// 	}
	// `;

	const [getWeather2, { loading, error, data }] = useLazyQuery(getWeatherQuery);

	const runThis = (check, header, data) => {
		return (
			<div>
				<header> {header} </header>
				<h3>{data}</h3>
			</div>
		);
	};

	function getGeoLocation() {
		navigator.geolocation.getCurrentPosition((position) => {
			setTimeout(() => {
				setLat(position.coords.latitude);
				setLon(position.coords.longitude);
				const vars = {
					variables: {
						lat: position.coords.latitude,
						lon: position.coords.longitude,
						unit: unit,
					},
				};
				console.log(lat);
				console.log(lon);
				console.log(position.coords.latitude);
				console.log(position.coords.longitude);
			}, 1000);
		});
	}

	async function getWeather() {
		try {
			const json = await client.query({
				query: gql`
            query {
              getWeather(zip:${zip}, unit: ${unit}) {
              temperature
              description
              humidity
              pressure
              feelsLike
              cod
            }
          }
          `,
			});
			setWeather(json);
			setvalidZip(true);
		} catch (err) {
			console.log(err.message);
			setWeather(null);
			setvalidZip(false);
		}
	}
	console.log(loading, data, error);
	return (
		<div className="centered" style={{ flexDirection: 'column' }}>
			<div className="row">
				{/* {runThis()} */}
				{weather
					? runThis(weather, 'Temperature', weather.data.getWeather.temperature)
					: null}

				{weather
					? runThis(weather, 'Description', weather.data.getWeather.description)
					: null}
				{weather
					? runThis(weather, 'Humidity', weather.data.getWeather.humidity)
					: null}
				{weather
					? runThis(weather, 'Pressure', weather.data.getWeather.pressure)
					: null}
				{weather
					? runThis(weather, 'Feels Like...', weather.data.getWeather.feelsLike)
					: null}
				{!validZip ? <h1>Not Valid Zip, Try Again</h1> : null}
			</div>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					getWeather();
				}}
				className="centered"
				style={{ flexDirection: 'column' }}
			>
				<div className="centered">
					<div style={{ margin: 5 }}>
						<label style={{ margin: 4 }}> Standard </label>
						<input
							type="radio"
							name="unit"
							onClick={() => {
								setUnit('standard');
							}}
						></input>
					</div>
					<div style={{ margin: 5 }}>
						<label style={{ margin: 4 }}> Metric </label>
						<input
							type="radio"
							name="unit"
							onClick={() => {
								setUnit('metric');
							}}
						></input>
					</div>
					<div style={{ margin: 5 }}>
						<label style={{ margin: 4 }}> Imperial </label>
						<input
							type="radio"
							name="unit"
							onClick={() => {
								setUnit('imperial');
							}}
						></input>
					</div>
				</div>
				<div>
					<input
						value={zip}
						onChange={(e) => setZip(e.target.value)}
						className="custom-input"
					/>
					<button className="custom-button" type="submit">
						Submit
					</button>
				</div>
			</form>

			<form
				onSubmit={(e) => {
					e.preventDefault();
				}}
				className="centered"
				style={{ flexDirection: 'column' }}
			>
				<h2 style={{ marginTop: 50 }}> Or Just Get My Current Location...</h2>
				<div>
					<button
						className="custom-button"
						onClick={() => {
							// console.log(vars);
							// getWeather2(vars);
							const latitude = navigator.geolocation.getCurrentPosition(
								(position) => {
									const { latitude, longitude } = position.coords;
									// Variables to be put into the lazy query function given to me

									const vars = {
										variables: {
											lat: latitude,
											lon: latitude,
											unit: unit,
										},
									};
									console.log(vars);
									// Now call your lazy query
									getWeather2(vars);
								}
							);
						}}
					>
						Submit
					</button>
				</div>
			</form>
			{/* {error ? <h3>{error}</h3> : null} */}
			{loading ? <h3>loading...</h3> : null}
			{data ? <h3>{data}</h3> : null}
		</div>
	);
}

export default Weather;
