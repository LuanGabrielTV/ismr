import React from 'react';

const textStyle = {
  fontFamily: 'Wix Madefor Display',
  letterSpacing: -0.5,
  color: 'black'
}

function Offline() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px',

    }}>
      <h1 style={textStyle}>Modo offline</h1>
      <p style={textStyle}>Por favor, verifique sua conexão.</p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          fontFamily: 'Wix Madefor Display',
          backgroundColor: 'black',
          border: 'none',
          borderRadius: 10
        }}
      >
        Tentar novamente
      </button>
    </div>
  );
}

export default Offline;