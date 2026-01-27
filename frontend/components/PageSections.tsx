'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from './LayoutComponents';
import { Card } from './DisplayComponents';

// Hero Section for Homepage
interface HeroSectionV2Props {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  secondaryCta?: {
    text: string;
    href: string;
  };
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export function HeroSectionV2({
  title,
  subtitle,
  ctaText,
  ctaHref,
  secondaryCta,
  stats,
}: HeroSectionV2Props) {
  return (
    <section className="relative overflow-hidden py-20 sm:py-32">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-purple-600/20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-3xl" />
      
      <Container className="relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-blue-400">Live on Base</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {title.split(' ').map((word, i, arr) => (
              <React.Fragment key={i}>
                {i === arr.length - 1 ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                    {word}
                  </span>
                ) : (
                  `${word} `
                )}
              </React.Fragment>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href={ctaHref}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
              {ctaText}
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-white font-semibold text-lg border border-gray-700 transition-all"
              >
                {secondaryCta.text}
              </Link>
            )}
          </div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 sm:gap-16">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

// Features Section
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
}

interface FeaturesSectionProps {
  title: string;
  subtitle?: string;
  features: Feature[];
}

export function FeaturesSection({ title, subtitle, features }: FeaturesSectionProps) {
  return (
    <section className="py-20">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card
              key={i}
              hoverable={!!feature.href}
              className="group"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
              {feature.href && (
                <Link
                  href={feature.href}
                  className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Learn more
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

// How It Works Section
interface Step {
  number: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface HowItWorksSectionProps {
  title: string;
  subtitle?: string;
  steps: Step[];
}

export function HowItWorksSection({ title, subtitle, steps }: HowItWorksSectionProps) {
  return (
    <section className="py-20 bg-gray-900/50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
          {subtitle && <p className="text-gray-400 max-w-2xl mx-auto">{subtitle}</p>}
        </div>

        <div className="max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative flex gap-6 pb-12 last:pb-0"
            >
              {/* Line */}
              {i < steps.length - 1 && (
                <div className="absolute left-5 top-12 w-0.5 h-full bg-gray-800" />
              )}
              
              {/* Number */}
              <div className="relative z-10 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {step.number}
              </div>
              
              {/* Content */}
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

// CTA Section
interface CTASectionProps {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  variant?: 'default' | 'gradient';
}

export function CTASection({ title, description, ctaText, ctaHref, variant = 'default' }: CTASectionProps) {
  return (
    <section className="py-20">
      <Container>
        <div
          className={`
            relative overflow-hidden rounded-3xl p-12 text-center
            ${variant === 'gradient'
              ? 'bg-gradient-to-br from-blue-600 to-purple-600'
              : 'bg-gray-900 border border-gray-800'
            }
          `}
        >
          {/* Background decoration */}
          {variant === 'gradient' && (
            <>
              <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            </>
          )}

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{title}</h2>
            <p className={`max-w-2xl mx-auto mb-8 ${variant === 'gradient' ? 'text-white/80' : 'text-gray-400'}`}>
              {description}
            </p>
            <Link
              href={ctaHref}
              className={`
                inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105
                ${variant === 'gradient'
                  ? 'bg-white text-gray-900 hover:bg-gray-100'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
                }
              `}
            >
              {ctaText}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Testimonials Section
interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  address?: string;
}

interface TestimonialsSectionProps {
  title: string;
  testimonials: Testimonial[];
}

export function TestimonialsSection({ title, testimonials }: TestimonialsSectionProps) {
  return (
    <section className="py-20">
      <Container>
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16">{title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="flex flex-col">
              {/* Quote */}
              <svg className="w-8 h-8 text-blue-500/50 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-gray-300 flex-1 mb-6">&ldquo;{testimonial.quote}&rdquo;</p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                {testimonial.avatar ? (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {testimonial.address?.slice(2, 4).toUpperCase() || testimonial.author[0]}
                  </div>
                )}
                <div>
                  <p className="font-medium text-white">{testimonial.author}</p>
                  {testimonial.role && (
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}

// FAQ Section
interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title: string;
  faqs: FAQ[];
}

export function FAQSection({ title, faqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <section className="py-20">
      <Container>
        <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16">{title}</h2>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-800 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left bg-gray-900/50 hover:bg-gray-900 transition-colors"
              >
                <span className="font-medium text-white">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="p-5 pt-0 bg-gray-900/50 text-gray-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default {
  HeroSectionV2,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
  TestimonialsSection,
  FAQSection,
};
