import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import emailjs from "emailjs-com";
import contactSvg from "../assets/img/contact.svg";
import "./Contact.css";

export default function Contact() {
  const { t } = useTranslation();
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
      setStatusMessage(t("contact.status_fill_fields"));
      return;
    }

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_API_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS environment variables are missing.");
      setStatusMessage(t("contact.status_config_error"));
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

      setStatusMessage(t("contact.status_sent"));
      nameRef.current.value = "";
      emailRef.current.value = "";
      subjectRef.current.value = "";
      messageRef.current.value = "";
    } catch (error) {
      console.error("Error sending email:", error);
      setStatusMessage(t("contact.status_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact">
      <div className="header">
        <h1>{t("contact.title")}</h1>
        <p>
          {t("contact.description")} <b>{t("contact.email")}</b>
        </p>
      </div>
      <div className="box-send-mail">
        <img src={contactSvg} alt="contact image" />
        <form onSubmit={handleSubmit}>
          <div className="form-name-email-subject">
            <div>
              <label htmlFor="name">{t("contact.name_label")}</label>
              <input type="text" id="name" name="name" ref={nameRef} required />
            </div>
            <div>
              <label htmlFor="email">{t("contact.email_label")}</label>
              <input
                type="email"
                id="email"
                name="email"
                ref={emailRef}
                required
              />
            </div>
            <div>
              <label htmlFor="subject">{t("contact.subject_label")}</label>
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
            <label htmlFor="message">{t("contact.message_label")}</label>
            <textarea
              id="message"
              name="message"
              ref={messageRef}
              required
            ></textarea>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? t("contact.sending_button") : t("contact.send_button")}
          </button>
        </form>
        {statusMessage && <p>{statusMessage}</p>}
      </div>
    </div>
  );
}
