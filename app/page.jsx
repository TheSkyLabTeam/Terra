'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Flame, Wind, Globe, Users } from 'lucide-react'
import dynamic from 'next/dynamic'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 to-blue-400 text-blue-900">
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-blue-200 shadow-md' : ''}`}>
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-cabinet text-2xl font-bold text-blue-800">EarthConnect</Link>
          <div className="space-x-4">
            <Link href="#features" className="font-satoshi text-blue-700 hover:text-blue-500 transition-colors duration-200">Características</Link>
            <Link href="#visualization" className="font-satoshi text-blue-700 hover:text-blue-500 transition-colors duration-200">Visualización</Link>
            <Link href="#team" className="font-satoshi text-blue-700 hover:text-blue-500 transition-colors duration-200">Equipo</Link>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="font-satoshi bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Iniciar
            </motion.button>
          </div>
        </nav>
      </header>

      <main>
        <section className="h-screen flex items-center justify-center text-center relative overflow-hidden">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600"
            style={{ opacity }}
          />
          <div className="relative z-10 space-y-6 max-w-4xl mx-auto px-6">
            <motion.h1 
              className="font-cabinet text-5xl md:text-7xl font-bold text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Conéctate con la Tierra
            </motion.h1>
            <motion.p 
              className="font-satoshi text-xl md:text-2xl text-blue-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Incendios Forestales y Calidad del Aire en Tiempo Real
            </motion.p>
            <motion.p 
              className="font-satoshi text-lg md:text-xl text-blue-200 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Descubre cómo los incendios forestales afectan el aire que respiramos. Explora datos en tiempo real, visualiza el impacto y toma acción por un planeta más saludable.
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: '#1881b1' }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 text-white font-satoshi font-bold py-3 px-8 rounded-full transition-all duration-200"
              >
                <Link href="/global">
                  Iniciar Exploración
                </Link><ArrowRight className="inline-block ml-2" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20 bg-blue-200">
          <div className="container mx-auto px-6">
            <h2 className="font-cabinet text-4xl md:text-5xl font-bold text-center text-blue-800 mb-12">Características Principales</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Flame className="w-10 h-10 text-blue-500" />}
                title="Visualización en Tiempo Real"
                description="Explora incendios forestales globales con datos satelitales actualizados constantemente."
              />
              <FeatureCard 
                icon={<Wind className="w-10 h-10 text-blue-500" />}
                title="Análisis de Calidad del Aire"
                description="Comprende la relación entre incendios y calidad del aire con datos precisos."
              />
              <FeatureCard 
                icon={<Globe className="w-10 h-10 text-blue-500" />}
                title="Mundo 3D Interactivo"
                description="Navega por un globo terráqueo 3D para explorar datos de manera inmersiva."
              />
            </div>
          </div>
        </section>
        <section id="team" className="py-20 bg-blue-200">
          <div className="container mx-auto px-6">
            <h2 className="font-cabinet text-4xl md:text-5xl font-bold text-center text-blue-800 mb-12">Nuestro Equipo</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TeamMember 
                name="Ana Rodríguez"
                role="Desarrolladora Frontend"
              />
              <TeamMember 
                name="Carlos Gómez"
                role="Científico de Datos"
              />
              <TeamMember 
                name="Laura Martínez"
                role="Ingeniera de Software"
              />
              <TeamMember 
                name="Laura Martínez"
                role="Ingeniera de Software"
              />
            </div>
            <div className="text-center mt-12">
              <Link 
                href="https://www.utb.edu.co/investigacion/apoyo-a-la-investigacion/semilleros-de-investigacion/semillero-astronomia-ciencia-de-datos/"
                className="font-satoshi text-blue-600 hover:text-blue-700 transition-colors duration-200"
                target="_blank"
                rel="noopener noreferrer"
              >
                Conoce más sobre nuestro equipo de investigación
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-blue-800 text-blue-100 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="font-satoshi mb-4">&copy; 2024 EarthConnect | Desarrollado por el Grupo de Investigación de Astronomía y Ciencia de Datos de la UTB</p>
          <div className="flex justify-center space-x-4">
            <Link href="#" className="hover:text-blue-300 transition-colors duration-200">Términos</Link>
            <Link href="#" className="hover:text-blue-300 transition-colors duration-200">Privacidad</Link>
            <Link href="#" className="hover:text-blue-300 transition-colors duration-200">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
      whileHover={{ y: -5, backgroundColor: '#8bd1ee' }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div 
        className="mb-4"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <h3 className="font-cabinet text-xl font-bold text-blue-700 mb-2">{title}</h3>
      <p className="font-satoshi text-blue-600">{description}</p>
    </motion.div>
  )
}

function TeamMember({ name, role }) {
  return (
    <motion.div 
      className="bg-blue-100 p-6 rounded-lg text-center"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.div 
        className="w-24 h-24 bg-blue-300 rounded-full mx-auto mb-4 flex items-center justify-center"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Users className="w-12 h-12 text-blue-600" />
      </motion.div>
      <h3 className="font-cabinet text-xl font-bold text-blue-700">{name}</h3>
      <p className="font-satoshi text-blue-600">{role}</p>
    </motion.div>
  )
}