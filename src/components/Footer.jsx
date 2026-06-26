import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { RoleContext } from '../context/RoleContext';

const Footer = () => {
  const { themeClass, activeRole } = useContext(RoleContext);
  
  // Create a subtle background class based on role/theme
  const footerBgClass = activeRole === 'Teacher' ? 'has-background-link-light' : 'has-background-primary-light';

  return (
    <footer className={`footer ${footerBgClass}`} style={{ padding: '4rem 1.5rem 3rem', marginTop: 'auto', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="container">
        
        {/* Trial App Description & Logo */}
        <div className="columns is-vcentered is-centered mb-5">
          <div className="column is-8 has-text-centered">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontWeight: 'bold', lineHeight: '1', fontSize: '2rem', color: '#363636' }}>Verity LMS</span>
              <span style={{ fontSize: '0.85rem', letterSpacing: '3px', color: '#888', fontWeight: '700', textTransform: 'uppercase' }}>Trial</span>
            </div>
            <div className="box" style={{ background: 'transparent', boxShadow: 'none', border: '1px dashed rgba(0,0,0,0.2)' }}>
              <p className="is-size-6 mb-2" style={{ fontWeight: '600' }}>About this Trial App</p>
              <p className="is-size-6" style={{ opacity: 0.8 }}>
                You can find more in the Main App, and more, have the same theme according to the student's and teacher's view. 
                Experience our core features in this interactive preview before upgrading to the full version.
              </p>
            </div>
          </div>
        </div>

        <hr style={{ backgroundColor: 'rgba(0,0,0,0.1)', height: '1px', margin: '2rem 0' }} />

        {/* Contact, Links, and Copyright */}
        <div className="columns is-multiline">
          
          <div className="column is-4 has-text-centered-mobile" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', maxWidth: '250px' }}>
              <h4 className="title is-6 is-uppercase has-text-weight-bold mb-4" style={{ letterSpacing: '1px', color: '#4a4a4a', textAlign: 'left' }}>Contact Information</h4>
              <div className="content is-small" style={{ opacity: 0.85, textAlign: 'left' }}>
                <p className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <span className="icon mr-3"><i className="fas fa-phone"></i></span>
                  <span>+91 9330241335</span>
                </p>
                <p className="mb-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <span className="icon mr-3"><i className="fas fa-envelope"></i></span>
                  <a href="mailto:rustin@junkysolution.com" style={{ color: 'inherit', textDecoration: 'none' }}>rustin@junkysolution.com</a>
                </p>
                <p style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                  <span className="icon mr-3"><i className="fas fa-map-marker-alt"></i></span>
                  <span>Bengaluru, Karnataka, India</span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="column is-4 has-text-centered">
            <h4 className="title is-6 is-uppercase has-text-weight-bold mb-4" style={{ letterSpacing: '1px', color: '#4a4a4a' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }} className="content is-small">
              <li className="mb-2"><Link to="/" style={{ color: 'inherit', opacity: 0.85 }}>Home</Link></li>
              <li className="mb-2"><Link to="/content-Management" style={{ color: 'inherit', opacity: 0.85 }}>Chapters</Link></li>
              <li className="mb-2"><Link to="/performance-&-analytics" style={{ color: 'inherit', opacity: 0.85 }}>Analytics</Link></li>
              <li><Link to="/dashboard/my-account" style={{ color: 'inherit', opacity: 0.85 }}>My Account</Link></li>
            </ul>
          </div>
          
          <div className="column is-4 has-text-centered-mobile has-text-right-tablet">
             <h4 className="title is-6 is-uppercase has-text-weight-bold mb-4" style={{ letterSpacing: '1px', color: '#4a4a4a' }}>Legal</h4>
             <div className="content is-small" style={{ opacity: 0.85 }}>
               <p className="mb-2">Terms of Service</p>
               <p className="mb-4">Privacy Policy</p>
               <p className="has-text-weight-semibold">
                 &copy; 2026 Verity. All rights reserved.
               </p>
             </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
