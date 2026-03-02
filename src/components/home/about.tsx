"use client";

import React from 'react';
import { motion }  from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { achievements, experience, interests } from '@/lib/data';

export function About() {
  return (
    <section id='about' className='relative scroll-mt-28 py-20 sm:py-24 lg:py-28'>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-24 -translate-y-full bg-gradient-to-b from-[oklch(0.12_0_0)] to-[oklch(0.12_0_0/0)] sm:h-32"
      />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className='mb-12 sm:mb-14'>
          <div className='w-full flex justify-center items-center'>
            <div className="flex items-center text-center gap-2 px-4 py-2 bg-black/5 dark:bg-white/5 backdrop-blur-sm rounded-full border border-black/10 dark:border-white/10 mb-4 sm:mb-6">
              <span className="text-black/80 dark:text-white/80 text-md font-medium"><span className='text-lg'>🧑‍🦱</span> Personal</span>
            </div>
          </div>
          <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          viewport={{ once: true }}
          className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="inline-block"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                About Me
              </h2>
            </motion.div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-4 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <Card className="overflow-hidden p-4">
                <CardHeader className='px-4'>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Hello, I&apos;m Flexsy Bilbis Triwibowo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    A passionate fullstack developer from Indonesia with a love for creating 
                    digital experiences that matter. I believe in the power of clean code, 
                    thoughtful design, and continuous learning.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    When I&apos;m not coding, you&apos;ll find me exploring new technologies or perfecting my coffee brewing skills.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <div className="flex flex-wrap gap-2 p-4">
                    {interests.map((interest) => (
                      <Badge key={interest.title} variant="secondary" className='flex items-center gap-1'>
                        {interest.icon ? <interest.icon size={30} width={30} color={interest.color}/> : null}
                        <span>{interest.title}</span>
                      </Badge>
                    ))}
                </div>
              </Card>
            </motion.div>

            <Card>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Tabs defaultValue="journey" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="journey">Journey</TabsTrigger>
                    <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="achievements" className="space-y-4">
                    <div className="grid gap-4 max-h-80 overflow-y-auto pr-2">
                      {achievements.map((ach, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                        >
                          <Card className="p-4 shadow-md">
                            <div className="space-y-1">
                              <h4 className="font-semibold">{ach.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                {ach.org} • {ach.date}
                              </p>
                              {ach.credential !== "—" && (
                                <p className="text-xs text-muted-foreground">
                                  ID Kredensial: {ach.credential}
                                </p>
                              )}
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="journey" className="space-y-4">
                    <div className="space-y-6">
                      {experience.map((item, index) => (
                        <motion.div
                          key={item.year}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 10 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          viewport={{ once: true }}
                          className="relative pl-4 border-l-2 border-muted"
                        >
                          <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full"></div>
                          <Card className='mr-4'>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{item.year}</Badge>
                              </div>
                              <h4 className="font-semibold">{item.title}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </motion.div>
            </Card>
          </div>
        </div>

        {/* <AMarquee /> */}
      </div>
    </section>
  );
}
