import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={footerStyle}>
      <p>&copy; {currentYear} Mon Projet. Tous droits réservés.</p>
    </footer>
  );
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#242424",
  textAlign: "center",
  padding: "10px",
  position: "fixed",
  left: 0,
  bottom: 0,
  width: "100%",
  boxShadow: "0 -1px 5px rgba(0,0,0,0.1)",
  color: "#fff",
};

export default Footer;
