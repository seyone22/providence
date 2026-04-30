import { motion } from 'framer-motion';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

const FAQ_DATA = [
    {
        category: "Safety & Security",
        items: [
            {
                q: "How do I know my money is safe?",
                a: "Your payment is held in a secure escrow arrangement until the vehicle is confirmed, inspected, and ready for shipment. We've been operating for 15+ years and have long-standing relationships supplying the dealerships you already trust."
            },
            {
                q: "What if the car isn't what was described?",
                a: "Every vehicle undergoes a full independent inspection before leaving the source country. You receive the report, photos, and condition grading beforehand. If it doesn't match the spec, we don't ship it."
            },
            {
                q: "What happens if the car is damaged during shipping?",
                a: "Every vehicle is covered by comprehensive marine insurance, door-to-door. In the unlikely event of transit damage, you're fully protected. We handle the entire claims process—zero paperwork for you."
            },
            {
                q: "Is Providence Auto a registered and licensed business?",
                a: "Yes. We are a fully registered UK-based vehicle sourcing and export company with over 15 years of trading history, operating under all applicable international trade and export regulations."
            },
            {
                q: "Can I visit your office or speak to someone in person?",
                a: "Absolutely. We have physical offices in London, Australia, UAE, Japan, and Sri Lanka. You're welcome to visit, or we can jump on a video call so you can put a face to the name. We're real people, not a faceless website."
            }
        ]
    },
    {
        category: "Vehicle Quality",
        items: [
            {
                q: "How do you verify the condition of the car?",
                a: "Every vehicle is independently inspected by a qualified third-party assessor. This covers mechanical condition, bodywork, interior, service history, and mileage verification. You receive the full report before anything moves."
            },
            {
                q: "Can I request additional photos or a video walkaround?",
                a: "Yes. We can arrange a full video walkaround and specific close-ups of the engine bay, undercarriage, interior details, or service stamps—whatever you need to feel confident."
            },
            {
                q: "What if I find an issue after the car arrives?",
                a: "We stand behind our sourcing. If there is a discrepancy between the documentation and the arrival condition, we work with you to resolve it. Our reputation is built on 15 years of trust."
            },
            {
                q: "Are the cars you source accident-free?",
                a: "We do not buy cars with accident histories. We provide full vehicle history, including service and ownership records. We'd rather lose a sale than deliver a surprise."
            },
            {
                q: "Do the cars come with valid service history?",
                a: "We prioritize vehicles with documented records. If a car has an incomplete history, we disclose that upfront so you can make an informed decision."
            }
        ]
    },
    {
        category: "Exporting & Importing",
        items: [
            {
                q: "How long does the whole process take?",
                a: "Typically 1 week to source and confirm, then 3–4 weeks for transit to your destination port. We provide a specific timeline at the quote stage."
            },
            {
                q: "Do I need to handle any paperwork or customs forms?",
                a: "No. We handle 100% of the documentation—Bill of Lading, export compliance, customs declarations, and HS codes. You do zero paperwork. Literally."
            },
            {
                q: "Will the car be legal to drive in my country?",
                a: "We advise on compliance and registration requirements before you commit. We'll flag any necessary modifications (lighting, emissions) upfront so there are no surprises."
            },
            {
                q: "How do I track my vehicle during shipping?",
                a: "You'll receive real-time updates at every stage: sourced, inspected, loaded, in transit, and port arrival. You'll always know exactly where your car is."
            },
            {
                q: "What costs are included in your quote?",
                a: "Our quote includes the vehicle price, inspection, shipping, insurance, and export docs. We also outline destination-side costs like duty and taxes so you see the full picture."
            },
            {
                q: "What payment methods do you accept?",
                a: "We accept bank transfers with full invoicing. Deposits can also be taken securely online via Stripe. You'll have a complete paper trail from start to finish."
            }
        ]
    }
];

export default function FAQSection() {
    return (
        <section className="py-32 px-6 bg-[#FAFAFA] border-t border-black/5">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 uppercase">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-zinc-500 font-light text-lg md:text-xl">
                        Everything you need to know about our global direct import network.
                    </p>
                </motion.div>

                {/* Categories */}
                <div className="space-y-16">
                    {FAQ_DATA.map((section, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                        >
                            <h3 className="text-xs font-bold tracking-[0.3em] uppercase text-zinc-400 mb-8 ml-2">
                                {section.category}
                            </h3>

                            <div className="bg-white rounded-[2rem] border border-black/5 p-2 md:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.02)]">
                                <Accordion type="single" collapsible className="w-full">
                                    {section.items.map((faq, i) => (
                                        <AccordionItem
                                            key={i}
                                            value={`${idx}-${i}`}
                                            className="border-none px-4"
                                        >
                                            <AccordionTrigger className="text-left hover:no-underline py-6 text-lg font-medium text-zinc-900 group">
                                                <span className="group-data-[state=open]:text-blue-600 transition-colors">
                                                    {faq.q}
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent className="text-zinc-500 font-light leading-relaxed text-base pb-6">
                                                {faq.a}
                                            </AccordionContent>
                                            {i !== section.items.length - 1 && (
                                                <div className="h-px bg-black/5 mx-auto" />
                                            )}
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}