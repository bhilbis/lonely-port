"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Home, Mail } from 'lucide-react'

const NavDown = () => {
  return (
    <div className='fixed flex justify-center items-end bottom-0 w-full z-50 pb-6'>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className='flex items-center gap-4 px-6 py-3 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-full shadow-lg border border-gray-200 dark:border-neutral-700'
      >
        <Link href="/" className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-full hover:bg-black/20 dark:hover:bg-gray-100/20">
          <Home size={20} />
        </Link>
        <Link href="mailto:bhilbis123@gmail.com" className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors rounded-full hover:bg-black/20 dark:hover:bg-gray-100/20">
          <Mail size={20} />
        </Link>
      </motion.div>
    </div>
  )
}

export default NavDown