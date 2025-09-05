import BreadCrumb from '@/components/BreadCrumb'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Header from '@/components/Header'
import React from 'react'
import Footer from '@/components/Footer'

const AboutUs = () => {
  const features = [
    {
      icon: "/manne.png",
      alt: "Custom First Approach",
      title: "CUSTOM FIRST APPROACH",
      description:
        "Every order is made with you in mind, whether it's from our catalog or your own idea, we tailor each piece to your taste.",
    },
    {
      icon: "/what-img.png",
      alt: "Whatsapp Ordering",
      title: "WHATSAPP ORDERING MADE SIMPLE",
      description:
        "No complicated carts or checkouts. Just send us a message, and we'll handle the rest.",
    },
    {
      icon: "/seams.png",
      alt: "Personalized Service",
      title: "PERSONALIZED SERVICE",
      description:
        "We don't just deliver clothes; we guide you in creating a look that's uniquely yours.",
    },
  ];

  return (
    <div suppressHydrationWarning={true}>
      <Header />
       <section
        className="w-full md:h-[300px] bg-cover bg-center my-4 flex flex-col justify-center items-center"
        style={{
          backgroundImage: `url('/cat-img.png')`,
        }}
      >
        <div className="sm:max-w-2xl flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 text-white py-12">
          <div className="relative z-10 flex w-full flex-grow flex-col items-center self-stretch justify-between">
            <div />
            <div className="relative flex w-full flex-col items-center gap-4">
              <h2 className="text-center !text-[36px] font-bold leading-[50.4px] tracking-[0] text-white">
                ABOUT SHEELA
              </h2>
            </div>
          </div>
        </div>
        <div className="text-white">
          <BreadCrumb title={"ABOUT"} />
        </div>
      </section>

      <section className="my-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <img
                src="/images/model1.png"
                alt="About Sheela"
                className="w-full h-auto md:w-[488px] md:h-[484px] lg:w-[688px] lg:h-[684px] object-cover rounded-none shadow-lg"
              />
            </div>
            <div className="text-gray-700 text-lg lg:text-3xl">
              <p className="mb-4">
                At SHEELA, fashion is more than clothing—it’s self-expression.
                We believe every outfit tells a story, and we’re here to help
                you tell yours with confidence.
              </p>
              <p className="mb-4">
                Founded with a love for timeless design and modern style, our
                mission is simple: to make fashion accessible, inspiring, and
                effortlessly wearable. From everyday essentials to statement
                pieces, we carefully curate collections that blend quality,
                comfort, and individuality.
              </p>
              <p>
                We partner with trusted designers and emerging talent to bring
                you fresh, versatile styles without compromising on
                craftsmanship or sustainability. Whether you’re dressing for a
                big moment or the everyday, our goal is to help you look and
                feel your best.
              </p>
            </div>
          </div>

          <div className="my-20 text-center">
            <h2 className="text-3xl lg:text-5xl font-normal text-gray-800 mb-12 tracking-widest">
              WHAT MAKES US STAND APART
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="text-center border-none shadow-none">
                  <CardContent className=''>
                    <img
                      src={feature.icon}
                      alt={feature.alt}
                      className="w-full h-72 object-cover mb-4 bg-gray-200"
                    />
                    <h3 className="text-xl font-normal tracking-widest mb-2 text-start">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-start">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
        </div>
      </section>
    <Footer/>
    </div>
  )
}

export default AboutUs
