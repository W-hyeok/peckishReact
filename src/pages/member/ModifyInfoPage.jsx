import { useParams } from 'react-router-dom';
import ModifyInfoComponent from '../../components/member/ModifyInfoComponent';

const ModifyInfoPage = () => {
  const { email } = useParams();

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <ModifyInfoComponent />
      </div>
    </div>
  );
};

export default ModifyInfoPage;
