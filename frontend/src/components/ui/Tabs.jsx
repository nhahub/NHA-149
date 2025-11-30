import { useState } from "react";
import { cn } from "../../utils/helpers.js";

export function Tabs({ tabs, defaultTab, onChange, className = "" }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onChange) onChange(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={cn("w-full", className)}>
      {/* Tab List */}
      <div className="border-b border-secondary-200 mb-6">
        <nav className="flex flex-wrap gap-2 -mb-px" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-secondary-600 hover:text-secondary-900 hover:border-secondary-300"
              )}
              aria-current={activeTab === tab.id ? "page" : undefined}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
              {tab.badge && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-primary-100 text-primary-700">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTabContent && activeTabContent.content}
      </div>
    </div>
  );
}

export function TabPanel({ id, activeId, children, className = "" }) {
  if (id !== activeId) return null;

  return <div className={cn("tab-panel", className)}>{children}</div>;
}

