"use client";

import { useEffect, useState } from "react";
import { type ContactSettings, whatsappHref } from "@/lib/settings";

export function PublicContact({ compact = false }: { compact?: boolean }) {
  const [contact, setContact] = useState<ContactSettings>({});

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/site-settings");
        const data = await response.json();
        setContact(data.contact ?? {});
      } catch {
        setContact({});
      }
    }

    void load();
  }, []);

  const wa = whatsappHref(contact.whatsapp);
  const ig = contact.instagram?.replace(/^@/, "");
  const hasContact = contact.email || wa || ig;

  if (!hasContact) {
    return compact ? <span>Kontak segera</span> : null;
  }

  return (
    <div className={compact ? "flex flex-wrap gap-4" : "flex flex-wrap gap-3"}>
      {contact.email ? (
        <a className="hover:text-ink" href={`mailto:${contact.email}`}>
          {contact.email}
        </a>
      ) : null}
      {wa ? (
        <a className="hover:text-ink" href={wa} rel="noreferrer" target="_blank">
          WhatsApp
        </a>
      ) : null}
      {ig ? (
        <a
          className="hover:text-ink"
          href={`https://instagram.com/${ig}`}
          rel="noreferrer"
          target="_blank"
        >
          Instagram
        </a>
      ) : null}
    </div>
  );
}
