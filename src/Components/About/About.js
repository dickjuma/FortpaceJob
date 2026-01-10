import React from "react";
import about_img from "../../Assets/about.jpg";
import { CheckCircle, Lightbulb, Target} from "lucide-react";
import { features } from "../../Assets/assets";
import { useNavigate } from "react-router-dom";

const About = () => {
 
    const navigate = useNavigate();

  return (
    <section className="py-8 md:py-12 bg-[var(--color-secondary)]">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm font-medium mb-4">
            Redefining Work
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--color-primary)] mb-6">
            Where Talent Meets Opportunity
          </h1>
          <p className="text-xl text-[var(--color-primary)] max-w-3xl mx-auto">
            We are Fortespace: A fortified ecosystem empowering talent to thrive on their own terms.
          </p>
        </div>

       
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">
          {/*---------------- Left Column image-------- */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                className="w-full h-auto object-cover"
                src={about_img}
                alt="Fortespace Team - Empowering Talent"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-primary)]/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-[var(--accent-mint)] p-6 rounded-xl shadow-lg border border-[var(--color-cta)] max-w-xs text-[var(--color-primary)]">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[var(--color-primary)]/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="font-bold">100+</p>
                  <p className="text-sm">Verified Professionals</p>
                </div>
              </div>
            </div>
          </div>

          {/*----------------- Right Column texts--------- */}
          <div>
            <div className="mb-10 text-[var(--color-primary)]">
              <h2 className="text-3xl font-bold mb-4">
                What Drives Us
              </h2>
              <p className="text-lg mb-6">
                We believe that your skill—whether you're an elite coder, a meticulous accountant, or a highly rated handyman—is a form of <span className="font-semibold">currency that should be used on your own terms</span>.
              </p>
              <p className="text-lg ">
                Fortespace challenges the traditional 9-to-5 grind by creating a service-centric marketplace that connects clients to verified service providers in a secure, transparent ecosystem.
              </p>
            </div>

            {/* -------------------Mission & Vision Cards--------------- */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <div className="bg-[var(--accent-mint)] p-6 rounded-xl border border-[var(--accent-pink)] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[var(--accent-pink)] rounded-lg">
                    <Target className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-primary)]">Our Mission</h3>
                </div>
                <p className="text-[var(--color-primary)]">
                  Bring opportunity to all talent by empowering African youth and entrepreneurs to build personal brands and make a living doing what they love.
                </p>
              </div>

              <div className="bg-[var(--accent-mint)] p-6 rounded-xl border border-[var(--accent-pink)] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[var(--accent-pink)] rounded-lg">
                    <Lightbulb className="w-5 h-5 text-[var(--color-primary)]"/>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--color-primary)]">Our Vision</h3>
                </div>
                <p className="text-[var(--color-primary)]">
                  Create a world where people can make a living doing what they love to do and what they know how to do best.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/*--------------------- break----------------------- */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-primary)] mb-4">
              Why We're <span className="text-[var(--color-primary)]">Different</span>
            </h2>
            <p className="text-lg text-[var(--color-primary)] max-w-3xl mx-auto">
              While others are just marketplaces, we are a <span className="font-semibold">fortified space</span>. We solve the risk problem whiteso you can focus on the reward.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-[var(--accent-mint)] p-6 rounded-xl border border-gray-200 hover:border-[var(--color-primary)]/30 hover:shadow-lg transition-all group text-[var(--color-primary)]">
                <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg inline-block mb-4 group-hover:bg-[var(--color-primary)]/20 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/*-------------------- CTA Section------------------- */}
        <div className="bg-[var(--accent-mint)] rounded-2xl p-8 md:p-12 text-center text-[var(--color-primary)]">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Join the Revolution
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Monetize your skills. Make the dream work. Build your future on your terms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>navigate('/signup')} className="px-8 py-3 bg-[var(--color-cta)] text-[var(--color-secondary)] font-semibold rounded-lg transition-colors">
              Join as Talent
            </button>
            <button onClick={()=>navigate('/signup')} className="px-8 py-3 bg-transparent border-2 border-[var(--color-cta)] text-[var(--color-primary)] font-semibold rounded-lg transition-colors">
              Hire Talent
            </button>
          </div>
        </div>

        {/* Trust Indicator */}
        <div className="mt-16 text-center">
          <p className="text-[var(--color-primary)] text-sm">
            Trusted by thousands of professionals across Africa • 100% client satisfaction • 24/7 support
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;