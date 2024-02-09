import React from 'react'

function home() {
    const x = process.env.REACT_APP_YZ;

  return (
    <div>
      {x} hi
    </div>
  )
}

export default home
