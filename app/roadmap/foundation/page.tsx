"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Foundation() {
  const [submitted, setSubmitted] = useState(false)
  const [userInput, setUserInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <div className="flex w-full justify-between">
          <a className="flex items-center justify-center" href="#">
            <span className="font-bold text-xl">Student Portal</span>
          </a>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="space-y-4 max-w-3xl mx-auto text-center">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Find the right college or university for you
                </h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Search for colleges and universities that match your interests and career goals. Our personalized roadmap will guide you through the process.
                  <br />
                </p>
              </div>
              
              {!submitted ? (
                <div className="mx-auto w-full max-w-xl">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="goal" className="text-sm font-medium">
                        Find the right college or university for you
                      </label>
                      <Input
                        id="goal"
                        placeholder="Enter your education details, CET score, areas of interest, etc."
                        className="w-full p-4 h-24"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Find College courses
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">Here's a list of College Courses and Programs</h2>
                    <p className="text-gray-500 mt-2">
                      Based on your criteria: <span className="font-medium text-black">{userInput}</span>
                    </p>
                  </div>
                  
                  <div className="flex flex-col space-y-6 max-w-2xl mx-auto">
                    <Card>
                      <CardHeader>
                        <CardTitle>College 1</CardTitle>
                        <CardDescription>Course name</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Course Name.</p>
                        <ul className="list-disc list-inside mt-4 space-y-1 text-sm">
                          <li>Fee info</li>
                          <li>Avg Cutoff</li>
                          <li>Placement info</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>College 2</CardTitle>
                        <CardDescription>Course name</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Course name.</p>
                        <ul className="list-disc list-inside mt-4 space-y-1 text-sm">
                          <li>Fee info</li>
                          <li>Avg cutoff</li>
                          <li>Placement info</li>
                        </ul>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>College 3</CardTitle>
                        <CardDescription>Course name</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p>Course name.</p>
                        <ul className="list-disc list-inside mt-4 space-y-1 text-sm">
                          <li>Fee info</li>
                          <li>Avg Cutoff</li>
                          <li>Placement info</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-center mt-8">
                    <Button onClick={() => setSubmitted(false)}>
                      Do this crap again
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}