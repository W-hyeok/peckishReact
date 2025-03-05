import { useParams } from 'react-router-dom';
import ModifyComponent from '../../components/admin/ModifyComponent';

const ModifyPage = () => {
  const { email } = useParams();

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <ModifyComponent email={email} />
      </div>
    </div>
  );
};

export default ModifyPage;
