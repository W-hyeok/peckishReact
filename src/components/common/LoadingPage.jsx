import { BarLoader } from 'react-spinners';

const LoadingPage = () => {
  return (
    <div>
      <h3>잠시 기다려주세요..</h3>
      <BarLoader color="#687fc5" height={9} width={200} />
    </div>
  );
};

export default LoadingPage;
