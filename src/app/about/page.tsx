'use client'

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import Navbar from "@/components/Navbar"

const AboutPage = () => {
  return (
    <div>
        <Navbar/>
        <div className="text-left md:mx-64">
            <section className="mb-8 mt-8">
              <h1 className="text-2xl md:text-4xl font-bold">About UBC Course Reviews</h1>
              <p className="text-sm md:text-lg mt-4"> <i>
                  Made by Hayden Chan, a random guy that had too much time on his hands
                  </i>
              </p>
            </section>

            <hr className="border-gray-300" />
              <section className="mb-4 mt-4">
                <h2 className="text-2xl md:text-3xl font-semibold">Mission</h2>
                <br/>
                <p className="text-md md:text-lg"> 
                    To be the go-to platform where UBC students share course insights, empowering future students to make informed academic choices.  
                </p>
              </section>

            <hr className="border-gray-300 my-4" />
            <section className="mb-4 mt-4">
                  <h2 className="text-2xl md:text-3xl font-semibold">Community Guidelines</h2>
                  <br/>
                  <p className="text-md md:text-lg leading-loose">
                    <ol >
                      <li>1. Your comments should be respectful</li>
                      <li>2. Do not attack any any UBC Staff</li>
                      <li>3. Negative feedback should be construtive</li>
                      <li>4. Avoid using profanities</li>
                    </ol>
                    <br/>
                    <p><strong>Violating these guidelines may result in your comments being removed.</strong></p>
                  </p>
            </section>
            <hr className="border-gray-300 my-4" />
            <section className="tmb-4 mt-4">
                  <h2 className="text-2xl md:text-3xl font-semibold">A few words from the founder</h2>
                  <br/>
                  <p className="text-md md:text-lg leading-loose">
                    Hey! I am Hayden Chan, a Business and Computer Science student here at UBC. <br/>
                    This is my solo-project aimed at providing a simple platform for UBC students to leave reviews for courses at UBC. <br/>
                    Outside of this project, I am also active on YouTube, giving advice to prospective students looking to apply to UBC! <br/>
                    If you have any feedback for this website, please do so via the google form at the bottom of each page! <br/>
                  </p>
            </section>
          </div>
    </div>
  )
}

export default AboutPage
