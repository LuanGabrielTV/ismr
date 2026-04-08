import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/HomePage";
import Preference from "./pages/PreferencePage";
import Register from "./pages/RegisterPage";
import Login from "./pages/LoginPage";
import User from "./pages/UserPage";
import Install from './components/Install';
import useOnlineStatus from './hooks/useOnlineStatus';
import Offline from './components/Offline';
import { flushManualQueue } from './utils/syncManager';
import { App as AntdApp, ConfigProvider } from 'antd';
import UserPage from './pages/UserPage';

function App() {
  const isOnline = useOnlineStatus();
  useEffect(() => {
    const handleOnline = () => {
      // Delay slightly to ensure browser socket is fully stable
      setTimeout(() => {
        flushManualQueue();
      }, 1500);
    };

    window.addEventListener('online', handleOnline);

    if (navigator.onLine) {
      flushManualQueue();
    }

    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: "'Wix Madefor Display', monospace",
        },
      }}>
      <AntdApp>
        <BrowserRouter>
          {true && (<div className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/preferences" element={<Preference />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/user" element={<User />} />
            </Routes>
            <Install />
          </div>)}

          {!isOnline && (
            <div style={{
              position: 'fixed',
              top: 0,
              width: '100%',
              backgroundColor: '#ff3333',
              color: 'white',
              padding: '10px 10px',
              border: 'none',
              fontFamily: 'Wix Madefor Display',
              fontSize: '12px',
              textAlign: 'center',
              zIndex: 1000
            }}>Você está offline!
            </div>) && <Offline />}

        </BrowserRouter>
      </AntdApp>

    </ConfigProvider >

  );
}

export default App;