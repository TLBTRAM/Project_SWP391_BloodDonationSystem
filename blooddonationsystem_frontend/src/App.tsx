import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./pages/Home";
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Reset1Page from "./pages/ResetPassemail";
import Reset2Page from "./pages/ResetPassOTP";
import Reset3Page from "./pages/ResetPass";
import DonorPage  from "./pages/Dashboarddonor1";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/forgot" element={<Reset1Page />} />
				<Route path="/forgot2" element={<Reset2Page />} />
				<Route path="/forgot3" element={<Reset3Page />} />
				<Route path="/donor1" element={<DonorPage  />} />

				
			</Routes>
		</BrowserRouter>
	);
}

export default App;




