"use server";

import { createContact } from "@/lib/data";
import { sendContactNotification } from "@/lib/email";

export interface ContactFormState {
  success?: boolean;
  error?: string;
}

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const contact = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    subject: String(formData.get("subject") ?? "").trim(),
    message: String(formData.get("message") ?? "").trim(),
  };

  if (!contact.name || !contact.email || !contact.message) {
    return { error: "Please fill in your name, email, and message." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    return { error: "That email address doesn't look right." };
  }

  try {
    await createContact(contact);
    await sendContactNotification(contact);
  } catch (err) {
    console.error("Contact submission failed:", err);
    return {
      error:
        "Something went wrong while sending your message. Please try again, or email us directly.",
    };
  }

  return { success: true };
}
