import React from 'react';
import { motion } from 'framer-motion';

const Instructions = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-4xl mx-auto text-primary"
    >
      <motion.h1 variants={itemVariants} className="text-4xl font-black mb-8 tracking-tighter">
        Reglament Open Bloc 2025
      </motion.h1>

      <motion.div variants={itemVariants} className="mb-8 p-6 bg-surface rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-accent-hover">Format de la Competició</h2>
        <p className="text-secondary">
          L'Open Bloc és una competició d'escalada en format americà. Els participants disposen d'un temps determinat per intentar resoldre el màxim nombre de blocs possible, sense límit d'intents. L'objectiu és sumar punts i, sobretot, gaudir de l'escalada en comunitat.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-8 p-6 bg-surface rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-accent-hover">Sistema de Puntuació</h2>
        <p className="text-secondary mb-4">
          La puntuació de cada bloc ve definida per la seva dificultat. No hi ha penalització per intents. La puntuació final és la suma dels punts de tots els blocs completats.
        </p>
        <ul className="space-y-2">
          <li className="flex items-center"><span className="font-bold w-24">Molt Fàcil:</span> <span className="text-accent font-bold">1 punt</span></li>
          <li className="flex items-center"><span className="font-bold w-24">Fàcil:</span> <span className="text-accent font-bold">2 punts</span></li>
          <li className="flex items-center"><span className="font-bold w-24">Mitjà:</span> <span className="text-accent font-bold">5 punts</span></li>
          <li className="flex items-center"><span className="font-bold w-24">Difícil:</span> <span className="text-accent font-bold">10 punts</span></li>
        </ul>
      </motion.div>

      <motion.div variants={itemVariants} className="p-6 bg-surface rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-accent-hover">Normes Generals</h2>
        <ol className="list-decimal list-inside space-y-3 text-secondary">
          <li>Respecteu les instal·lacions, el material i la resta de participants. La seguretat i el bon ambient són responsabilitat de tothom.</li>
          <li>Perquè un bloc es consideri completat ("encadenat"), el participant ha de subjectar la presa final (TOP) amb les dues mans de forma visiblement controlada.</li>
          <li>Està prohibit alterar les preses, el seu estat o el recorregut dels blocs. Feu servir només les preses i volums del color corresponent.</li>
          <li>L'organització es reserva el dret de resoldre qualsevol disputa o situació no contemplada en aquest reglament. La seva decisió serà final.</li>
          <li>Escala amb responsabilitat. Coneix els teus límits i escalfa correctament abans de començar.</li>
        </ol>
      </motion.div>
    </motion.div>
  );
};

export default Instructions;
