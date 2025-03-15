import { useParams } from 'react-router-dom';
import ModifyPasswordComponent from '../../components/member/ModifyPasswordComponent';

const ModifyPasswordPage = () => {
  const { email } = useParams();

  return (
    <div className="px-4 py-5 sm:p-6">
      <ModifyPasswordComponent />
    </div>
  )
}

export default ModifyPasswordPage