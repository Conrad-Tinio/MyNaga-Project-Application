import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';

const StatusBadge = ({ status, showText = true }) => {
  const statusConfig = {
    available: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle2,
      text: 'Available'
    },
    low: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: AlertCircle,
      text: 'Low'
    },
    out_of_stock: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      text: 'Out of Stock'
    }
  };

  const config = statusConfig[status] || statusConfig.out_of_stock;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {showText && config.text}
    </span>
  );
};

export default StatusBadge;



