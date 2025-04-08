import React from 'react'
import { X } from 'lucide-react'
import { motion } from 'framer-motion'

const Sidebar = ({ isOpen, onClose, skill }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        />
      )}
      <motion.div
        className="fixed top-0 right-0 w-full sm:w-[30%] h-full bg-gray-800 z-50 overflow-y-auto"
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? 0 : '100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
          {skill && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-white mb-4">{skill.name}</h2>
              <p className="text-gray-400 mb-4">Level: {skill.level}</p>
              <p className="text-gray-300">{skill.description}</p>
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default Sidebar

