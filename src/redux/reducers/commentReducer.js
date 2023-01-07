import { 
    COMMENT_UPDATE, 
    COMMENT_DELETE, 
    COMMENTS_LOAD,
    COMMENTS_LOAD_DIRECT
} from "../actions";

const initialState = {
    comments: [],
    commentsDirect : [],
}

export const commentReducer = (state = initialState, action) => {
    switch (action.type) {            
        case COMMENT_UPDATE:
            const itemIndex = state.comments.findIndex(res => res.id === action.data.id)

            const nextComments = [
                ...state.comments.slice(0, itemIndex),
                action.data,
                ...state.comments.slice(itemIndex +  1)
            ];

            return { 
                ...state,
                comments: nextComments
            };

        case COMMENT_DELETE:
            const nextCom = [
                ...state.comments.filter(res => res.id !== action.data.id)
            ];

            return { 
                ...state,
                comments: nextCom
            };
            
        case COMMENTS_LOAD:
            const commentsNew = action.data.data.map(res => {

                return{
                    comment: res.comment,
                    id: res._id,
                    changed: res.changed,
                    timeChanged: res.timeChanged ? res.timeChanged : '',
                    timeCreate: res.timeCreate,
                    photo: res.photo,
                    photoSize: res.photoSize,
                    name: res.name,
                    creator: res.creator,
                    avatar: res.avatar
                }
            })
            
            return {
                ...state,
                comments: commentsNew,
            }

        case COMMENTS_LOAD_DIRECT:
            return {
                ...state,
                commentsDirect: action.data
            }

        default:
            return state;

    }
}