import { useEffect } from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from "./pages/Home";
import Preference from "./pages/Preference";
import Register from "./pages/Register";
import Install from './components/Install';
import useOnlineStatus from './hooks/useOnlineStatus';
import Offline from './components/Offline';
import { flushManualQueue } from './utils/syncManager';

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

    // Run once on load to catch anything missed while the app was closed
    if (navigator.onLine) {
      flushManualQueue();
    }

    return () => window.removeEventListener('online', handleOnline);
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          // This sets the font for all Ant Design components
          fontFamily: "'Wix Madefor Display', monospace",
        },
      }}>
      <BrowserRouter>
        {true && (<div className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/preferences" element={<Preference />} />
            <Route path="/register" element={<Register />} />
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

    </ConfigProvider >

  );
}

export default App;