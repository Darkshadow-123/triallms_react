import React, { useContext } from 'react'
import { RoleContext } from '../context/RoleContext'

const CGView = () => {
  const { themeClass } = useContext(RoleContext)
  return (
    <div className="content-generation">
      <div className={`hero ${themeClass} is-medium`}>
        <div className="hero-body has-text-centered">
          <h1 className="title">Content Generation</h1>
        </div>
      </div>

      <section className="section">
        This is Content Generation Page
      </section>
    </div>
  )
}

export default CGView
