import Loader from 'react-loader-spinner';
import { useSelector } from 'react-redux';

const Spin = (props) => {
    const spinner = useSelector(state => state.appReducer.loading)

    return(
      <div className='loader-styles'>
        <Loader 
          type="TailSpin"
          color="rgba(149, 139, 145, 1)"
          height={60}
          width={60}
          visible={spinner}
        />
      </div>
    )
}

export default Spin;