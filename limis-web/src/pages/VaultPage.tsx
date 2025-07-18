import { useSelector } from 'react-redux';
import type { RootState } from '../state/store';

const DashboardPage = () => {
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-2">VAULT Page</h1>
      <pre className="bg-gray-100 dark:bg-zinc-800 p-4 rounded text-sm whitespace-pre-wrap">
        {JSON.stringify({ user, loading, error }, null, 2)}
      </pre>
    </div>
  );
};

export default DashboardPage;
