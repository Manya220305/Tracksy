import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ArrowLeft, Shield, FileText, AlertTriangle, CheckCircle2, Lock, RefreshCw } from 'lucide-react';

const Section = ({ icon, title, children }) => (
  <div className="mb-10">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-primary/10 rounded-xl text-primary flex-shrink-0">
        {icon}
      </div>
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
    </div>
    <div className="text-text-secondary leading-relaxed space-y-3 ml-1">
      {children}
    </div>
  </div>
);

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl border-b border-border px-6 py-4 flex items-center justify-between">
        <Link to="/login" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-semibold">Back to Login</span>
        </Link>
        <div className="flex items-center gap-2">
          <LayoutDashboard size={22} className="text-primary" />
          <span className="font-black text-lg text-foreground">Tracksy</span>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-primary text-white py-16 px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm border border-white/20">
          <FileText size={32} className="text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black mb-4">Terms & Conditions</h1>
        <p className="text-white/70 text-lg max-w-xl mx-auto">
          Please read these terms carefully before using Tracksy.
        </p>
        <p className="text-white/50 text-sm mt-4">
          Last updated: April 21, 2026
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        
        {/* Intro */}
        <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl mb-12">
          <p className="text-text-secondary leading-relaxed">
            Welcome to <strong className="text-foreground">Tracksy</strong>. By accessing or using our application, 
            you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, 
            you may not access the service.
          </p>
        </div>

        <Section icon={<CheckCircle2 size={20} />} title="1. Acceptance of Terms">
          <p>
            By creating an account and using Tracksy, you confirm that you are at least 13 years of age and 
            have the legal capacity to enter into these Terms. If you are using Tracksy on behalf of an 
            organization, you represent that you have the authority to bind that organization to these Terms.
          </p>
        </Section>

        <Section icon={<Shield size={20} />} title="2. User Accounts">
          <p>
            You are responsible for maintaining the confidentiality of your account credentials. You agree to:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Provide accurate and complete information when creating your account.</li>
            <li>Keep your password secure and not share it with others.</li>
            <li>Notify us immediately of any unauthorized use of your account.</li>
            <li>Be responsible for all activities that occur under your account.</li>
          </ul>
          <p className="mt-3">
            Tracksy reserves the right to suspend or terminate accounts that violate these Terms.
          </p>
        </Section>

        <Section icon={<FileText size={20} />} title="3. Use of the Service">
          <p>You agree to use Tracksy only for lawful purposes and in accordance with these Terms. You agree NOT to:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Use the service in any way that violates applicable local, national, or international law.</li>
            <li>Transmit any unsolicited or unauthorized advertising or promotional material.</li>
            <li>Attempt to gain unauthorized access to any part of the service or its related systems.</li>
            <li>Engage in any conduct that restricts or inhibits anyone's use or enjoyment of the service.</li>
            <li>Upload or transmit viruses or any other malicious code that may affect the service.</li>
          </ul>
        </Section>

        <Section icon={<Lock size={20} />} title="4. Privacy & Data">
          <p>
            Your use of Tracksy is also governed by our Privacy Policy, which is incorporated into these Terms 
            by this reference. We collect and process personal data (such as your email, username, and habit 
            data) to provide and improve the service.
          </p>
          <p>
            We will not sell your personal data to third parties. Habit data you create belongs to you, and 
            you may request deletion of your account and all associated data at any time through the Settings page.
          </p>
        </Section>

        <Section icon={<AlertTriangle size={20} />} title="5. Intellectual Property">
          <p>
            The Tracksy application, including its original content, features, and functionality, is owned by 
            Tracksy and is protected by copyright, trademark, and other intellectual property laws.
          </p>
          <p>
            You are granted a limited, non-exclusive, non-transferable license to access and use the service 
            for personal, non-commercial purposes. You may not reproduce, distribute, modify, or create 
            derivative works without our prior written consent.
          </p>
        </Section>

        <Section icon={<RefreshCw size={20} />} title="6. Changes to Terms">
          <p>
            We reserve the right to modify or replace these Terms at any time at our sole discretion. We will 
            try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a 
            material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our service after those revisions become effective, you agree to be 
            bound by the revised terms.
          </p>
        </Section>

        <Section icon={<Shield size={20} />} title="7. Disclaimer of Warranties">
          <p>
            Tracksy is provided on an "AS IS" and "AS AVAILABLE" basis without any warranties, either express 
            or implied. We do not warrant that the service will be uninterrupted, error-free, or free of viruses 
            or other harmful components.
          </p>
          <p>
            We make no warranties or representations about the accuracy or completeness of the content available 
            through the service or the content of any third-party sites linked to the service.
          </p>
        </Section>

        <Section icon={<AlertTriangle size={20} />} title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by applicable law, Tracksy shall not be liable for any indirect, 
            incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether 
            incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses 
            arising from:
          </p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Your use of or inability to use the service.</li>
            <li>Any unauthorized access to or use of our servers and/or any personal information stored.</li>
            <li>Any interruption or cessation of transmission to or from the service.</li>
          </ul>
        </Section>

        <Section icon={<FileText size={20} />} title="9. Contact Us">
          <p>
            If you have any questions about these Terms and Conditions, please contact us at:
          </p>
          <div className="mt-4 p-4 bg-surface-raised border border-border rounded-xl">
            <p className="font-semibold text-foreground">Tracksy Support</p>
            <p className="text-sm mt-1">Email: support@tracksy.app</p>
          </div>
        </Section>

        {/* Back to app */}
        <div className="mt-16 pt-10 border-t border-border text-center">
          <p className="text-text-secondary text-sm mb-6">By using Tracksy, you agree to these terms.</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
