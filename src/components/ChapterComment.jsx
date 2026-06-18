const ChapterComment = ({ comment }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)',
        borderLeft: '5px solid #3273dc',
        boxShadow: '0 2px 8px rgba(50, 115, 220, 0.1)',
        borderRadius: '6px',
        padding: '16px',
        marginBottom: '12px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(50, 115, 220, 0.2)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(50, 115, 220, 0.1)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <i className="fas fa-user-circle" style={{ fontSize: '20px', color: '#3273dc', marginTop: '4px', flexShrink: 0 }}></i>
        <div style={{ flex: '1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <strong style={{ fontSize: '14px', color: '#2c3e50' }}>{comment.name}</strong>
            <span style={{ fontSize: '12px', color: '#999' }}>{comment.created_at}</span>
          </div>
          <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.5', margin: '0' }}>{comment.content}</p>
        </div>
      </div>
    </div>
  )
}

export default ChapterComment
