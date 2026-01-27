"use client"

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    question: "What is Slye?",
    answer: "Slye is an AI-powered platform that generates viral-ready video content for TikTok, Instagram Reels, and YouTube Shorts. We specialize in proven niches like ASMR, Disney stories, and looksmaxxing content."
  },
  {
    question: "How do credits work?",
    answer: "You can purchase credit packages starting from $4.99. Credits never expire and can be used anytime to generate videos."
  },
  {
    question: "What video formats do you support?",
    answer: "We generate videos optimized for vertical short-form content (9:16 aspect ratio) perfect for TikTok, Instagram Reels, and YouTube Shorts."
  },
  {
    question: "How long does it take to generate a video?",
    answer: "Most videos are generated in less than one minute. You'll receive a notification when your video is ready to download."
  },
  {
    question: "Can I use the videos commercially?",
    answer: "Yes! All videos generated with Slye are yours to use however you like, including for monetization on social media platforms."
  },
  {
    question: "Do I need any video editing experience?",
    answer: "Not at all. Slye handles everything from generation to final render. Just choose a preset, customize if needed, and download your ready-to-post video."
  }
]

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 font-light">
            Everything you need to know about Slye
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <ChevronDown
                  className={`h-5 w-5 text-zinc-400 transition-transform duration-200 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? 'max-h-48' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-5 text-zinc-400 font-light leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
