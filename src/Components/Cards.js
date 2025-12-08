import { hiringCards, workCards } from '../Assets/assets';

const Cards = ({isHiring}) => {
  const cards = isHiring ? hiringCards : workCards;

  return (
    <div className="max-w-6xl mx-auto p-4">
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group bg-[var(--accent-mint)] border border-[var(--accent-pink)] rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer"
          >
            
            <div className="h-64 overflow-hidden">
              <img 
                src={card.image} 
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            
            <div className="p-6 text-[var(--color-primary)]">
              <h3 className="text-xl font-bold mb-4">
                {card.title}
              </h3>
              
              <div className="overflow-hidden">
                <p className="mb-6 transition-all duration-300 group-hover:text-lg group-hover:leading-relaxed">
                  {card.description}
                  <span className="block mt-3 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Click to get started
                  </span>
                </p>
              </div>
              
              
              <button className="w-full py-3.5 bg-[var(--color-cta)] text-[var(--color-secondary)] font-semibold rounded-lg  transition-all duration-300 group-hover:shadow-lg">
                {card.action}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cards;