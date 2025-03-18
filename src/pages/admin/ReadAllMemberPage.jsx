import { useParams } from 'react-router-dom';
import ReadAllMemberComponent from '../../components/admin/ReadAllMemberComponent';

const ReadAllMemberPage = () => {
  const { email } = useParams();

  return (
    <div className="overflow-hidden bg-white bg-opacity-5 shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <ReadAllMemberComponent email={email} />
      </div>
    </div>
  );
};

export default ReadAllMemberPage;
