import { useParams } from 'react-router-dom';
import ReadComponent from '../../components/admin/ReadComponent';

const ReadPage = () => {
  const { email } = useParams();

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <ReadComponent email={email} />
      </div>
    </div>
  );
};

export default ReadPage;
