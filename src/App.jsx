import { Button, DatePicker, Space, ConfigProvider } from 'antd';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from "./Home";
import PreferencePage from "./PreferencePage";
import Install from './components/Install';
import useOnlineStatus from './hooks/useOnlineStatus';
import Offline from './components/Offline';

function App() {
  const isOnline = useOnlineStatus();

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
            <Route path="/preferences" element={<PreferencePage />} />
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