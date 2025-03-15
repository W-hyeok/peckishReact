import { useParams } from 'react-router-dom';
import ReadComponent from '../../components/member/ReadComponent';

const ReadPage = () => {
  return (
    <div className="px-4 py-5 sm:p-6">
      <ReadComponent />
    </div>
  );
};

export default ReadPage;
