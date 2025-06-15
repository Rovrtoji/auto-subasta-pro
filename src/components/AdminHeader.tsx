
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface AdminHeaderProps {
  title: string;
  subtitle: string;
  stats?: Array<{
    label: string;
    value: string | number;
  }>;
}

const AdminHeader = ({ title, subtitle, stats }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-automotive-gradient text-white py-8">
      <div className="container">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/admin')}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{title}</h1>
              <p className="text-gray-200 mt-2">{subtitle}</p>
            </div>
          </div>
          
          {stats && (
            <div className="flex space-x-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-right">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-200">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
