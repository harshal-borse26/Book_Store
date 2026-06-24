import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import AddBook from "./pages/AddBook";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import NotFound from "./pages/NotFound";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AdminOrders from "./pages/AdminOrders";
import AdminDashboard from "./pages/AdminDashboard";
import ManageBooks from "./pages/ManageBooks";
import EditBook from "./pages/EditBook";
import AdminRoute from "./components/AdminRoute";
import ReadingJourney from "./pages/ReadingJourney";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/books" element={<Books />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>}/>
        <Route path="*" element={<NotFound />} />
        <Route path="/wishlist" element={<Wishlist />}/>
        <Route path="/profile" element={<Profile />}/>
        <Route path="/cart" element={<Cart />}/>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/add-book" element={ <AdminRoute><AddBook /></AdminRoute>}/>
        <Route path="/admin/orders" element={<AdminRoute> <AdminOrders /> </AdminRoute>} />
        <Route path="/admin" element={ <AdminRoute> <AdminDashboard /> </AdminRoute> } />
        <Route path="/admin/books" element={<AdminRoute> <ManageBooks /> </AdminRoute>} />
        <Route path="/edit-book/:id" element={<AdminRoute> <EditBook /> </AdminRoute>} />
        <Route path="/journey" element={<ProtectedRoute> <ReadingJourney /> </ProtectedRoute>}/>
      </Routes>
    </>
  );
}

export default App;