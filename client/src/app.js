import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth, AuthContext } from './hooks/auth-hook';
import ListOrders from './pages/list-orders-page';
import ViewOrder from './pages/view-order-page';
import NotFoundPage from './pages/not-found-page';
import './app.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import MainMenu from './components/main-menu';
import Sidebar from './components/sideBar';
import LoginPage from './pages/login-page';

function App() {
  const { user, setUser } = useAuth();
  return (
    <AuthContext.Provider value={{ user: user, setUser: setUser }}>
      <div className='root'>
        {user && (
          <Router>
            <header>
              <MainMenu></MainMenu>
            </header>

            <main style={{ display: 'flex' }}>
              <Sidebar />
              <div className='main'>
                <Routes>
                  <Route path="/" element={<ListOrders />} />
                  <Route path="/orders" element={<ListOrders />} />
                  <Route path="/orders/:orderId" element={<ViewOrder />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>

            </main>
          </Router>
        )}
        {!user && (
          <LoginPage />
        )}
      </div>
    </AuthContext.Provider>
  );
}

export default App;
