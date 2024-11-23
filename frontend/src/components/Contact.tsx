import { useRef, useState } from "react";
import emailjs from "emailjs-com";
import contactSvg from "../assets/img/contact.svg";
import "./Contact.css";

export default function Contact() {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const subjectRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);

  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !emailRef.current ||
      !nameRef.current ||
      !subjectRef.current ||
      !messageRef.current
    ) {
      setStatusMessage("Please fill out all fields.");
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_API_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are missing.");
      setStatusMessage("Configuration error. Please try again later.");
      return;
    }

    try {
      setLoading(true);
      setStatusMessage("");

      await emailjs.send(
        serviceId,
        templateId,
        {
          name: nameRef.current.value,
          email: emailRef.current.value,
          subject: subjectRef.current.value,
          message: messageRef.current.value,
        },
        publicKey
      );

      setStatusMessage("Your message has been sent successfully!");
      nameRef.current.value = "";
      emailRef.current.value = "";
      subjectRef.current.value = "";
      messageRef.current.value = "";
    } catch (error) {
      console.error("Error sending email:", error);
      setStatusMessage("Failed to send the message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact">
      <div className="header">
        <h1>Get in touch</h1>
        <p>
          Do you have a question, a project or simply want to find out more
          about Vinocolor? Our team would be delighted to hear from you. Send us
          a message below or send any special request to the following address:{" "}
          <b>contact@vinocolor.fr</b>
        </p>
      </div>
      <div className="box-send-mail">
        <img src={contactSvg} alt="contact image" />
        <form onSubmit={handleSubmit}>
          <div className="form-name-email-subject">
            <div>
              <label htmlFor="name">Your name</label>
              <input type="text" id="name" name="name" ref={nameRef} required />
            </div>
            <div>
              <label htmlFor="email">Your email</label>
              <input
                type="email"
                id="email"
                name="email"
                ref={emailRef}
                required
              />
            </div>
            <div>
              <label htmlFor="subject">Your subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                ref={subjectRef}
                required
              />
            </div>
          </div>
          <div className="message">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              ref={messageRef}
              required
            ></textarea>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send your message"}
          </button>
        </form>
        {statusMessage && <p>{statusMessage}</p>}
      </div>
    </div>
  );
}
