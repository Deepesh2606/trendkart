import { Flame, ArrowUp } from 'lucide-react';

export default function WhatsHotCard() {
  const hotProducts = [
    { name: "MagSafe Battery Pack", uplift: "+145%", category: "Chargers" },
    { name: "Privacy Screen Guard", uplift: "+89%", category: "Covers" },
    { name: "Gaming Finger Sleeves", uplift: "+76%", category: "Accessories" },
  ];

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 border border-orange-100 dark:border-orange-900/50 rounded-xl p-5 shadow-sm h-full">
      <div className="flex items-center space-x-2 mb-6">
        <div className="p-2 bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-400 rounded-lg">
          <Flame size={20} />
        </div>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">What's Hot</h2>
      </div>

      <div className="space-y-4">
        {hotProducts.map((product, idx) => (
          <div key={idx} className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm p-4 rounded-xl border border-white/40 dark:border-zinc-800 flex justify-between items-center hover:shadow-md transition-shadow cursor-default">
            <div>
              <h3 className="font-medium text-sm text-zinc-900 dark:text-zinc-100 mb-1">{product.name}</h3>
              <span className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">{product.category}</span>
            </div>
            <div className="flex items-center text-red-600 dark:text-red-400 font-bold text-sm bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
              <ArrowUp size={14} className="mr-1" />
              {product.uplift}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-5 border-t border-orange-200/50 dark:border-orange-900/30 space-y-4">
        <div className="text-xs text-zinc-500 dark:text-zinc-400 flex justify-between items-center">
          <span>Based on WoW search volume</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
        
        <a 
          href={`https://www.google.com/search?q=latest+trending+mobile+accessories+in+india+2024`}
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center space-x-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/40 dark:hover:bg-orange-900/60 text-orange-700 dark:text-orange-400 py-3 rounded-xl font-medium text-sm transition-colors active:scale-[0.98] custom-focus-ring group"
        >
          <span>Explore Latest Releases</span>
          <ArrowUp size={16} className="group-hover:-tranzinc-y-1 group-hover:tranzinc-x-1 transition-transform rotate-45" />
        </a>
      </div>
    </div>
  );
}
