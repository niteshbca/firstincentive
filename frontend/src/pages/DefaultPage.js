import React from 'react';

const DefaultPage = () => (
  <div style={bodyStyle}>
    <nav style={navStyle}>
      <a href="https://hpanel.hostinger.com" rel="nofollow" target="_blank" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
        <img src="https://hpanel.hostinger.com/favicons/hostinger.png" alt="Hostinger" style={{ height: 30, marginRight: 10 }} />
        <span style={{ color: 'white', fontWeight: 700, fontSize: 20 }}>Hostinger</span>
      </a>
    </nav>
    <div style={contentStyle}>
      <img
        src="https://assets.hostinger.com/content/hostinger_welcome/v2/man1.png"
        alt="Welcome"
        style={{ width: '100%', maxWidth: 650, maxHeight: 406, height: 'auto' }}
      />
      <h1 style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 24, fontWeight: 700, margin: 8 }}>You Are All Set to Go!</h1>
      <p style={pStyle}>All you have to do now is upload your website files and start your journey. Check out how to do that below:</p>
      <div style={linkContainerStyle}>
        <a
          className="link"
          href="https://support.hostinger.com/en/articles/4455931-how-can-i-migrate-website-to-hostinger"
          rel="nofollow"
          target="_blank"
          style={linkStyle}
        >
          How can I migrate a website to Hostinger?
        </a>
        <a
          className="link"
          href="https://support.hostinger.com/en/articles/3220304-how-to-install-wordpress-using-auto-installer"
          rel="nofollow"
          target="_blank"
          style={linkStyle}
        >
          How to install WordPress using Auto Installer?
        </a>
      </div>
    </div>
  </div>
);

const bodyStyle = {
  margin: 0,
  minHeight: '100vh',
  backgroundColor: '#F4F5FF',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
};
const navStyle = {
  width: '100%',
  height: 72,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#36344D',
};
const contentStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  maxWidth: 650,
};
const pStyle = {
  width: '100%',
  fontSize: 16,
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 400,
  letterSpacing: 0,
  textAlign: 'center',
  color: '#727586',
  margin: 0,
  maxWidth: 550,
};
const linkContainerStyle = {
  marginTop: 32,
  marginBottom: 32,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};
const linkStyle = {
  display: 'flex',
  alignItems: 'center',
  fontFamily: 'DM Sans, sans-serif',
  fontWeight: 700,
  fontSize: 14,
  color: '#673DE6',
  marginTop: 8,
  textDecoration: 'none',
};

export default DefaultPage; 