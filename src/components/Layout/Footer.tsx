import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🧁 Confeitaria Doce Sabor</h3>
            <p>
              Os melhores doces artesanais da cidade, feitos com amor e
              ingredientes selecionados.
            </p>
          </div>

          <div className="footer-section">
            <h4>Contato</h4>
            <p>📱 (15) 99674-7692</p>
            <p>📧 contato@docesabor.com.br</p>
            <p>📍 Rua das Delícias, 123 - Centro</p>
          </div>

          <div className="footer-section">
            <h4>Horários</h4>
            <p>Segunda à Sábado: 8h às 18h</p>
            <p>Domingo: 8h às 14h</p>
          </div>

          <div className="footer-section">
            <h4>Redes Sociais</h4>
            <p>🟢 WhatsApp: (15) 99674-7692</p>
            <p>📘 Facebook: @DoceSabor</p>
            <p>📷 Instagram: @confeitariadocesabor</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; 2024 Confeitaria Doce Sabor. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
