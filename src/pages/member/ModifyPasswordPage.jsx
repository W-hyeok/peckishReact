import { useParams } from 'react-router-dom';
import ModifyPasswordComponent from '../../components/member/ModifyPasswordComponent';

const ModifyPasswordPage = () => {
  const { email } = useParams();

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <ModifyPasswordComponent />
      </div>
    </div>
  )
}

export default ModifyPasswordPage