import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-green-700">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-green-400 mb-8 text-center"
        >
          Terms and Conditions
        </motion.h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">1. Introduction</h2>
          <p className="text-gray-300 leading-relaxed">
            Welcome to Vin2Grow! These Terms and Conditions ("Terms") govern your use of the Vin2Grow website and services (collectively, the "Service") provided by Vin2Grow ("we," "us," or "our"). By accessing or using our Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">2. User Accounts</h2>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
            <li>You must be at least 18 years old to create an account and make purchases.</li>
            <li>You are responsible for maintaining the confidentiality of your account information, including your password, and for all activities that occur under your account.</li>
            <li>You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</li>
            <li>We reserve the right to suspend or terminate your account if any information provided during the registration process or thereafter proves to be inaccurate, false, or incomplete.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">3. Product Information</h2>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
            <li>We strive to be as accurate as possible in the description of our handcrafted wooden products. However, we do not warrant that product descriptions or other content of the Service is entirely accurate, complete, reliable, current, or error-free.</li>
            <li>Colors and textures of products may vary slightly due to natural variations in wood and differences in display settings.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">4. Pricing and Payment</h2>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2">
            <li>All prices are listed in Indian Rupees (₹) unless otherwise specified.</li>
            <li>Prices for our products are subject to change without notice.</li>
            <li>We accept various payment methods as indicated on our checkout page. By placing an order, you confirm that you are authorized to use the chosen payment method.</li>
            <li>In the event of a pricing error, we reserve the right to cancel any orders placed with the incorrect price, whether or not the order has been confirmed and your payment processed.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">5. Shipping and Delivery</h2>
          <p className="text-gray-300 leading-relaxed">
            Please refer to our <Link to="/shipping-policy" className="text-green-400 hover:underline">Shipping Policy</Link> for detailed information regarding shipping methods, delivery times, and associated costs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">6. Returns and Refunds</h2>
          <p className="text-gray-300 leading-relaxed">
            Please note that all sales are final. Vin2Grow does not offer returns or refunds on any products sold through our Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">7. Intellectual Property</h2>
          <p className="text-gray-300 leading-relaxed">
            All content on the Vin2Grow Service, including text, graphics, logos, images, product designs, and software, is the property of Vin2Grow or its content suppliers and protected by intellectual property laws. You may not use, reproduce, or distribute any content from the Service without our express written permission.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">8. Prohibited Activities</h2>
          <p className="text-gray-300 leading-relaxed">
            You agree not to engage in any of the following prohibited activities: (a) using the Service for any illegal purpose; (b) violating any international, federal, provincial or state regulations, rules, laws, or local ordinances; (c) infringing upon or violate our intellectual property rights or the intellectual property rights of others; (d) to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate based on gender, sexual orientation, religion, ethnicity, race, age, national origin, or disability; (e) to submit false or misleading information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">9. Disclaimer of Warranties</h2>
          <p className="text-gray-300 leading-relaxed">
            The Service is provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement, or course of performance.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">10. Limitation of Liability</h2>
          <p className="text-gray-300 leading-relaxed">
            In no event shall Vin2Grow, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">11. Indemnification</h2>
          <p className="text-gray-300 leading-relaxed">
            You agree to defend, indemnify and hold harmless Vin2Grow and its licensee and licensors, and their employees, contractors, agents, officers and directors, from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees), resulting from or arising out of a) your use and access of the Service, by you or any person using your account and password; b) a breach of these Terms, or c) Content posted on the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">12. Governing Law</h2>
          <p className="text-gray-300 leading-relaxed">
            These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">13. Changes to These Terms</h2>
          <p className="text-gray-300 leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">14. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about these Terms, please contact us at [Your Contact Email Address].
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions; 