import x from './Modal.module.css';
import Button from '@mui/material/Button';
import {ReactComponent as CloseSvg} from '../../png/cancel.svg';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme } from '@mui/material/styles';


const Modal = ({ modal, setModal, matches, disabled, handleDelete }) => {
    const closeModal = () => {
        if(!disabled){
            setModal(false);
        }
    }
    
    const red = createTheme({
        palette: {
          primary: {
            main: 'rgb(255, 77, 77)'
          },
        },
    });

    const gray = createTheme({
        palette: {
          primary: {
            main: 'rgb(170, 170, 170)'
          },
        },
    });

    return (
        <div onClick={closeModal} className={modal ? `${x.modal} ${x.active}` : x.modal}>
            <div className={modal ? `${x.modalContent} ${x.active}` : x.modalContent} onClick={e => e.stopPropagation()}>
                <CloseSvg className={x.svg}/>
                <span className={x.sure}>Are you sure?</span>
                <span className={x.text}>Do you really want to delete these records? This<br/> process cannot be undone</span>
                <div style={{width:'75%'}}>
                    { matches ?
                        <div style={{ display:'flex', justifyContent:'space-around', textAlign:'center' }}>
                            <Button 
                                disabled={disabled} 
                                style={{fontFamily:'sans-serif', fontSize:'10px', color:'white' }} 
                                size="large" onClick={()=>setModal(false)} 
                                variant="contained"
                                theme={gray}
                            >
                                cancel
                            </Button>   
                            {disabled ?
                                <Button 
                                    style={{fontFamily:'sans-serif', fontSize:'10px' }} 
                                    size="large" 
                                    onClick={handleDelete}
                                     variant="contained"
                                     theme={red}
                                    >
                                    <div>
                                        <CircularProgress sx={{ color:'white', display:'flex', flexDirection:'column', justifyContent:'center', mr: 1}} size={15} />
                                    </div>
                                    delete
                                </Button> 
                                :
                                <Button 
                                    style={{fontFamily:'sans-serif', fontSize:'10px' }} 
                                    size="large" 
                                    variant="contained"
                                    theme={red}
                                    onClick={handleDelete}>
                                    delete
                                </Button>   
                            }
                        </div>
                    :
                        <div style={{display:'flex', justifyContent:'space-around', textAlign:'center'}}>
                            <Button 
                                disabled={disabled} 
                                style={{fontFamily:'sans-serif', fontSize:'10px', color: 'white' }} 
                                onClick={()=>setModal(false)}                                    
                                size="large" 
                                variant="contained"
                                theme={gray}>
                                cancel
                            </Button>   
                            {disabled ?
                                <Button 
                                    style={{fontFamily:'sans-serif', fontSize:'10px' }} 
                                    onClick={handleDelete} 
                                    size="large" 
                                    variant="contained"
                                    theme={red}
                                >
                                    <div>
                                        <CircularProgress sx={{ color:'white', display:'flex', flexDirection:'column', justifyContent:'center', mr: 1}} size={15} />
                                    </div>
                                    delete
                                </Button> 
                                :
                                <Button 
                                    style={{fontFamily:'sans-serif', fontSize:'10px' }} 
                                    onClick={handleDelete} 
                                    size="large" 
                                    variant="contained"
                                    theme={red}>
                                    delete
                                </Button>   
                            }
                        </div>
                    }
                </div>
                <span onClick={closeModal} className={x.close}>&times;</span>
            </div>
        </div>
    );
}
export default Modal;