import { useParams } from 'react-router-dom';
import ModifyInfoComponent from '../../components/member/ModifyInfoComponent';

const ModifyInfoPage = () => {
  const { email } = useParams();

  return (
      <div className="px-4 py-5 sm:p-6">
        <ModifyInfoComponent />
      </div>
  );
};

export default ModifyInfoPage;
