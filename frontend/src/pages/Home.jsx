import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Why from '../components/Why'
import FeaturedPlaces from '../components/FeaturedPlaces'
import LiveQuestions from '../components/LiveQuestions'
import HowItWorks from '../components/HowItWorks'
import RecognitionSection from '../components/Recognition'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <main className="min-h-screen bg-background overflow-x-hidden">
    <Navbar/>
    <Hero/>
    <Why/>
    <FeaturedPlaces/>
    <LiveQuestions/>
    <HowItWorks/>
    <RecognitionSection/>
    <CTA/>
    <Footer/>
    </main>
  )
}

export default Home