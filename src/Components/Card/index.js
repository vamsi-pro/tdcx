import React from 'react'

// styles
import './styles.scss'

const Card = ({ children }) => {
    return <div className="card wrapper bg-white p-3 mx-3">{children}</div>
}

export default Card
