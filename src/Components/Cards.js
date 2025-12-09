import { hiringCards, workCards } from "../Assets/assets";

const Cards = ({ isHiring }) => {
  const cards = isHiring ? hiringCards : workCards;

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="group bg-[var(--accent-mint)] border border-[var(--accent-pink)] rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl sm:hover:shadow-2xl transition-all duration-500 cursor-pointer"
          >
            {/*-----  the images----- */}
            <div className="h-48 sm:h-56 md:h-64 overflow-hidden">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-700"
              />
            </div>

            <div className="p-4 sm:p-5 md:p-6 text-[var(--color-primary)]">
              
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                {card.title}
              </h3>

              <div className="overflow-hidden">
                
                <p className="mb-4 sm:mb-6 text-sm sm:text-base transition-all duration-300 group-hover:text-base sm:group-hover:text-lg group-hover:leading-relaxed">
                  {card.description}
                  <span className="block mt-2 sm:mt-3 text-xs sm:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    Click to get started
                  </span>
                </p>
              </div>

              
              <button className="w-full py-2.5 sm:py-3 md:py-3.5 bg-[var(--color-cta)] text-[var(--color-secondary)] font-semibold rounded-lg text-sm sm:text-base transition-all duration-300 group-hover:shadow-md sm:group-hover:shadow-lg">
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
