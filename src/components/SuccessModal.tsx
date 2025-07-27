'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

interface SuccessModalProps {
  isOpen: boolean;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen }) => {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        router.push('/user/dashboard');
      }, 2000); // Redirect after 2 seconds
      return () => clearTimeout(timer);
    }
  }, [isOpen, router]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          aria-label="Success notification modal"
          role="alertdialog"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg border border-gray-200"
          >
            <Confetti width={window.innerWidth} height={window.innerHeight} />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold text-green-700">Successful!</h2>
              <p className="mt-2 text-gray-600">You are being redirected to your dashboard...</p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;