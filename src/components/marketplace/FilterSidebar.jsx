import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, Star, Filter } from 'lucide-react';

const DEFAULT_CATEGORIES = [
  { id: 'development', label: 'Development & IT', count: 1240 },
  { id: 'design', label: 'Design & Creative', count: 850 },
  { id: 'marketing', label: 'Marketing & Growth', count: 620 },
  { id: 'operations', label: 'Operations & Support', count: 430 },
];

const DEFAULT_LOCATIONS = [
  { id: 'us', label: 'United States', count: 1100 },
  { id: 'uk', label: 'United Kingdom', count: 450 },
  { id: 'eu', label: 'Europe', count: 890 },
  { id: 'africa', label: 'Africa', count: 320 },
];

const DEFAULT_DISTANCE = [
  { id: '5', label: 'Within 5 miles' },
  { id: '10', label: 'Within 10 miles' },
  { id: '25', label: 'Within 25 miles' },
  { id: '50', label: 'Within 50 miles' },
];

const DEFAULT_RATES = [
  { id: 'all', label: 'Any hourly rate' },
  { id: 'low', label: 'Under $60/hr' },
  { id: 'mid', label: '$60 - $110/hr' },
  { id: 'high', label: '$110+/hr' },
];

const DEFAULT_BADGES = [
  { id: 'top rated', label: 'Top Rated' },
  { id: 'identity verified', label: 'Identity Verified' },
  { id: 'enterprise ready', label: 'Enterprise Ready' },
];

const DEFAULT_AVAILABILITY = [
  { id: 'now', label: 'Available Now' },
  { id: 'week', label: 'Available This Week' },
];

const DEFAULT_PROVIDER_TYPES = [
  { id: 'freelancer', label: 'Freelancers' },
  { id: 'agency', label: 'Agencies' },
];

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-200 py-4">
      <button
        className="flex items-center justify-between w-full text-left font-semibold text-zinc-900 mb-2 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {title}
        {isOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
      </button>
      {isOpen ? <div className="mt-3 space-y-2 text-sm text-zinc-600">{children}</div> : null}
    </div>
  );
};

function CheckboxOption({ id, label, count, checked, onChange }) {
  return (
    <label className="flex items-center justify-between group cursor-pointer">
      <span className="flex items-center gap-2">
        <input
          checked={checked}
          className="w-4 h-4 rounded border-zinc-300 text-brand-600 focus:ring-brand-500/20 cursor-pointer"
          id={id}
          onChange={onChange}
          type="checkbox"
        />
        <span className="group-hover:text-zinc-900 transition-colors">{label}</span>
      </span>
      {count !== undefined ? <span className="text-xs text-zinc-400">{count}</span> : null}
    </label>
  );
}

function RadioOption({ id, label, checked, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        checked={checked}
        className="w-4 h-4 border-zinc-300 text-brand-600 focus:ring-brand-500/20"
        name={id}
        onChange={onChange}
        type="radio"
      />
      <span>{label}</span>
    </label>
  );
}

