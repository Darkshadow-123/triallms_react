import { useContext } from 'react'
import { RoleContext } from '../context/RoleContext'

const CreateModeTabs = ({ activeTab, onTabChange }) => {
  const { themeHex, themeLightHex } = useContext(RoleContext)
  const containerStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    padding: '8px',
    backgroundColor: themeLightHex,
    borderRadius: '10px',
    border: '1px solid rgba(0, 0, 0, 0.15)',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.08)'
  }

  const getTabStyle = (tab) => {
    const isActive = activeTab === tab
    const isManual = tab === 'manual'

    const base = {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '0.85rem 1.25rem',
      fontWeight: '600',
      fontSize: '15px',
      borderRadius: '8px',
      border: '2px solid',
      cursor: 'pointer',
      transition: 'all 0.25s ease',
      outline: 'none'
    }

    if (isManual) {
      return isActive
        ? {
            ...base,
            backgroundColor: themeHex,
            color: '#ffffff',
            borderColor: themeHex,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)'
          }
        : {
            ...base,
            backgroundColor: '#ffffff',
            color: themeHex,
            borderColor: themeHex
          }
    }

    return isActive
      ? {
          ...base,
          backgroundColor: '#7c3aed',
          color: '#ffffff',
          borderColor: '#7c3aed',
          boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
        }
      : {
          ...base,
          backgroundColor: '#ffffff',
          color: '#7c3aed',
          borderColor: '#7c3aed'
        }
  }

  const handleMouseEnter = (e, tab) => {
    if (activeTab === tab) return
    const isManual = tab === 'manual'
    e.currentTarget.style.backgroundColor = isManual ? themeHex : '#7c3aed'
    e.currentTarget.style.color = '#ffffff'
    e.currentTarget.style.boxShadow = isManual
      ? '0 4px 12px rgba(0, 0, 0, 0.15)'
      : '0 4px 12px rgba(124, 58, 237, 0.3)'
  }

  const handleMouseLeave = (e, tab) => {
    if (activeTab === tab) return
    const isManual = tab === 'manual'
    e.currentTarget.style.backgroundColor = '#ffffff'
    e.currentTarget.style.color = isManual ? themeHex : '#7c3aed'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div style={containerStyle} role="tablist" aria-label="Create mode">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'manual'}
        onClick={() => onTabChange('manual')}
        style={getTabStyle('manual')}
        onMouseEnter={(e) => handleMouseEnter(e, 'manual')}
        onMouseLeave={(e) => handleMouseLeave(e, 'manual')}
      >
        <i className="fas fa-pen" aria-hidden="true"></i>
        <span>Manual Entry</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === 'ai'}
        onClick={() => onTabChange('ai')}
        style={getTabStyle('ai')}
        onMouseEnter={(e) => handleMouseEnter(e, 'ai')}
        onMouseLeave={(e) => handleMouseLeave(e, 'ai')}
      >
        <i className="fas fa-robot" aria-hidden="true"></i>
        <span>Generate with AI</span>
      </button>
    </div>
  )
}

export default CreateModeTabs
