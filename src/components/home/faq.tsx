"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Minus, Plus } from 'lucide-react';

const faqItems = [
  {
    question: "What services do you offer?",
    answer: "I offer full-stack web development services including frontend development with React/Next.js, backend development with Node.js, and database design. I specialize in creating responsive, accessible, and performant web applications."
  },
  {
    question: "Do you offer maintenance after the project is complete?",
    answer: "Yes, I offer ongoing maintenance and support packages to ensure your website or application continues to run smoothly. This includes regular updates, security patches, and addressing any issues that may arise."
  },
  {
    question: "What technologies do you work with?",
    answer: "I work with modern web technologies including React, Next.js, TypeScript, Node.js, Express, MongoDB, PostgreSQL, and various CSS frameworks like Tailwind CSS. I'm always learning new technologies to stay current with industry trends."
  },
  {
    question: "How do we get started working together?",
    answer: "Getting started is easy! Just reach out through the contact link below or email me directly. I'll schedule an initial consultation to discuss your project requirements, timeline, and budget."
  }
];

export function FAQ() {
  return (
    <section id="faq" className="relative w-full scroll-mt-28 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className='flex w-full items-center justify-center'>
            <div className="mb-4 flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-4 py-2 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/5 sm:mb-6">
                <span className="text-md font-medium text-black/80 dark:text-white/80"><span className='text-lg'>🗨️</span> FAQ</span>
            </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">Frequently Asked Questions</h2>
          <p className="mx-auto max-w-3xl text-lg text-gray-700 dark:text-gray-300">
            Here are answers to some common questions about my services and process.
            If you don&apos;t see your question here, feel free to reach out directly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="w-full"
        >
          <Accordion type="single" collapsible>
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="group border-b">
                <AccordionTrigger className="py-6 text-left text-2xl font-semibold hover:no-underline">
                  <span>
                      {item.question}
                  </span>
                  <div className="relative flex h-6 w-6 items-center justify-center hover:cursor-pointer">
                      <Plus className="absolute h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:opacity-0" />
                      <Minus className="absolute h-5 w-5 transition-transform duration-300 group-data-[state=closed]:-rotate-90 group-data-[state=closed]:opacity-0 group-data-[state=open]:rotate-0" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-lg">
                  {Array.isArray(item.answer) ? (
                      <ul className="list-disc space-y-2 pl-6">
                      {item.answer.map((point, i) => (
                          <li key={i}>{point}</li>
                      ))}
                      </ul>
                  ) : (
                      item.answer
                  )}
                  </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