const FilterSidebar = ({
  type = 'online',
  categories = DEFAULT_CATEGORIES,
  locations = DEFAULT_LOCATIONS,
  distances = DEFAULT_DISTANCE,
  rateOptions = DEFAULT_RATES,
  badgeOptions = DEFAULT_BADGES,
  availabilityOptions = DEFAULT_AVAILABILITY,
  providerOptions = DEFAULT_PROVIDER_TYPES,
  selectedCategoryIds = [],
  selectedBadgeIds = [],
  selectedLocationIds = [],
  selectedDistanceIds = [],
  selectedRate = 'all',
  selectedAvailability = 'all',
  selectedProvider = 'all',
  onToggleCategory,
  onToggleBadge,
  onToggleLocation,
  onToggleDistance,
  onRateChange,
  onAvailabilityChange,
  onProviderChange,
  onClear,
}) => {
  const isControlled = Boolean(
    onToggleCategory ||
      onToggleBadge ||
      onToggleLocation ||
      onToggleDistance ||
      onRateChange ||
      onAvailabilityChange ||
      onProviderChange ||
      onClear
  );

  return (
    <div className="w-full bg-white border border-zinc-200 rounded-xl p-5 sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto hidden lg:block">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200">
        <h2 className="font-bold text-lg text-zinc-900 flex items-center gap-2">
          <Filter className="w-5 h-5 text-zinc-500" />
          Filters
        </h2>
        <button
          className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          onClick={onClear}
          type="button"
        >
          Clear all
        </button>
      </div>

      <FilterSection title="Category" defaultOpen={true}>
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 -tranzinc-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            className="w-full bg-surface border border-zinc-200 rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            placeholder="Browse categories"
            readOnly
            type="text"
            value=""
          />
        </div>
        {categories.map((category) => (
          <CheckboxOption
            checked={selectedCategoryIds.includes(category.id)}
            count={category.count}
            id={`category-${category.id}`}
            key={category.id}
            label={category.label || category.name}
            onChange={isControlled ? () => onToggleCategory?.(category.id) : undefined}
          />
        ))}
      </FilterSection>

      <FilterSection title="Hourly Rate" defaultOpen={true}>
        {rateOptions.map((rate) => (
          <RadioOption
            checked={selectedRate === rate.id}
            id={`rate-${rate.id}`}
            key={rate.id}
            label={rate.label}
            onChange={isControlled ? () => onRateChange?.(rate.id) : undefined}
          />
        ))}
      </FilterSection>

      {type === 'onsite' ? (
        <FilterSection title="Distance" defaultOpen={true}>
          {distances.map((distance) => (
            <CheckboxOption
              checked={selectedDistanceIds.includes(distance.id)}
              id={`distance-${distance.id}`}
              key={distance.id}
              label={distance.label}
              onChange={isControlled ? () => onToggleDistance?.(distance.id) : undefined}
            />
          ))}
        </FilterSection>
      ) : (
        <FilterSection title="Talent Location" defaultOpen={true}>
          {locations.map((location) => (
            <CheckboxOption
              checked={selectedLocationIds.includes(location.id)}
              count={location.count}
              id={`location-${location.id}`}
              key={location.id}
              label={location.label}
              onChange={isControlled ? () => onToggleLocation?.(location.id) : undefined}
            />
          ))}
        </FilterSection>
      )}

      <FilterSection title="Trust and Quality" defaultOpen={true}>
        {badgeOptions.map((badge) => (
          <CheckboxOption
            checked={selectedBadgeIds.includes(badge.id)}
            id={`badge-${badge.id}`}
            key={badge.id}
            label={
              badge.id === 'top rated' ? (
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {badge.label}
                </span>
              ) : (
                badge.label
              )
            }
            onChange={isControlled ? () => onToggleBadge?.(badge.id) : undefined}
          />
        ))}
      </FilterSection>

      <FilterSection title="Availability" defaultOpen={false}>
        {availabilityOptions.map((option) => (
          <RadioOption
            checked={selectedAvailability === option.id}
            id={`availability-${option.id}`}
            key={option.id}
            label={option.label}
            onChange={isControlled ? () => onAvailabilityChange?.(option.id) : undefined}
          />
        ))}
        <RadioOption
          checked={selectedAvailability === 'all'}
          id="availability-all"
          label="Any availability"
          onChange={isControlled ? () => onAvailabilityChange?.('all') : undefined}
        />
      </FilterSection>

      <FilterSection title="Provider Type" defaultOpen={false}>
        <RadioOption
          checked={selectedProvider === 'all'}
          id="provider-all"
          label="All provider types"
          onChange={isControlled ? () => onProviderChange?.('all') : undefined}
        />
        {providerOptions.map((provider) => (
          <RadioOption
            checked={selectedProvider === provider.id}
            id={`provider-${provider.id}`}
            key={provider.id}
            label={provider.label}
            onChange={isControlled ? () => onProviderChange?.(provider.id) : undefined}
          />
        ))}
      </FilterSection>
    </div>
  );
};

export default FilterSidebar;
