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
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">What's Hot</h2>
      </div>

      <div className="space-y-4">
        {hotProducts.map((product, idx) => (
          <div key={idx} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm p-4 rounded-xl border border-white/40 dark:border-slate-800 flex justify-between items-center hover:shadow-md transition-shadow cursor-default">
            <div>
              <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100 mb-1">{product.name}</h3>
              <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">{product.category}</span>
            </div>
            <div className="flex items-center text-red-600 dark:text-red-400 font-bold text-sm bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
              <ArrowUp size={14} className="mr-1" />
              {product.uplift}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-5 border-t border-orange-200/50 dark:border-orange-900/30">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex justify-between items-center">
          <span>Based on WoW search volume</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        </div>
      </div>
    </div>
  );
}
