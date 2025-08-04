import React, { useState } from "react";
import { supabase } from "../supabase/supabaseClient";
import Header from "../components/header";
import Footer from "../components/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState({ loading: false, message: "", type: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "", type: "" });

    const { name, email, subject, message } = formData;

    if (!name || !email || !subject || !message) {
      setStatus({ loading: false, message: "All fields are required.", type: "error" });
      return;
    }

    const { error } = await supabase.from("contact_messages").insert([
      { name, email, subject, message, created_at: new Date().toISOString() }
    ]);

    if (error) {
      setStatus({ loading: false, message: "Failed to send message.", type: "error" });
    } else {
      setStatus({ loading: false, message: "Message sent successfully!", type: "success" });
      setFormData({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold mb-2 text-center">Contact Us</h2>
        <p className="text-gray-500 text-center mb-10">
          We're here to help — reach out to us with any questions or feedback.
        </p>

        <form onSubmit={handleSubmit} className="bg-gray-50 p-8 rounded-lg shadow space-y-6">
          {["name", "email", "subject", "message"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {field === "message" ? "Your Message" : `Your ${field}`}
              </label>
              {field === "message" ? (
                <textarea
                  name={field}
                  rows="5"
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 rounded border bg-white focus:ring-2 focus:ring-green-500"
                  placeholder="Type your message here..."
                  required
                />
              ) : (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 rounded border bg-white focus:ring-2 focus:ring-green-500"
                  placeholder={`Enter your ${field}`}
                  required
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-medium transition"
          >
            {status.loading ? "Sending..." : "Send Message"}
          </button>

          {status.message && (
            <p
              className={`text-sm text-center ${
                status.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>

        <section className="mt-16 grid md:grid-cols-2 gap-10">
          {/* Location Info */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Visit Our Office</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Expert Office Furnish<br />
              123 Business Avenue, Suite 456<br />
              Cityville, State 78901<br /><br />
              Phone: (555) 123–4567<br />
              Email: support@expertofficefurnish.com
            </p>
          </div>

          {/* Embedded Google Map */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <iframe
              title="Company Location"
              src="https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=Accra+Ghana"
              className="w-full h-64 border-0"
              allowFullScreen
            ></iframe>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
