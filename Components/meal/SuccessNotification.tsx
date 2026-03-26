import { motion } from 'framer-motion';

interface Props {
  message: string;
}

export default function SuccessNotification({ message }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-8 right-8 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-semibold"
    >
      {message}
    </motion.div>
  );
}