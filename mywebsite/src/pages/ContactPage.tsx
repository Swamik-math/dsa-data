import React, { useState, useEffect, useRef } from "react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  icon: string;
  title: string;
  details: string[];
  color: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const contactInfo: ContactInfo[] = [
    {
      icon: "📧",
      title: "Email",
      details: ["hello@aigetai.com", "support@aigetai.com"],
      color: "#3b82f6"
    },
    {
      icon: "📱",
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      color: "#10b981"
    },
    {
      icon: "📍",
      title: "Office",
      details: ["123 AI Street", "San Francisco, CA 94107", "United States"],
      color: "#8b5cf6"
    },
    {
      icon: "⏰",
      title: "Hours",
      details: ["Mon-Fri: 9am-6pm PST", "Sat: 10am-4pm PST", "Sun: Closed"],
      color: "#f59e0b"
    }
  ];

  return (
    <div
      ref={sectionRef}
      className={`min-h-[calc(100vh-200px)] py-20 px-5 bg-gradient-to-br from-slate-50 to-slate-200 transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "0.2s"}}>
          <h1 className="text-5xl font-bold mb-6 text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Have questions about our properties or services? We're here to help.
            Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className={`transition-all duration-600 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`} style={{transitionDelay: "0.4s"}}>
            <h2 className="text-3xl font-bold mb-8 text-gray-900">Contact Information</h2>

            <div className="space-y-6 mb-8">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className={`bg-white p-6 rounded-xl shadow-lg border-l-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                  style={{transitionDelay: `${0.5 + index * 0.1}s`, borderLeftColor: info.color}}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{backgroundColor: `${info.color}20`}}>
                      {info.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">{info.title}</h3>
                  </div>
                  <div>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-gray-600 leading-relaxed">{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className={`rounded-xl overflow-hidden shadow-lg transition-all duration-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{transitionDelay: "0.9s"}}>
              <div className="h-48 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-lg">
                🗺️ Interactive Map Here
              </div>
              <div className="bg-white p-5 text-center">
                <p className="text-gray-600 mb-1">Visit our headquarters</p>
                <p className="font-semibold text-gray-900">123 AI Street, San Francisco</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className={`transition-all duration-600 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`} style={{transitionDelay: "0.6s"}}>
            <div className="bg-white p-10 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-8 text-gray-900">Send us a Message</h2>

              {isSubmitted ? (
                <div className="bg-green-50 border-2 border-green-600 rounded-xl p-8 text-center animate-fadeIn">
                  <div className="text-5xl mb-4 text-green-600">✅</div>
                  <h3 className="text-2xl font-bold text-green-900 mb-2">Message Sent Successfully!</h3>
                  <p className="text-green-700">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block mb-2 text-gray-700 font-medium">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none bg-gray-50 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block mb-2 text-gray-700 font-medium">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none bg-gray-50 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">Subject *</label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none bg-gray-50 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-700 font-medium">Your Message *</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-600 focus:outline-none bg-gray-50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-1 transition-all"
                  >
                    Send Message
                  </button>
                </form>
              )}

              {/* Privacy Notice */}
              <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-600 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Privacy Note:</strong> We respect your privacy and will never
                  share your information with third parties. All data is protected
                  with 256-bit SSL encryption.
                </p>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-8 bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h3>

              <div className="space-y-4 mb-6">
                {[
                  { q: "How quickly do you respond?", a: "Within 24 hours on business days." },
                  { q: "Do you offer virtual tours?", a: "Yes, for all premium properties." },
                  { q: "What are your business hours?", a: "Mon-Fri 9am-6pm PST" }
                ].map((faq, i) => (
                  <div key={i} className="p-4 bg-gray-50 border-l-4 border-gray-200 rounded">
                    <div className="flex gap-2 mb-2">
                      <span className="text-blue-600 font-bold">Q:</span>
                      <span className="font-semibold text-gray-700">{faq.q}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-green-600 font-bold">A:</span>
                      <span className="text-gray-600">{faq.a}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full border-2 border-blue-600 text-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                View All FAQs →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
