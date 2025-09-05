import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function ContactUs() {
  return (
    <div>
      <Header />
      <main className="max-w-5xl mx-auto my-12 px-4 py-8">
        <h1 className="text-3xl lg:text-4xl font-normal tracking-widest mb-4 text-center">Contact Us</h1>
        <form className="max-w-lg mx-auto my-12">
          <div className="mb-2">
            
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border rounded-none"
              required
              placeholder="Name"
            />
          </div>
          <div className="mb-4">
            
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-2 border rounded-none"
              required
              placeholder="Email"
            />
          </div>
          <div className="mb-4">
           
            <input
              type="tel"
              id="phone"
              name="phone"
              className="w-full px-3 py-2 border rounded-none"
              placeholder="Phone Number"
            />
          </div>
          <div className="mb-4">
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full px-3 py-2 border rounded-none"
              required
              placeholder="Message"
            ></textarea>
          </div>
          <Button
            type="submit"
            className="bg-bt-green text-white font-normal tracking-wide w-full cursor-pointer py-2 px-4 rounded-none"
          >
            Submit
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
