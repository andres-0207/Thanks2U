import React, { useState } from 'react';
import { Ticket, Sparkles } from 'lucide-react';

interface SlotMachineProps {
  onComplete: (tickets: string[]) => void;
  maxTickets: number;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ onComplete, maxTickets }) => {
  const [ticketCount, setTicketCount] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [displayNumbers, setDisplayNumbers] = useState<string[]>([]);
  const [showBuyButton, setShowBuyButton] = useState(false);

  const generateRandomTicket = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
  };

  const handleGenerate = () => {
    setIsSpinning(true);
    setShowBuyButton(false);
    
    // Initialize placeholders
    const tempTickets = Array(ticketCount).fill("00000");
    setDisplayNumbers(tempTickets);

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayNumbers(prev => prev.map(() => generateRandomTicket()));
      iterations++;
      
      if (iterations > 20) {
        clearInterval(interval);
        const finalTickets = Array(ticketCount).fill(0).map(() => generateRandomTicket());
        setDisplayNumbers(finalTickets);
        setIsSpinning(false);
        setShowBuyButton(true);
      }
    }, 100);
  };

  return (
    <div className="bg-slate-100 p-6 rounded-2xl text-center border border-slate-200 shadow-inner">
      <h3 className="text-2xl font-bold text-navy mb-2">¡Apóyame y participa!</h3>
      
      {!showBuyButton && !isSpinning && (
        <div className="flex items-center justify-center gap-4 my-6">
          <label className="font-semibold text-slate-700">Boletos:</label>
          <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
            <button 
              onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
              className="w-8 h-8 flex items-center justify-center bg-slate-200 rounded hover:bg-slate-300 font-bold text-navy"
            >-</button>
            <span className="text-xl font-bold w-8 text-center text-navy">{ticketCount}</span>
            <button 
              onClick={() => setTicketCount(Math.min(maxTickets, ticketCount + 1))}
              className={`w-8 h-8 flex items-center justify-center rounded font-bold text-navy transition-colors ${ticketCount >= maxTickets ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-200 hover:bg-slate-300'}`}
              disabled={ticketCount >= maxTickets}
            >+</button>
          </div>
          <p className="text-xs text-slate-500">
             (Máximo disponible: {maxTickets})
          </p>
        </div>
      )}

      {/* Ticket Display Grid */}
      <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-3 justify-center">
        {displayNumbers.map((num, idx) => (
          <div key={idx} className={`
            bg-white border-2 border-orange-500 rounded-lg py-3 px-4 
            font-mono text-xl font-bold text-navy shadow-md flex items-center justify-center gap-2
            ${isSpinning ? 'animate-pulse' : 'transform transition-all duration-500 hover:scale-105'}
          `}>
            <Ticket size={20} className="text-orange-500" />
            {num}
          </div>
        ))}
      </div>

      {!showBuyButton ? (
        <button
          onClick={handleGenerate}
          disabled={isSpinning}
          className={`
            w-full py-3 px-6 rounded-xl font-bold text-white shadow-lg transition-all
            ${isSpinning ? 'bg-slate-400 cursor-wait' : 'bg-navy hover:bg-slate-800 hover:shadow-xl'}
          `}
        >
          {isSpinning ? 'Generando...' : 'Generar Boleto(s)'}
        </button>
      ) : (
        <button
          onClick={() => onComplete(displayNumbers)}
          className="w-full py-3 px-6 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg animate-bounce flex items-center justify-center gap-2"
        >
          <Sparkles size={20} />
          ¿Quieres comprar?
        </button>
      )}
    </div>
  );
};