import { useParams } from 'react-router-dom';
import ReadMemberComponent from '../../components/admin/ReadMemberComponent';

const ReadMemberPage = () => {
  const { email } = useParams();

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <ReadMemberComponent email={email} />
      </div>
    </div>
  );
};

export default ReadMemberPage;
