import React from 'react'

const CTA = () => {
  return (
    <section className="max-w-5xl mx-auto p-8 md:p-12 bg-[var(--accent-mint)] rounded-2xl text-[var(--color-primary)]">
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
    {/*----------- right div -----------*/}
    <div className="lg:col-span-3 space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
          Find your next hire
        </h1>
        <p className="text-xl md:text-2xl font-medium mt-4 text-[var(--color-primary)]/90">
          For short tasks, long projects, or full-time roles
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[var(--color-cta)]"></div>
          <p className="text-lg">Access to thousands of pre-vetted professionals</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[var(--color-cta)]"></div>
          <p className="text-lg">Flexible hiring models for any budget</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[var(--color-cta)]"></div>
          <p className="text-lg">Quick matching with the right talent</p>
        </div>
      </div>
      
      <p className="text-2xl font-medium">
        Make it happen with our extensive talent pool
      </p>
    </div>
    
    {/*----------- left side-------- */}
    <div className="lg:col-span-2">
      <div className="rounded-3xl p-8 text-center lg:text-left">
        <p className="text-2xl font-semibold mb-8">
          Let's grow your future together.
        </p>
        <button className="px-10 py-4 bg-[var(--color-cta)] text-[var(--color-secondary)] rounded-full text-lg font-bold hover:shadow-lg transition-all duration-300 hover:scale-105 w-full lg:w-auto">
          Explore Services
        </button>
      </div>
    </div>
  </div>
</section>
  )
}

export default CTA