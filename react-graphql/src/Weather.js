import { useState } from 'react';
import { gql } from '@apollo/client';
import { client } from './index';

function Weather() {
	const [zip, setZip] = useState('');
	const [weather, setWeather] = useState(null);
	const [validZip, setvalidZip] = useState(true);
	const [unit, setUnit] = useState('');
	const runThis = (check, header, data) => {
		return (
			<div>
				<header> {header} </header>
				<h3>{data}</h3>
			</div>
		);
	};
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
	return (
		<div className="centered" style={{ flexDirection: 'column' }}>
			<div classname="row">
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
		</div>
	);
}

export default Weather;
