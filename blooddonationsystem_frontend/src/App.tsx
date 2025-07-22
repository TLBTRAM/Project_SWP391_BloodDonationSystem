import { BrowserRouter, Route, Routes } from "react-router-dom";

// Component scroll to top
import ScrollToTop from "./ScrollToTop";

// Trang chính
import HomePage from "./pages/Home";
import TeamPage from "./pages/Team";

// Các trang thông tin
import NewsPage from "./pages/News";
import FAQsPage from "./pages/FAQs";
import ActPage from "./pages/Activities";
import TypePage from "./pages/BloodTypes";
import JoinPage from "./pages/Standard";
import AdvisePage from "./pages/Advise";
import ContactPage from "./pages/Contact";

// Đăng ký, đăng nhập, reset mật khẩu
import RegisterPage from "./pages/Register";
import LoginPage from "./pages/Login";
import Reset1Page from "./pages/ResetPassemail";
import Reset2Page from "./pages/ResetPassOTP";
import Reset3Page from "./pages/ResetPass";

// Tài khoản người dùng và quản trị viên
import UserPage from "./pages/User";
import EditPage from "./pages/Edit";

import BookingPage from "./pages/Booking";
import MyRegistrationspage from "./pages/MyRegistrations";

import BloodRequestHistorypage from "./pages/BloodRequestHistory";
import CreateBloodRequestpage from "./pages/CreateBloodRequest";

// Tài khoản người quản lí kho máu
import MedPage from "./pages/MedicalStaff";

// Tài khoản admin
import AdminPage from "./pages/Admin";

// Tài khoản người quản lí kho máu
import ManagerPage from "./pages/Manager";

function App() {
	return (
		<BrowserRouter>
			<ScrollToTop />
			<Routes>
				{/* Trang chính */}
				<Route path="/" element={<HomePage />} />
				<Route path="/team" element={<TeamPage />} />

				{/* Các trang thông tin */}
				<Route path="/news" element={<NewsPage />} />
				<Route path="/faqs" element={<FAQsPage />} />
				<Route path="/act" element={<ActPage />} />
				<Route path="/bloodtype" element={<TypePage />} />
				<Route path="/standard" element={<JoinPage />} />
				<Route path="/advise" element={<AdvisePage />} />
				<Route path="/contact" element={<ContactPage />} />

				{/* Đăng ký, đăng nhập, reset mật khẩu */}
				<Route path="/register" element={<RegisterPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/forgot" element={<Reset1Page />} />
				<Route path="/forgot2" element={<Reset2Page />} />
				<Route path="/forgot3" element={<Reset3Page />} />

				{/* Tài khoản người dùng*/}
				<Route path="/user" element={<UserPage />} />
				<Route path="/edit" element={<EditPage />} />

				<Route path="/booking" element={<BookingPage />} />
				<Route path="/my-registrations" element={<MyRegistrationspage />} />

				<Route path="/blood-request-history" element={<BloodRequestHistorypage />} />
				<Route path="/createbloodrequestpage" element={<CreateBloodRequestpage />} />


				{/* Tài khoản người nhân viên y tế */}
				<Route path="/med" element={<MedPage />} />

				{/* Tài khoản admin */}
				<Route path="/admin" element={<AdminPage />} />

				{/* Tài khoản người quản lí kho máu */}
				<Route path="/manager" element={<ManagerPage />} />


			</Routes>
		</BrowserRouter>
	);
}

export default App;
