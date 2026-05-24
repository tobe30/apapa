import { ArrowUpRight, Briefcase, LocationEdit, MapPin, MessageCircle } from 'lucide-react'
import React from 'react'

import apapa from "../assets/man-w.jpg";
import lekki from "../assets/bridge.jpg";
import awka from "../assets/opey.jpg";
import yaba from "../assets/kekew.jpg";
import festac from "../assets/tet.jpg";
import ikeja from "../assets/apapa.jpg";


const places = [
  { name: "Apapa", region: "Lagos", img: ikeja, q: 248, span: "lg:col-span-2" },
  { name: "Lekki", region: "Lagos", img: apapa, q: 412 },
  { name: "Awka", region: "Anambra", img: awka, q: 187 },
  { name: "Yaba", region: "Lagos", img: lekki, q: 326, span: "lg:col-span-2" },
  { name: "Festac", region: "Lagos", img: festac, q: 154 },
  { name: "Ikeja", region: "Lagos", img: yaba, q: 503 },
];

const FeaturedPlaces = () => {
  return (
    <section className='id="places" className="relative py-16 md:py-20 lg:py-24'>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative text-center mb-20">
          <p
            className="text-secondary text-2xl mb-3"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Featured places
          </p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary leading-tight">
           What curious people 
            <br />
             are asking right now
          </h2>

          {/* Decorative backpack illustration */}
          <LocationEdit
            className="hidden md:block absolute right-0 top-0 w-40 h-40 text-gray-300"
            strokeWidth={1}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 auto-rows-[170px] sm:auto-rows-[190px] md:auto-rows-[180px] lg:auto-rows-[230px]">
          {places.map((p) => (
            <a
              href="#"
              key={p.name}
              className={`group relative rounded-3xl overflow-hidden shadow-card lift min-h-0 ${p.span ?? ""}`}
            >
              <img
                src={p.img}
                alt={`${p.name}, ${p.region}`}
                loading="lazy"
                width={1024}
                height={1280}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />

              <div className="absolute top-4 right-4 glass-dark rounded-full px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md bg-foreground/30 flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3" />
                {p.q} questions
              </div>

              <div className="absolute bottom-0 inset-x-0 p-5 text-primary-foreground">
                <div className="flex text-white items-center gap-1.5 text-[11px] uppercase tracking-widest opacity-80">
                  <MapPin className="w-3 h-3" />
                  {p.region}
                </div>
                <h3 className="font-display text-white text-2xl lg:text-3xl font-bold mt-1 flex items-center justify-between">
                  {p.name}
                  <ArrowUpRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-all" />
                </h3>
              </div>
            </a>
          ))}
        </div>
        </div>
    </section>
  )
}

export default FeaturedPlaces