"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AppTopNav from "../nav/AppTopNav";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <motion.div className="settings-stage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <AppTopNav active="settings" />
      <main className="settings-shell">
        <motion.section
          className="settings-card"
          initial={{ y: 20, opacity: 0, scale: .985 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: .42, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="settings-head">
            <button type="button" aria-label="Back home" onClick={() => router.push("/dashboard")}>←</button>
            <div><span>Account</span><h1>Settings</h1></div>
          </div>
          <div className="settings-profile">
            <div className="settings-avatar">A</div>
            <div><b>Atharv</b><span>Learning streak active</span></div>
          </div>
          <div className="settings-list">
            <button type="button"><span>Daily goal</span><b>15 min</b></button>
            <button type="button"><span>Sound effects</span><b>On</b></button>
            <button type="button"><span>Practice reminders</span><b>9:00 AM</b></button>
            <button type="button"><span>Theme</span><b>Warm</b></button>
          </div>
          <button type="button" className="settings-primary" onClick={() => router.push("/dashboard")}>Done</button>
        </motion.section>
      </main>
    </motion.div>
  );
}
