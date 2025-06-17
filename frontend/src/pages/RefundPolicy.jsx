import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-green-700">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-green-400 mb-8 text-center"
        >
          Refund Policy
        </motion.h1>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">1. Introduction</h2>
          <p className="text-gray-300 leading-relaxed">
            At Vin2Grow, we are committed to providing high-quality handcrafted wooden products. Please read this Refund Policy carefully before making a purchase through the Vin2Grow website and services (the "Service").
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">2. No Returns or Refunds</h2>
          <p className="text-gray-300 leading-relaxed">
            <strong>Please be advised that all sales of products through the Vin2Grow Service are final.</strong> We do not offer returns, exchanges, or refunds for any products purchased, except in cases where a product is received damaged or defective, and this is reported within a specific timeframe as outlined below.
          </p>
          <p className="text-gray-300 leading-relaxed mt-2">
            We encourage you to carefully review product descriptions, images, and dimensions before completing your purchase. If you have any questions about a product, please contact us prior to placing your order.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">3. Damaged or Defective Products</h2>
          <p className="text-gray-300 leading-relaxed">
            In the rare event that you receive a damaged or defective product, please contact our customer support team at [Your Contact Email Address] within <strong>48 hours</strong> of delivery. To facilitate the process, please provide:
          </p>
          <ul className="list-disc list-inside text-gray-300 leading-relaxed space-y-2 mt-2">
            <li>Your order number.</li>
            <li>Clear photographs of the damaged or defective item, including the packaging if it was also damaged.</li>
            <li>A brief description of the issue.</li>
          </ul>
          <p className="text-gray-300 leading-relaxed mt-2">
            Upon verification of the damage or defect, we will, at our discretion, offer a replacement of the same item (if available) or a store credit. Please note that we do not offer monetary refunds for damaged or defective items.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">4. Cancellations</h2>
          <p className="text-gray-300 leading-relaxed">
            Users may have the option to cancel an order through their order page, provided the order has not yet been processed for delivery. Please note that **canceled orders are non-refundable.** We encourage users to carefully review their orders before confirming cancellation.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">5. Changes to This Policy</h2>
          <p className="text-gray-300 leading-relaxed">
            We reserve the right to modify or update this Refund Policy at any time. Any changes will be posted on this page, and your continued use of the Service after such modifications will constitute your acknowledgment and agreement of the modified policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-100 mb-4">6. Contact Us</h2>
          <p className="text-gray-300 leading-relaxed">
            If you have any questions about our Refund Policy, please contact us at [Your Contact Email Address].
          </p>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy; 