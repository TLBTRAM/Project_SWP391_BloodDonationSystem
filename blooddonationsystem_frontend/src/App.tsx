import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import LoginPage from "./pages/Login";
import Reset1Page from "./pages/ResetPassemail";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/forgot" element={<Reset1Page />} />

				
			</Routes>
		</BrowserRouter>
	);
}

export default App;




