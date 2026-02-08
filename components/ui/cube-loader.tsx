'use client'

import React from 'react'

export default function CubeLoader() {
  return (
    <div className='fixed inset-0 z-50 flex flex-col items-center justify-center gap-12 bg-background'>

      {/* 3D Scene Wrapper */}
      <div className='relative w-24 h-24 flex items-center justify-center cube-preserve-3d'>

        {/* THE SPINNING CUBE CONTAINER */}
        <div className='relative w-full h-full cube-preserve-3d cube-animate-spin'>

          {/* Internal Core (The energy source) */}
          <div className='absolute inset-0 m-auto w-8 h-8 bg-white rounded-full blur-md shadow-[0_0_40px_rgba(255,255,255,0.8)] cube-animate-pulse-fast' />

          {/* CUBE FACES */}

          {/* Front */}
          <div className='cube-side-wrapper cube-front'>
            <div className='cube-face bg-cyan-500/10 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]' />
          </div>

          {/* Back */}
          <div className='cube-side-wrapper cube-back'>
            <div className='cube-face bg-cyan-500/10 border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.4)]' />
          </div>

          {/* Right */}
          <div className='cube-side-wrapper cube-right'>
            <div className='cube-face bg-purple-500/10 border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]' />
          </div>

          {/* Left */}
          <div className='cube-side-wrapper cube-left'>
            <div className='cube-face bg-purple-500/10 border-2 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)]' />
          </div>

          {/* Top */}
          <div className='cube-side-wrapper cube-top'>
            <div className='cube-face bg-indigo-500/10 border-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]' />
          </div>

          {/* Bottom */}
          <div className='cube-side-wrapper cube-bottom'>
            <div className='cube-face bg-indigo-500/10 border-2 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]' />
          </div>
        </div>

        {/* Floor Shadow */}
        <div className='absolute -bottom-20 w-24 h-8 bg-black/40 blur-xl rounded-[100%] cube-animate-shadow-breathe' />
      </div>

      {/* Loading Text */}
      <div className='flex flex-col items-center gap-1 mt-2'>
        <h3 className='text-sm font-semibold tracking-[0.3em] text-cyan-300 uppercase'>
          Loading
        </h3>
        <p className='text-xs text-slate-400'>
          Preparing your experience, please wait…
        </p>
      </div>
    </div>
  )
}
