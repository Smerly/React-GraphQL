import logo from './logo.svg';
import './App.css';
import { gql } from '@apollo/client';
import { client } from './index';
import Weather from './Weather';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
	return (
		<div className="App">
			<h1 style={{ marginTop: 50 }}> Enter your Zip</h1>
			<div className="centered" style={{ minHeight: '70vh' }}>
				<Weather />
			</div>
		</div>
	);
}

export default App;
