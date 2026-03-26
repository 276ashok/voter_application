import React from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, UserPlus, UserMinus } from 'lucide-react';

const SummaryCards = ({ summary, loading }) => {
  const cards = [
    {
      title: 'Total Records',
      value: summary?.total_records || 0,
      icon: FileText,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      title: 'Total Voters',
      value: summary?.total_voters || 0,
      icon: Users,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10',
    },
    {
      title: 'Total Male',
      value: summary?.total_male || 0,
      icon: UserPlus,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Total Female',
      value: summary?.total_female || 0,
      icon: UserMinus,
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-white/5 glass-panel rounded-xl p-5 shadow-sm"
          >
            <div className="flex flex-col gap-1">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">{card.title}</p>
                {loading ? (
                  <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
                ) : (
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {card.value.toLocaleString()}
                  </h3>
                )}
              </div>
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default SummaryCards;
