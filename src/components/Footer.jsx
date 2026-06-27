import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';

const Footer = () => {
  const { themeClass, activeRole } = useContext(RoleContext);
  
  // Create a subtle background class based on role/theme
  const footerBgClass = activeRole === 'Teacher' ? 'has-background-link-light' : 'has-background-primary-light';

  return (
    <footer className={`footer ${footerBgClass}`} style={{ padding: '4rem 1.5rem 2rem', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container">
        <div className="columns is-variable is-8">
          
          {/* Brand & Description */}
          <div className="column is-5">
            <div style={{ display: 'flex', alignItems: 'center',justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <span style={{ fontWeight: 'bold', lineHeight: '1', fontSize: '2rem', color: '#363636' }}>Verity LMS</span>
                <span style={{ fontSize: '0.85rem', letterSpacing: '3px', color: '#888', fontWeight: '700', textTransform: 'uppercase', marginTop: '0.2rem' }}>Trial</span>
              </div>
            </div>
            <p className="is-size-6" style={{ opacity: 0.8, lineHeight: '1.6' }}>
              This <strong>Trial Version</strong> highlights the design and user experience of <strong>Verity LMS</strong> — a learning management platform built for modern schools, teachers, and students. It demonstrates the interface, navigation, and theme customization available across student and teacher accounts.\
              The <strong>full platform</strong> offers significantly more: <strong>secure access management for entire institutions, academic insights, and an integrated AI engine that can read and interpret textbooks, handwritten notes, and PDF documents — automatically generating structured notes, Homeworks, and assessments.</strong> This enables schools to streamline content preparation while maintaining a high standard of educational quality.
            </p>
          </div>

          {/* Quick Links */}
          <div className="column is-3">
            <h4 className="title is-6 is-uppercase has-text-weight-bold mb-4" style={{ letterSpacing: '1px', color: '#4a4a4a' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} className="content is-small">
              <li className="mb-3"><Link to="/" style={{ color: 'inherit', opacity: 0.85, transition: 'opacity 0.2s' }}>Home</Link></li>
              <li className="mb-3"><Link to="/content-Management" style={{ color: 'inherit', opacity: 0.85, transition: 'opacity 0.2s' }}>Chapters</Link></li>
              <li className="mb-3"><Link to="/performance-&-analytics" style={{ color: 'inherit', opacity: 0.85, transition: 'opacity 0.2s' }}>Analytics</Link></li>
              <li><Link to="/dashboard/my-account" style={{ color: 'inherit', opacity: 0.85, transition: 'opacity 0.2s' }}>My Account</Link></li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div className="column is-4">
            <h4 className="title is-6 is-uppercase has-text-weight-bold mb-4" style={{ letterSpacing: '1px', color: '#4a4a4a' }}>Contact Us</h4>
            <div className="content is-small" style={{ opacity: 0.85 }}>
              <p className="mb-3" style={{ display: 'flex', alignItems: 'center' , justifyContent: 'center'}}>
                <span className="icon mr-3 has-text-primary"><i className="fas fa-phone"></i></span>
                <span>+91 9330241335</span>
              </p>
              <p className="mb-3" style={{ display: 'flex', alignItems: 'center' ,  justifyContent: 'center'}}>
                <span className="icon mr-3 has-text-info"><i className="fas fa-envelope"></i></span>
                <a href="mailto:rustin@junkysolution.com" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.2s' }}>rustin@junkysolution.com</a>
              </p>
              <p style={{ display: 'flex', alignItems: 'flex-start',  justifyContent: 'center'}}>
                <span className="icon mr-3 has-text-danger"><i className="fas fa-map-marker-alt"></i></span>
                <span>Bengaluru, Karnataka, India</span>
              </p>
            </div>
          </div>
          
        </div>

        <hr style={{ backgroundColor: 'rgba(0,0,0,0.1)', height: '1px', margin: '2.5rem 0 1.5rem' }} />

        {/* Copyright */}
        <div className="has-text-centered">
          <p className="is-size-7" style={{ opacity: 0.7, fontWeight: '500' }}>
            &copy; 2026 Verity. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
