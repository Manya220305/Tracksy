import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { X, Trophy } from 'lucide-react';

const AchievementUnlockedModal = ({ isOpen, onClose, achievement }) => {
  // Auto-close after 4 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && achievement && (
        <React.Fragment>
          {/* Confetti should span full screen, z-index lower than modal */}
          <div className="fixed inset-0 pointer-events-none z-[99]">
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={300}
              gravity={0.15}
            />
          </div>

          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="relative w-full max-w-sm overflow-hidden bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-6 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Glowing Background Ring */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-400 opacity-20 blur-2xl rounded-full"></div>

              {/* Content */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-yellow-200 dark:from-yellow-500/20 dark:to-yellow-300/10 rounded-2xl flex items-center justify-center shadow-lg border border-yellow-200/50 mb-4 animate-bounce shrink-0">
                  <Trophy size={32} className="text-yellow-600 dark:text-yellow-400" />
                </div>
                
                <p className="text-xs font-bold uppercase tracking-widest text-green-500 mb-2">
                  🎉 Achievement Unlocked!
                </p>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {achievement.title}
                </h3>
                
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm px-4">
                  {achievement.description}
                </p>

                <button
                  onClick={onClose}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md hover:shadow-lg"
                >
                  Awesome!
                </button>
              </div>
            </motion.div>
          </motion.div>
        </React.Fragment>
      )}
    </AnimatePresence>
  );
};

export default AchievementUnlockedModal;
