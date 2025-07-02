"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["😀", "👀", "🫏", "🏋️‍♂️", "🪱", "🦌", "👣", "🥳"];
const PAIRS = [...EMOJIS, ...EMOJIS].sort(() => Math.random() - 0.5);

export default function Home() {
  const [cards, setCards] = useState(
    PAIRS.map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }))
  );
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [showRiddle, setShowRiddle] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [first, second] = flippedIndices;
      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === first || i === second ? { ...card, matched: true } : card
            )
          );
          setFlippedIndices([]);
        }, 600);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((card, i) =>
              i === first || i === second ? { ...card, flipped: false } : card
            )
          );
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    if (cards.every((card) => card.matched)) {
      setTimeout(() => setShowRiddle(true), 800);
    }
  }, [cards]);

  const handleCardClick = (index: any) => {
    if (
      cards[index].flipped ||
      cards[index].matched ||
      flippedIndices.length === 2
    )
      return;
    setCards((prev) =>
      prev.map((card, i) => (i === index ? { ...card, flipped: true } : card))
    );
    setFlippedIndices((prev) => [...prev, index]);
  };

  const checkAnswer = () => {
    if (userAnswer.trim().toLowerCase() === "joyeux anniversaire papa") {
      setIsCorrect(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-amber-100 to-rose-100 p-4">
      {!showRiddle && (
        <div className="grid grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              className="w-16 h-16 cursor-pointer"
              onClick={() => handleCardClick(i)}
              whileHover={{ scale: 1.1 }}
            >
              <motion.div
                initial={false}
                animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full [transform-style:preserve-3d]"
              >
                <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow flex items-center justify-center text-2xl">
                  🙈
                </div>
                <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow flex items-center justify-center text-2xl [transform:rotateY(180deg)]">
                  {card.emoji}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showRiddle && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-10 p-6 bg-white rounded-xl shadow-xl text-center max-w-md"
          >
            <h2 className="text-2xl font-semibold mb-4">🤔 Le Rébus</h2>
            <p className="text-xl mb-6">
              😀 + 👀&nbsp;&nbsp;&nbsp;&nbsp;🫏 + 🏋️‍♂️ + 🪱 + 🦌 + 👣
            </p>
            {!isCorrect ? (
              <>
                <input
                  type="text"
                  placeholder="Ta réponse..."
                  className="border border-gray-300 p-2 rounded-md w-full mb-4"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                />
                <button
                  onClick={checkAnswer}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Valider
                </button>
              </>
            ) : (
              <p className="text-green-600 text-xl font-bold">
                🐸 Joyeux anniversaire papa 🐷
              </p>
            )}
            {isCorrect && (
              <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
                {Array.from({ length: 40 }).map((_, i) => {
                  const randomEmoji =
                    EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
                  const randomLeft = Math.random() * 100;
                  const randomDelay = Math.random() * 5;

                  return (
                    <motion.div
                      key={i}
                      initial={{ y: -100, opacity: 1 }}
                      animate={{ y: "110vh", opacity: 0 }}
                      transition={{
                        duration: 5 + Math.random() * 3,
                        delay: randomDelay,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="absolute text-2xl"
                      style={{
                        left: `${randomLeft}%`,
                        top: "-2rem",
                      }}
                    >
                      {randomEmoji}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
