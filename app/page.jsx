'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Flame, Wind, Globe, Users, Satellite, BarChart } from 'lucide-react'

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
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className={`font-cabinet text-3xl md:text-4xl font-bold ${isScrolled ? 'text-blue-800' : 'text-blue-100'} transition-colors duration-300`}>EarthConnect</Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link href="#team" className={`font-satoshi text-lg ${isScrolled ? 'text-blue-700' : 'text-blue-100'} hover:text-blue-300 transition-colors duration-200`}>
              Learn More
            </Link>
          </motion.div>
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
              className="font-cabinet text-6xl md:text-8xl font-bold text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Connect with the Earth
            </motion.h1>
            <motion.p 
              className="font-satoshi text-xl md:text-2xl text-blue-100"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Wildfires and Air Quality in Real Time
            </motion.p>
            <motion.p 
              className="font-satoshi text-lg md:text-xl text-blue-200 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Discover how wildfires affect the air we breathe. Explore real-time data, visualize the impact, and take action for a healthier planet.
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
                <Link href="./global">Explore Now</Link> <ArrowRight className="inline-block ml-2" />
              </motion.button>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20 bg-blue-200">
          <div className="container mx-auto px-6">
            <h2 className="font-cabinet text-4xl md:text-5xl font-bold text-center text-blue-800 mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<Flame className="w-10 h-10 text-blue-500" />}
                title="Real-time Visualization"
                description="Explore global wildfires with constantly updated satellite data from VIIRS, MODIS, and SENTINEL-2."
              />
              <FeatureCard 
                icon={<Wind className="w-10 h-10 text-blue-500" />}
                title="Air Quality Analysis"
                description="Understand the relationship between fires and air quality with precise data on NO2, CO2, and other pollutants from OpenWeather and NASA."
              />
              <FeatureCard 
                icon={<Globe className="w-10 h-10 text-blue-500" />}
                title="Interactive 3D World"
                description="Navigate a 3D globe to explore data immersively and customize visualizations by region."
              />
              <FeatureCard 
                icon={<Satellite className="w-10 h-10 text-blue-500" />}
                title="Advanced Satellite Data"
                description="Utilize high-resolution observations from VIIRS (NOAA 20), MODIS (Terra & Aqua), and SENTINEL-2 for comprehensive analysis."
              />
              <FeatureCard 
                icon={<BarChart className="w-10 h-10 text-blue-500" />}
                title="Analysis Tools"
                description="Facilitate the analysis of interconnections between atmospheric variables and climate events for researchers and citizens."
              />
              <FeatureCard 
                icon={<Users className="w-10 h-10 text-blue-500" />}
                title="Environmental Awareness"
                description="Provide a valuable resource for researchers, environmentalists, and citizens committed to a sustainable future."
              />
            </div>
          </div>
        </section>

        <section id="motivation" className="py-20 bg-blue-300">
          <div className="container mx-auto px-6">
            <h2 className="font-cabinet text-4xl md:text-5xl font-bold text-center text-blue-800 mb-12">Our Motivation</h2>
            <motion.p 
              className="font-satoshi text-lg md:text-xl text-blue-700 max-w-3xl mx-auto text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              The increasing frequency and intensity of wildfires globally is affecting health and the environment. Our application aims to offer a powerful tool for users to understand how these disasters influence air quality and ultimately impact the daily lives of millions.
            </motion.p>
          </div>
        </section>

        <section id="satellites" className="py-20 bg-blue-200">
        <div className="container mx-auto px-6">
          <h2 className="font-cabinet text-4xl md:text-5xl font-bold text-center text-blue-800 mb-12">Cutting-Edge Technology</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <SatelliteInfo 
              name="VIIRS (NOAA 20)"
              description="High-resolution sensor for fire detection and atmospheric aerosol measurement."
            />
            <SatelliteInfo 
              name="MODIS (Terra & Aqua)"
              description="Daily images of Earth's surface, observing fires and atmospheric parameters."
            />
            <SatelliteInfo 
              name="SENTINEL-2"
              description="High-resolution optical images for vegetation monitoring and disaster management."
            />
            <SatelliteInfo 
              name="OpenWeather API"
              description="Integration of air quality data such as NO2, CO2, and other pollutants."
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-8 rounded-lg shadow-md text-blue-700 font-satoshi text-lg leading-relaxed text-center"
          >
            <p className="mb-4 font-bold">
              In the application, we focus on visualizing and calculating three key variables related to wildfires. The first is Brightness, measured by satellite sensors, which indicates the intensity of the heat emitted by the fire. The second is the Fire Radiative Power (FRP), a measure of the energy released by the fire, providing insights into the fire's intensity and potential impact.
            </p>
            <p className="font-bold">
              Lastly, we track the number of thermal anomalies, which helps identify hotspots and areas where fire activity or unusual heat patterns are detected. These variables combined offer a comprehensive view of fire dynamics and their effects on the environment.
            </p>
          </motion.div>
        </div>
      </section>

        <section id="team" className="py-20 bg-blue-300">
          <div className="container mx-auto px-6">
            <h2 className="font-cabinet text-4xl md:text-5xl font-bold text-center text-blue-800 mb-12">Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              <TeamMember 
                name="Daniel David Herrera Acevedo"
                role={<a href="https://github.com/daniherreraa" target="_blank" rel="noopener noreferrer">acevedod@utb.edu.co</a>}
              />
              <TeamMember 
                name="David Josue Ruiz Moralesz"
                role={<a href="https://github.com/David05R" target="_blank" rel="noopener noreferrer">daruiz@utb.edu.co</a>}
              />
              <TeamMember 
                name="Jesus David Petro Ramos"
                role={<a href="https://github.com/JesusPetro" target="_blank" rel="noopener noreferrer">jpetro@utb.edu.co</a>}
              />
              <TeamMember 
                name="Andres Felipe Garcia Teheran"
                role={<a href="https://github.com/AndresGarcia-15" target="_blank" rel="noopener noreferrer">teherana@utb.edu.co</a>}
              />
              <TeamMember 
                name="David Sierra Porta"
                role={<a href="https://github.com/sierraporta" target="_blank" rel="noopener noreferrer">dporta@utb.edu.co</a>}
              />
            </div>
            <motion.div 
              className="text-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                href="https://www.utb.edu.co/investigacion/apoyo-a-la-investigacion/semilleros-de-investigacion/semillero-astronomia-ciencia-de-datos/"
                className="font-satoshi text-lg bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors duration-200 inline-block"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about our research team
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-blue-800 text-blue-100 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="font-satoshi mb-4">&copy; 2024 EarthConnect | Developed by the Astronomy and Data Science Research Group at UTB</p>
          <div className="flex justify-center space-x-4">
            <Link href="#" className="hover:text-blue-300 transition-colors duration-200">Terms</Link>
            <Link href="#" className="hover:text-blue-300 transition-colors duration-200">Privacy</Link>
            <Link href="#" className="hover:text-blue-300 transition-colors duration-200">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="font-cabinet text-xl font-bold text-blue-700 mb-2">{title}</h3>
      <p className="font-satoshi text-blue-600">{description}</p>
    </div>
  )
}

function SatelliteInfo({ name, description }) {
  return (
    <motion.div 
      className="bg-blue-100 p-6 rounded-lg shadow-md"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <h3 className="font-cabinet text-xl font-bold text-blue-700 mb-2">{name}</h3>
      <p className="font-satoshi text-blue-600">{description}</p>
    </motion.div>
  )
}

function TeamMember({ name, role }) {
  return (
    <motion.div 
      className="bg-blue-100 p-6 rounded-lg text-center w-full max-w-xs"
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