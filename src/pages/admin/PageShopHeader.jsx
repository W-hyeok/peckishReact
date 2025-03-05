import { useNavigate } from 'react-router-dom';

const PageShopHeader = ({ title }) => {
  const navigate = useNavigate();

  const toListHandler = () => {
    navigate('shoplist');
  };
   const toAddHandler = () => {
    navigate('add');
  };

  return (
    <div className="md:flex md:items-center md:justify-between mb-4">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl/7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
      </div>
      <div className="mt-4 flex md:ml-4 md:mt-0">
      </div>
    </div>
  );
};

export default PageShopHeader;
