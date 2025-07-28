import { Children, ReactNode, useState } from "react";

interface JobTabMenuItem {
  label: string;
  icon?: ReactNode;
}

interface JobTabsMenuProps {
  children ?: ReactNode;
  items: JobTabMenuItem[];
}

export default function JobTabsMenu({ children, items }: JobTabsMenuProps) {
  const [selectedTab, setSelectedTab] = useState(0);

  const onTabClick = (index: number) => {
    setSelectedTab(index);
  };

  return (
    <div>
      <div className="border-b border-gray-200 dark:border-neutral-700">
        <nav className="flex gap-x-1" aria-label="Tabs" role="tablist" aria-orientation="horizontal">
          {items.map((item, index) => (
            <button
              key={index}
              type="button"
              className={`
                py-2
                px-2
                inline-flex
                items-center
                gap-x-2
                text-sm
                border-b-2
                whitespace-nowrap
                hs-tab-active:font-semibold
                hs-tab-active:text-blue-600
                hs-tab-active:border-blue-600
                hover:text-blue-600 
                hover:border-blue-600 
                focus:ring-1
                focus:outline-none
                focus:text-blue-600
                focus:ring-blue-600
                
                bg-white dark:bg-neutral-800
                rounded-t-sm
                
                ${selectedTab == index ? 'border-blue-600 text-blue-600 font-semibold' : 'text-gray-500 border-transparent'}
              `}
              onClick={() => onTabClick(index)}
            >
              {item.icon && item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="mt-2">
        {Children.map(children, (child, index) => (
          <div
            id={`tabs-with-icons-${index + 1}`}
            role="tabpanel"
            aria-labelledby={`tabs-with-icons-item-${index + 1}`}
            className={selectedTab == index ? '' : 'hidden'}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}