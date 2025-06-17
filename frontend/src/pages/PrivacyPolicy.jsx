import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-green-700">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-green-400 mb-8 text-center"
        >
          Privacy Policy
        </motion.h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">1. Introduction</h2>
          <p className="text-gray-300 leading-relaxed">
            Vin2Grow ("we," "our," or "us") operates the Vin2Grow website and services (the "Service"). This Privacy Policy informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            We use your data to provide and improve the Service. By using the Service, you agree to the collection and use of information in accordance with this policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">2. Information Collection and Use</h2>
          <p className="text-gray-300 leading-relaxed">
            We collect several different types of information for various purposes to provide and improve our Service to you.
          </p>
          <h3 className="text-xl font-semibold text-gray-100 mt-4 mb-2">Types of Data Collected</h3>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
            <li><strong>Personal Data:</strong> While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to: Email address, Name (first and last), Phone number, Address, State, Province, ZIP/Postal code, City, Cookies and Usage Data.</li>
            <li><strong>Usage Data:</strong> We may also collect information how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.</li>
            <li><strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">3. Use of Data</h2>
          <p className="text-gray-300 leading-relaxed">
            Vin2Grow uses the collected data for various purposes:
          </p>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer support</li>
            <li>To gather analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To fulfill orders and manage payments</li>
            <li>To send you marketing and promotional communications (if you have opted in)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">4. Transfer of Data</h2>
          <p className="text-gray-300 leading-relaxed">
            Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction. If you are located outside India and choose to provide information to us, please note that we transfer the data, including Personal Data, to India and process it there. Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">5. Disclosure of Data</h2>
          <h3 className="text-xl font-semibold text-gray-100 mt-4 mb-2">Legal Requirements</h3>
          <p className="text-gray-300 leading-relaxed">
            Vin2Grow may disclose your Personal Data in the good faith belief that such action is necessary to:
          </p>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
            <li>To comply with a legal obligation</li>
            <li>To protect and defend the rights or property of Vin2Grow</li>
            <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>To protect the personal safety of users of the Service or the public</li>
            <li>To protect against legal liability</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">6. Security of Data</h2>
          <p className="text-gray-300 leading-relaxed">
            The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">7. Service Providers</h2>
          <p className="text-gray-300 leading-relaxed">
            We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">8. Links to Other Sites</h2>
          <p className="text-gray-300 leading-relaxed">
            Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">9. Children's Privacy</h2>
          <p className="text-gray-300 leading-relaxed">
            Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">10. Changes to This Privacy Policy</h2>
          <p className="text-gray-300 leading-relaxed">
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We will let you know via email and/or a prominent notice on our Service, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">11. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2 mt-2">
            <li>By email: [Your Contact Email Address]</li>
            <li>By visiting this page on our website: [Your Contact Page URL]</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;