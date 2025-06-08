import { BrowserRouter, Route, Routes } from "react-router-dom";

import HomePage from "./pages/Home";
import TeamPage from "./pages/Team";

//Các trang thông tin 
import NewsPage from "./pages/News";
import FAQsPage from "./pages/FAQs";
import ActPage from "./pages/Activities";
import TypePage from "./pages/BloodTypes";
import JoinPage from "./pages/Standard";
import AdvisePage from "./pages/Advise";

//đăng ký , đăng nhập , reset mật khẩu 
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Reset1Page from "./pages/ResetPassemail";
import Reset2Page from "./pages/ResetPassOTP";
import Reset3Page from "./pages/ResetPass";

//tài khoản người dùng và quản trị viên 
import DonorPage from "./pages/Dashboarddonor1";
import EditPage from "./pages/Edit";


import AdminPage from "./pages/Admin";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route path="/team" element={<TeamPage />} />

				{/* Các trang thông tin */}
				<Route path="/news" element={<NewsPage />} />
				<Route path="/faqs" element={<FAQsPage />} />
				<Route path="/act" element={<ActPage />} />
				<Route path="/bloodtype" element={<TypePage />} />
				<Route path="/standard" element={<JoinPage />} />
				<Route path="/advise" element={<AdvisePage />} />

				{/* Đăng ký, đăng nhập, reset mật khẩu */}
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/forgot" element={<Reset1Page />} />
				<Route path="/forgot2" element={<Reset2Page />} />
				<Route path="/forgot3" element={<Reset3Page />} />

				{/* Tài khoản người dùng và quản trị viên */}
				<Route path="/donor1" element={<DonorPage />} />
				<Route path="/edit" element={<EditPage />} />
				<Route path="/admin" element={<AdminPage />} />



			</Routes>
		</BrowserRouter>
	);
}

export default App;




