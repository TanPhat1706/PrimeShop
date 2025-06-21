import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import AdminRoutes from "./routes/AdminRoutes";
import UserRoutes from "./routes/UserRoutes";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* 👨‍💼 Admin luôn đặt trước */}
            <Route path="/admin/*" element={<AdminRoutes />} />

            {/* 👥 User */}
            <Route path="/*" element={<UserRoutes />} />

            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
