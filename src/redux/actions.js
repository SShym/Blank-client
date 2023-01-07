import axios from 'axios';
export const ERROR_DISPLAY_ON = 'ERROR_DISPLAY_ON';
export const ERROR_DISPLAY_OFF = 'ERROR_DISPLAY_OFF';

const API = axios.create({ 
    baseURL: 'http://localhost:5000'
});

export const deleteDirectChat = () => async (dispatch) => {
    try {
        await API.post('').then(() => {

        })
    } catch (error) {

    }
}
