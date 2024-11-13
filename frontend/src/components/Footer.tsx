import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div style={fundStyle}></div>
      <div style={footerStyle}>
        <div style={separatorStyle}></div>
        <p style={paragraphStyle}>
          Copyright © {currentYear} Vinocolor Inc. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  width: "100%",
  position: "sticky",
  bottom: 0,
  zIndex: 100,
  background: "#FFFFFF",
};
const separatorStyle: React.CSSProperties = {
  width: "calc(100% - 184px)",
  borderTop: "3px solid var(--secondary-color)",
  margin: "0 auto",
};

const paragraphStyle: React.CSSProperties = {
  marginTop: "20px",
  marginBottom: "40px",
};

const fundStyle: React.CSSProperties = {
  height: "20px",
  top: "-20px",
  background: "linear-gradient(to top, #fff, transparent)",
};

export default Footer;
