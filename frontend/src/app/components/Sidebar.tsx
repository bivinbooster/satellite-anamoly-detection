"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const navItems = [
    { href: '/', label: 'Overview', icon: '📊' },
    { href: '/analysis', label: 'Analysis', icon: '🔍' },
    { href: '/confidence', label: 'Confidence', icon: '📈' },
    { href: '/resolution', label: 'Resolution', icon: '🔎' },
    { href: '/runs', label: 'Run History', icon: '⏳' },
    { href: '/settings', label: 'Settings', icon: '⚙️' }
  ]

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-0 h-full w-72 lg:w-64 bg-gradient-to-b from-slate-900/95 to-purple-900/95 backdrop-blur-xl border-r border-slate-700/50 z-50 shadow-2xl"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ rotate: isCollapsed ? 180 : 0 }}
            className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-xl flex items-center justify-center"
          >
            <span className="text-sm font-bold text-slate-900">AI</span>
          </motion.div>
          <div className="min-w-0">
            <h2 className="text-xl font-display font-black text-white truncate">
              Anomaly Studio
            </h2>
            <p className="text-xs text-slate-400 font-medium">Satellite AI</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link href={item.href} key={item.href}>
              <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`glass p-4 rounded-2xl cursor-pointer flex items-center gap-4 transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-cyan-400/40 shadow-lg shadow-cyan-500/25' 
                    : 'hover:bg-white/10'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-semibold text-white group-hover:text-cyan-300 truncate">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active"
                    className="ml-auto w-2 h-8 bg-gradient-to-b from-cyan-400 to-purple-400 rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                )}
              </motion.div>
            </Link>
          )
        })}
      </nav>
    </motion.div>
  )
}
