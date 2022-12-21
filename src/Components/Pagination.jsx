import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';

const Paginate = ({ setEditText, setEditPhoto, setEditMode, disabled, loading }) => {
  const numberOfPages = useSelector((state) => state.commentReducer.numberOfPages);

  const func = () => {
    setEditMode(false);
    setEditPhoto({ photoBase64: '', file: null });
    setEditText('');
  }

  return (
    <div style={{
      display:'flex',
      alignItems:'center',
      justifyContent:'center',
    }}>
      {numberOfPages ?
        <Pagination 
          onClick={func}
          shape='rounded'
          count={numberOfPages}
          page={Number(localStorage.getItem('page'))}
          variant="outlined"
          color="primary"
          disabled={disabled || loading}
          renderItem={(item) => (
            <PaginationItem style={{
              border:'1px solid gray', 
              color:'gray', 
              fontSize:'11px',
              margin:'0px 3px',
              borderRadius:'4px'
            }} 
              color="string" 
              {...item}
              component={Link} 
              to={`/comments?page=${item.page}`} 
            />
        )}
      /> 
      : null
    }
    </div>
  );
};

export default Paginate;