import {
  TerminalIcon,
  UserIcon,
  PaletteIcon,
  ArrowRightIcon,
  Check,
} from "lucide-react";
import app from "../../firebase";
import { db } from "../../firebase";
import { addDoc,collection,getDocs,query,serverTimestamp, where } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import { useState ,useEffect} from "react";
import { analytics } from "../../firebase";
import { logEvent } from "firebase/analytics";

export default function HomePage() {
    const [email, setEmail]=useState("");

    useEffect(() => {
      if (analytics) {
        logEvent(analytics, "page_view", {
          page_title: "HomePage",
          page_location: window.location.pathname,
        });
      }
    }, []);

    const addtoWaitList = async() => {
        try{
          const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

          if (!email || !emailRegex.test(email)) {
              toast(
                  "Enter a valid email address!",
                  {
                      style: {
                          background: "#fff",
                          color: "red",
                          fontSize: "1rem",
                          padding: "10px 20px",
                          fontWeight: "500",
                      },
                  }
              )
              return;
          }

          const waitListRef = collection(db, "waitlist")
          const q = query(waitListRef, where("email", "==", email));
          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            // Email already exists
            toast(
              "You're already on the waitlist! Check your inbox for next steps",
              {
                duration: 5000,
                style: {
                  background: "#fff",
                  color: "#000",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  fontWeight: "500",
                },
              }
            );
          }
          else{
            const res = await addDoc(waitListRef, {
              email,
              createdAt: serverTimestamp(),
            });

            const response = await fetch(
              `${import.meta.env.VITE_API_KEY}send-waitlist-email`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: email,
                }),
              }
            );

            if (res.id && response) {
              toast("Thanks for joining! Check your inbox for the details", {
                duration: 5000,
                style: {
                  background: "#fff",
                  color: "#000",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  fontWeight: "500",
                },
              });
            } 
          }        
        }
        catch (error) {
          toast("Something went wrong, please try again later.",
          {
            style: {
                background: "#fff",
                color: "red",
                fontSize: "1rem",
                padding: "10px 20px",
                fontWeight: "500",
            },
          })
        }
    }

    const sendWaitlistEmail = async (toEmail) => {
      const SENDGRID_API_KEY = import.meta.env.VITE_API_KEY_EMAIL;
      const SENDER_EMAIL = "ultinvoiceteam@gmail.com";

      
    };
    
    return (
      <div className=" bg-black text-white font-body w-full">
        {/* Header */}
        <Toaster toastOptions={{ style: { minWidth: "500" } }} />
        <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-black/80 backdrop-blur-xl">
          <div className="px-6 py-5 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center max-[500px]:w-8 max-[500px]:h-8">
                <img
                  src="/logo.png"
                  alt="UltInvoice Logo"
                  className="w-8 h-8 max-[500px]:w-6 max-[500px]:h-6"
                />
              </div>
              <span className="font-heading font-[400] text-white text-2xl tracking-tight max-[500px]:text-lg">
                UltInvoice
              </span>
            </div>

            {/* Navigation */}
            <nav className="md:flex items-center space-x-10">
              <a
                href="#features"
                className="text-zinc-400 hover:text-white transition-colors font-[400] scroll-smooth cursor-pointer text-lg max-[500px]:text-xs"
              >
                Features
              </a>
              <a
                href="#faq"
                className="text-zinc-400 hover:text-white transition-colors font-[400] scroll-smooth cursor-pointer text-lg max-[500px]:text-xs"
              >
                FAQ
              </a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative py-10 lg:py-12 max-[500px]:py-10 ">
          <div className="mx-10 px-6 w-auto max-[500px]:!mx-0">
            <div className="flex flex-row max-[500px]:flex-col gap-10">
              {/* Left Side - Text Content */}
              <div className="space-y-8 w-full">
                <div className="space-y-6">
                  <h1 className="font-heading text-5xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
                    Stop Typing,{" "}
                    <span className="text-zinc-400">Start Describing</span>
                  </h1>
                  <div className="w-16 h-1 bg-white"></div>
                </div>

                <p className="text-zinc-300 text-base lg:text-2xl leading-relaxed font-light max-w-lg">
                  The world's first prompt-based generator for invoices and
                  quotations. Simply describe what you need, and our AI crafts
                  professional PDFs in seconds.
                </p>

                <div className="pt-6">
                  <div className="flex lg:max-w-[80%] gap-3 max-[500px]:flex-col max-[500px]:mb-10">
                    <div className="flex-1">
                      <input
                        type="email"
                        required
                        pattern="^[^@\s]+@[^@\s]+\.[^@\s]+$"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full h-12 px-4 bg-zinc-900/80 border border-zinc-700 rounded-full text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-zinc-600 transition-colors max-[500px]:!h-8"
                      />
                    </div>
                    <button
                      className="bg-white cursor-pointer text-black hover:bg-zinc-100 font-heading font-[600] px-6 h-12 transition-colors border-0 rounded-full whitespace-nowrap lg: text-lg max-[500px]:text-xs max-[500px]:!h-8 max-[500px]:w-fit"
                      onClick={addtoWaitList}
                    >
                      Join Waitlist
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Side - UI Mockup */}
              <div className="relative w-full mt-4">
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="w-3 h-3 bg-zinc-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-zinc-600 rounded-full"></div>
                    <div className="w-3 h-3 bg-zinc-600 rounded-full"></div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-4">
                      <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">
                        Input Prompt
                      </div>
                      <div className="bg-zinc-800/80 border border-zinc-700 rounded-xl p-4 text-zinc-200 font-mono text-sm">
                        "Create an invoice for web design services, $2,500, due
                        in 30 days for Acme Corp"
                      </div>
                    </div>

                    <div className="flex items-center justify-center py-2">
                      <ArrowRightIcon className="h-5 w-5 text-zinc-500" />
                    </div>

                    <div className="space-y-4">
                      <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">
                        Generated Invoice
                      </div>
                      <div className="bg-white rounded-xl p-6 text-black shadow-lg">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-lg">
                                INVOICE #001
                              </div>
                              <div className="text-sm text-zinc-600">
                                Due: 30 days
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-zinc-600">
                                Bill To:
                              </div>
                              <div className="font-semibold">Acme Corp</div>
                            </div>
                          </div>
                          <hr className="border-zinc-200" />
                          <div className="flex justify-between">
                            <div>Web Design Services</div>
                            <div className="font-bold">$2,500.00</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-14 lg:py-16 border-t border-zinc-800/50"
        >
          <div className="mx-10 px-10 max-[500px]:!mx-0">
            <div className="text-center mb-20">
              <h2 className="font-heading text-4xl lg:text-5xl font-light tracking-tight text-white mb-6">
                A Smarter Way to Manage Your Billing
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Built for modern businesses that value efficiency and
                professionalism
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-300">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <TerminalIcon className="h-6 w-6 text-black" />
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-light text-white mb-4">
                  Prompt-Based Generation
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  Use plain English to create complex invoices. Our AI
                  understands discounts, taxes, and itemized lists with perfect
                  accuracy.
                </p>
              </div>
              {/* Feature 2 */}
              <div className="group bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-300">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <UserIcon className="h-6 w-6 text-black" />
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-light text-white mb-4">
                  Secure Client Management
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  Your data is protected with industry-standard encryption. Save
                  client details to auto-fill invoices and eliminate errors.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-zinc-900/30 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all duration-300">
                <div className="mb-6">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <PaletteIcon className="h-6 w-6 text-black" />
                  </div>
                </div>
                <h3 className="font-heading text-2xl font-light text-white mb-4">
                  Customizable Templates
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  Add your logo, adjust layouts, and match your brand colors for
                  a completely professional appearance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section
          id="faq"
          className="py-18 lg:py-20 border-t border-zinc-800/50"
        >
          <div className=" mx-auto px-6 max-[500px]:!mx-0">
            <div className="text-center mb-20">
              <h2 className="font-heading text-4xl lg:text-5xl font-light tracking-tight text-white mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-zinc-400 text-lg">
                Everything you need to know about UltInvoice
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* FAQ Card 1 */}
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors">
                <h3 className="font-heading font-light text-white mb-4 text-2xl">
                  What is UltInvoice?
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  UltInvoice is an AI-powered tool designed to simplify
                  invoicing and quotation creation. By simply describing what
                  you need in plain language, our AI instantly generates
                  professional invoices or quotes. You can then review,
                  customize, and send them with just a few clicks, saving you
                  hours of manual work.
                </p>
              </div>

              {/* FAQ Card 2 */}
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors">
                <h3 className="font-heading font-light text-white mb-4 text-2xl">
                  Generate multiple invoices/quotes?
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  Yes! UltInvoice offers a bulk generation feature, allowing you
                  to create multiple invoices or quotes simultaneously. This is
                  especially useful for businesses with recurring clients or
                  high-volume billing, making it incredibly efficient to manage
                  large numbers of invoices in one go.
                </p>
              </div>

              {/* FAQ Card 3 */}
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors">
                <h3 className="font-heading font-light text-white mb-4 text-2xl">
                  Are the templates of invoices customizable?
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  You can choose from a wide range of professional templates or
                  create your own. Whether you want to add your logo, adjust the
                  layout, or match your brand's colors, UltInvoice gives you
                  full control over how your invoices and quotes look.
                </p>
              </div>

              {/* FAQ Card 4 */}
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors">
                <h3 className="font-heading font-light text-white mb-4 text-2xl">
                  Data security and client management?
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  We take security seriously. Your data is protected with
                  industry-standard encryption and stored safely. You can
                  securely save client details, which are auto-filled into
                  invoices and quotes to reduce errors and save time.
                </p>
              </div>

              {/* FAQ Card 5 */}
              <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-2xl hover:border-zinc-700 transition-colors md:col-span-2 max-w-2xl mx-auto">
                <h3 className="font-heading font-light text-white mb-4 text-2xl">
                  Launch date and pricing?
                </h3>
                <p className="text-zinc-400 leading-relaxed text-lg">
                  UltInvoice will be launching in H1 2025 with a free trial.
                  Pricing will be announced soon, with plans for freelancers to
                  larger businesses. Join the VIP waitlist for early access and
                  launch-day offers.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-20 border-t border-zinc-800/50 mx-auto px-6 text-center space-y-8">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3">
            <div className="w-10 h-10 max-[500px]:w-8 max-[500px]:h-8 bg-white rounded-full flex items-center justify-center">
              <img
                src="/logo.png"
                alt="UltInvoice Logo"
                className="w-8 h-8 max-[500px]:w-6 max-[500px]:h-6"
              />
            </div>
            <span className="font-heading font-light text-white text-xl tracking-tight">
              UltInvoice
            </span>
          </div>

          {/* Navigation Links */}
          <nav className=" md:flex items-center justify-center space-x-10">
            <a
              href="#features"
              className="text-zinc-400 hover:text-white transition-colors font-medium cursor-pointer scroll-smooth"
            >
              Features
            </a>
            <a
              href="#faq"
              className="text-zinc-400 hover:text-white transition-colors font-medium cursor-pointer scroll-smooth"
            >
              FAQ
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-zinc-600 text-sm">
            © 2025 UltInvoice. All Rights Reserved.
          </p>
        </footer>
      </div>
    );
}
