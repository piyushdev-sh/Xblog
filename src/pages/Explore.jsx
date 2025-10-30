import React from 'react'

function Explore() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black text-white text-center px-5">
      <h1 className="text-4xl font-bold mb-3">🚧 Under Development 🚧</h1>
      <p className="text-gray-400 mb-6">We’re crafting something amazing here. Check back soon!</p>
      <button
        onClick={() => window.history.back()}
        className="bg-white text-black font-semibold py-2 px-6 rounded-full hover:bg-gray-200 transition"
      >
        Go Back
      </button>
    </div>
  )
}

export default Explore
