'use client'

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import Navbar from "@/components/Navbar"

const AboutPage = () => {
  return (
    <div>
        <Navbar/>
      <section className="text-center mb-8 mt-8">
        <h1 className="text-2xl md:text-4xl font-bold">About UBC Course Reviews</h1>
        <p className="text-sm md:text-lg mt-4 px-8"> <i>
            Made by Hayden Chan
            <br></br>a random guy that had too much time on his hands
            </i>
        </p>
      </section>

      <section className="mb-4 flex w-[80%] md:w-[60%] justify-center mx-auto">
        <Card className="text-center">
            <CardHeader>
            <h2 className="text-xl md:text-2xl font-semibold">Mission</h2>
            </CardHeader>
            <CardContent>
            <p className="text-sm md:text-md">
                To give students a place to rant about their courses, <br/>
                and upcoming students a chance to learn more about courses they might take!
            </p>
            </CardContent>
        </Card>
        </section>


      <section className="mb-4 flex  w-[80%] md:w-[60%] justify-center mx-auto">
        <Card className="text-center">
          <CardHeader>
            <h2 className="text-xl md:text-2xl font-semibold">Story</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-md">
              During the spring reading break of 2025 <br/>
              Hayden got annoyed that his friend kept planning a PolyU Course Review Website without starting<br/>
              so he decided to write one and prove to him that it&apos;s super doable!
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Meet the Team */}
      <section className="mb-4 flex  w-[80%] md:w-[60%] justify-center mx-auto">
        <Card className="text-center">
          <CardHeader>
            <h2 className="text-xl md:text-2xl font-semibold">Meet the Team</h2>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-md">
                <strong>Bolt.new:</strong> Initial Prototyping
                <br/>
               <strong>ChatGPT and Deepseek:</strong> Technical Support and data cleanup
               <br/>
               <strong>...</strong>
               <br/>
               Oh, and <strong>Hayden Chan:</strong> Building the actual site and designing the UI/UX
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default AboutPage