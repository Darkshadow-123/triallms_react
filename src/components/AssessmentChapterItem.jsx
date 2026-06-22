import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { RoleContext } from '../context/RoleContext'

const AssessmentChapterItem = ({ chapter }) => {
  const { themeClass, themeHex, themeGradient } = useContext(RoleContext)
  return (
    <div
      style={{
        background: themeGradient,
        borderLeft: `5px solid ${themeHex}`,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '6px',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.15)'
        e.currentTarget.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ marginBottom: '0', overflow: 'hidden', borderRadius: '0 0 0 0' }}>
        <img
          src="http://bulma.io/images/placeholders/1280x960.png"
          alt="Assessment Chapter"
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
          }}
        />
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: '1' }}>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <i className="fas fa-question-circle" style={{ fontSize: '24px', color: themeHex }}></i>
          <h3
          style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#2c3e50',
            margin: '0',
            flex: '1'
          }}
        >
          {chapter.chapter_name}
        </h3>
        </div>

        <p
          style={{
            fontSize: '14px',
            color: '#555',
            lineHeight: '1.6',
            marginBottom: '16px',
            flex: '1'
          }}
        >
          {chapter.short_description}
        </p>

        <Link
        to={`/assessment-Management/${chapter.slug}`}
        className={`button ${themeClass}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: '4px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '600',
          transition: '0.3s ease',
          border: 'none',
          cursor: 'pointer',
          alignSelf: 'flex-start'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.9'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <i className="fas fa-list-check" style={{ marginRight: '8px' }}></i>
        View Quizzes
      </Link>
    </div>
    </div>
  )
}

export default AssessmentChapterItem
