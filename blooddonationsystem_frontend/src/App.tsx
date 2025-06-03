import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
import Reset1Page from "./pages/ResetPassemail";
import Reset2Page from "./pages/ResetPassOTP";
import Reset3Page from "./pages/ResetPass";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
<<<<<<< Updated upstream


=======
>>>>>>> Stashed changes
				<Route path="/forgot" element={<Reset1Page />} />
				<Route path="/forgot2" element={<Reset2Page />} />
				<Route path="/forgot3" element={<Reset3Page />} />

				
			</Routes>
		</BrowserRouter>
	);
}

export default App;




