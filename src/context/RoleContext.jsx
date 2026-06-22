import React, { createContext, useState } from 'react'

export const RoleContext = createContext()

export const RoleProvider = ({ children }) => {
  const [activeRole, setActiveRole] = useState('Student')

  // Computed properties based on the role
  const themeClass = activeRole === 'Student' ? 'is-info' : 'is-primary'
  const themeHex = activeRole === 'Student' ? '#3273dc' : '#00d1b2'
  const themeLightHex = activeRole === 'Student' ? '#f0f7ff' : '#ebfffc'
  const themeGradient = activeRole === 'Student' 
    ? 'linear-gradient(135deg, #f0f7ff 0%, #e8f4ff 100%)'
    : 'linear-gradient(135deg, #ebfffc 0%, #e0f8f5 100%)'

  return (
    <RoleContext.Provider 
      value={{ 
        activeRole, 
        setActiveRole,
        themeClass,
        themeHex,
        themeLightHex,
        themeGradient
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}
