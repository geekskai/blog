import React from "react"

const FAQSection = () => {
  const faqs = [
    {
      question: "How are random VIN numbers generated?",
      answer:
        "Random VIN generators create 17-character vehicle identification numbers following ISO 3779 standards. Our generator includes valid manufacturer codes (WMI), proper check digit calculations, model year encoding, and sequential numbers while ensuring the generated VINs don't correspond to real vehicles.",
    },
    {
      question: "Are generated VIN numbers ISO 3779 compliant?",
      answer:
        "Yes, our VIN generator creates numbers that follow the ISO 3779 international standard, including proper character restrictions (excluding I, O, Q), valid check digit calculations using the official algorithm, manufacturer identifier compliance, and correct position-based encoding for all 17 characters.",
    },
    {
      question: "Can I use generated VINs for commercial purposes?",
      answer:
        "Generated VINs are intended for testing, development, and educational purposes only. They should not be used for fraudulent purposes, to represent actual vehicles in commercial transactions, insurance claims, or any activities that could be considered vehicle fraud or misrepresentation.",
    },
    {
      question: "What is the VIN check digit and how is it calculated?",
      answer:
        "The VIN check digit is located at position 9 and validates the entire VIN using a mathematical algorithm. Each character is assigned a numeric value, multiplied by a weight factor based on its position, and the sum is divided by 11. The remainder determines the check digit (0-9 or X for 10).",
    },
    {
      question: "What manufacturers are included in the generator?",
      answer:
        "Our generator includes major automotive manufacturers from around the world, including Ford, General Motors, Honda, Toyota, Nissan, BMW, Mercedes-Benz, Volkswagen, Hyundai, Kia, and Chrysler. Each manufacturer has authentic World Manufacturer Identifier (WMI) codes from their respective countries.",
    },
    {
      question: "Is this random VIN generator free to use?",
      answer:
        "Yes! This VIN generator is completely free and doesn't require any registration or app download. It works directly in your browser on any device including desktop, tablet, and mobile. Generate unlimited VIN numbers for testing and educational purposes without any restrictions.",
    },
    {
      question: "What export formats are available for batch VIN generation?",
      answer:
        "Our tool supports multiple export formats: Plain text (.txt) for simple lists, CSV (.csv) for spreadsheet compatibility with detailed metadata including manufacturer, model year, and structure breakdown, and JSON (.json) for programming integration with full validation information.",
    },
    {
      question: "How do I validate VIN numbers in my automotive application?",
      answer:
        "To validate VINs, check for exactly 17 characters, verify no I/O/Q letters are used, calculate and verify the check digit at position 9, validate the manufacturer code (positions 1-3), and ensure proper character encoding. Our tool includes validation examples and educational content about VIN validation implementation.",
    },
    {
      question: "What makes a VIN number valid or invalid?",
      answer:
        "A valid VIN must be exactly 17 characters, use only allowed characters (0-9, A-Z excluding I, O, Q), have a correct check digit calculation, contain a recognized manufacturer identifier, and follow proper position-based encoding rules as defined in the ISO 3779 standard.",
    },
    {
      question: "Can I specify manufacturer or model year for generated VINs?",
      answer:
        "Yes! Our generator allows you to optionally specify a manufacturer from our database of major automotive companies and select a model year from 2010-2030. You can also let the generator randomly select these parameters for maximum variety in your test data.",
    },
  ]

  return (
    <section className="mt-20 rounded-xl bg-slate-800 p-8">
      <h2 className="mb-6 text-2xl font-bold text-white">
        Frequently Asked Questions About VIN Generation
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-slate-700 pb-4 last:border-b-0">
            <h3 className="mb-2 text-lg font-semibold text-white">{faq.question}</h3>
            <p className="leading-relaxed text-slate-400">{faq.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FAQSection
