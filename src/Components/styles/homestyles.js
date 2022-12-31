import styled from "styled-components";

export const SwitchButton = styled.label`
  position: relative;
  display: inline-block;
  width: 22px;
  height: 32px;
  bottom: -4px;
  margin-left: 25px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    border: 1px solid black;
    position: absolute;
    cursor: pointer;
    top: 16px;
    left: -15px;
    right: 0;
    bottom: 0;
    background-color: rgb(170, 180, 190);
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    border-radius: 34px;
  }

  span:before {
    transform: ${(props) => props.theme.transform};
    position: absolute;
    content: "";
    height: 22px;
    width: 22px;
    left: -1px;
    top: -5px;
    background-color: ${(props) => props.theme.button};
    background-size: 14px;
    background-position: center;
    background-repeat: no-repeat;
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    border-radius: 50%;
    border: 1px solid black;
    cursor: pointer;
  }

  input:focus + span {
    box-shadow: 0 0 1px #2196f3;
  }
`;

export const Black = styled.div`
  div{
    color: rgb(101, 101, 101);
  }
  
  .pick{
    transition-property: color, border-color;
    transition-duration: 0.5s;
    color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(181, 181, 181)'};
    border-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'gray'};
  }
`;

export const NavbarBlock = styled.div`
  height: 45px;
  margin: 20px 20px 0px 20px;
  transition: all 0.5s;
  background-color: ${(props) => props.theme.backgroundNavbar};
  @media(min-width: 576px){
    border-top: 1px solid ${(props) => props.theme.border};
    border-left: 1px solid ${(props) => props.theme.border};
    border-right: 1px solid ${(props) => props.theme.border};
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
  }
  @media (max-width: 576px) { 
    margin: 0px 
  }
  padding: 4px 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .navbar-link button{
    border: 1px solid ${(props) => props.theme.border};
    color: ${(props) => props.theme.border};
  }

  .verification-text{
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};
  }
`;

export const NavbarBlockUser = styled.div`
  transition: all 0.5s; 
  display: flex;
  align-items: center; 
  cursor: pointer;
  text-align: center;
  border: 1px solid ${(props) => props.theme.border};
  height: 36px;
  color: ${(props) => props.theme.border};
  border-radius: 25px;
  
  .navAvatar{
    transition-property: color, background;
    transition-duration: 0.5s;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(0, 100, 100)'};
    color: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(199, 199, 199)'};
  }

  .block-navbar{
    transition: all 0.5s;
    position: absolute;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(0, 0, 0, 0.2)'};
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }
  
`;

export const NavbarLogo = styled.div`
  transition: all 0.5s;
  cursor: pointer;
  width: 28px;
  width: 28px;
  fill: ${(props) => props.theme.border};
`;

export const PageBackground = styled.div`
  transition: all 0.5s;
  background-image: url(${(props) => props.theme.pageBackground});
  padding: 20px;
  flex-basis: calc(33.333% - 40px);
  flex-grow: 1;
  flex-shrink: 0;
  height: 600px;
  margin: 0px 20px 20px 20px;

  @media (max-width: 576px) { 
    height: calc(${window.innerHeight}px - 45px);
    margin: 0px;
    border-top: 1px solid ${(props) => props.theme.border};
  };

  @media (min-width: 576px) {
    border: 1px solid ${(props) => props.theme.border};
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  position: relative;
  
  @media (max-width: 576px) {
    overflow-Y: scroll;
    ::-webkit-scrollbar { display: none }
  } 

  .comments-item-img-preview-wrap{
    border-top: none;
    border-bottom: 1px solid ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};
    border-left: 1px solid ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};
    border-right: 1px solid ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};
  }
`;

export const PrivateMessagesBackground = styled.div`
  height: 600px;
  margin: 0px 20px 0px 20px;
  transition: all 0.5s;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background-image: url(${(props) => props.theme.pageBackground});
  padding: 15px;
  border: 1px solid ${(props) => props.theme.border};
  position: relative;

  @media (max-width: 576px) { 
    height: calc(${window.innerHeight}px - 45px);
    margin: 0px;
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0px;
  }

  .chat-settings-wrap:hover{
    background: ${(props) => props.theme.theme === 'light' ? 'gainsboro' : 'rgb(0, 0, 0, 0.2)'};
}

  .private-messages-black-image{
    position: absolute;
    width: 100%;
    height: 100%;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(0, 0, 0, 0.2)'};
  }

  .uploadImgFileForm{
    background-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'gray'};
  }

  .uploadImgFileInput{
    background-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(185,185,185)'};
  }

  .user-header{
    background-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(0, 82, 82, 0.8)'};
  }

  .file:hover{
    background-color: ${(props) => props.theme.theme === 'light' ? 'rgba(0, 0, 0, 0.151)' : 'rgb(25, 0, 0, 0.7)'};
  }

  .photo:hover{
    background-color: ${(props) => props.theme.theme === 'light' ? 'rgba(0, 0, 0, 0.151)' : 'rgb(25, 0, 0, 0.7)'};
  }

  .create-message{
    background-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(0, 12, 12, 0.6)'};
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};
  }
  .create-message:disabled{
    background-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(0, 12, 12, 0.6)'};
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};
  }
  .voice-svg-wrap{
    background-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(0, 12, 12, 0.6)'};
  }
  .photoOrFile-upload{
    background-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(0, 12, 12, 0.9)'};
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};

    .photo, .file{
      fill: ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};
    }
  }
  .chat-settings{
    background-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(0, 12, 12, 0.9)'};
  }
  .user-header-offline{
    color: ${(props) => props.theme.theme === 'light' ? 'rgb(156, 0, 0, 0.5)' : 'rgb(156, 0, 0, 0.9)'};
  }
`

export const ProfileBackground = styled.div`
  height: 600px;
  margin: 0px 20px 0px 20px;
  @media (max-width: 576px) { 
    height: calc(${window.innerHeight}px - 45px);
    margin: 0px;
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0px;
  }
  transition: all 0.5s;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background-image: url(${(props) => props.theme.pageBackground});
  padding: 20px;
  border: 1px solid ${(props) => props.theme.border};
  position: relative;
`

export const CommentsBackground = styled.div`
  height: 600px;
  margin: 0px 20px 0px 20px;
  @media (max-width: 576px) { 
    height: calc(${window.innerHeight}px - 45px);
    margin: 0px;
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0px;
  }
  transition: all 0.5s;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background-image: url(${(props) => props.theme.pageBackground});
  padding: 20px;
  border: 1px solid ${(props) => props.theme.border};
  position: relative;

  .comments-item-img-preview-wrap{
    border-top: none;
    border-bottom: 1px solid ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};;
    border-left: 1px solid ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};;
    border-right: 1px solid ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};;
  }

  .comments-item-close-svg{
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'rgba(125, 125, 124 , 1)'};
  }

  .comments-block-black{
    pointer-events: none;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(0, 0, 0, 0.2)'};
  }

  .no-profile{
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'rgba(125, 125, 124 , 1)'};
  }
`;

export const EmailVerifyBackground = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s;
  min-height: 600px;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background-image: url(${(props) => props.theme.pageBackground});
  padding: 20px;
  border: 1px solid ${(props) => props.theme.border};
  flex-basis: calc(33.333% - 40px);
  flex-grow: 1;
  flex-shrink: 0;
  margin: 0px 20px 20px 20px;
  position: relative;

  @media (max-width: 576px) { 
    height: calc(${window.innerHeight}px - 45px);
    margin: 0px;
    border-left: none;
    border-right: none;
    border-bottom: none;
    border-radius: 0px;
  }

  .SuccessVerificationEmail{
    text-align: center;
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'rgba(125, 125, 124 , 1)'};
    font-weight: bold;
  }
`;

export const SingleCom = styled.div`
  .single-private-comment-block{
    cursor: pointer;
    position: absolute;
    width: 100%;
    z-index: 999;
    height: 100%;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(0, 0, 0, 0.2)'};
  }
`

export const NavbarAvatar = styled.div`
  transition: all 0.5s;
  background-color: ${(props) => props.theme.avatarBackground};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
  font-size: 1.5rem;
  color: ${(props) => props.theme.avatarColorName};
  width: 28px;
  height: 28px;
`;

export const SettingsRightBlock = styled.div`
  display: flex;
  flex-direction: column;
  transition-property: color, background-color;
  transition-duration: 0.5s;
  padding: 10px;
  background-color: ${(props) => props.theme.theme === 'light' ? 'rgb(216, 216, 216)' : 'rgb(110, 110, 110)'};
  color: ${(props) => props.theme.SettingsText};
  flex-basis: 80%;
  min-height: 550px;
  
  @media (max-width: 576px) {
    overflow-Y: scroll;
    min-height: calc(${window.innerHeight}px - 45px);
  } 
  
  .accountAvatar{
    width: 150px;
    height: 150px;
    transition-property: color, background;
    transition-duration: 0.5s;
    background: ${(props) => props.theme.theme === 'light' ? 'rgb(115, 115, 115)' : 'rgb(165, 165, 165)'};
    color: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(119, 119, 119)'};
  }

  .delete-profile-block button{
    transition-property: border, color;
    transition-duration: 0.5s;
    border: 1px solid ${(props) => props.theme.theme === 'light' ? 'red' : 'black'};
    color: ${(props) => props.theme.theme === 'light' ? 'red' : 'black'};
  }

  .change-user-settings-two{
    transition: background 0.5s;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(141, 141, 141, 0.3)'};
  }

  .change-user-settings-button, .settings-delete-avatar, .settings-delete-avatar-loading{
    transition-property: background-color, color;
    transition-duration: 0.5s;
    background-color: ${(props) => props.theme.theme === 'light' ? 'rgb(200, 200, 200)' : 'rgb(56, 56, 56)'};
    color: ${(props) => props.theme.theme === 'light' ? '' : 'gray'};
    
    div{
      transition-property: color;
      transition-duration: 0.5s;
      color: ${(props) => props.theme.theme === 'light' ? '' : 'gray'};
    }
  }

  .settings-block-avatar-change { 
    color: rgb(0,0,0,0.7) 
  }

  .settings-block-black{
    pointer-events: none;
    transition: all 0.5s;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(0, 0, 0, 0.2)'};
  }

  .settings-block-avatar-black{
    transition: background 0.5s;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    z-index: 1;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(0, 0, 0, 0.2)'};
  }
`;

export const FormComments = styled.div`
  input{
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};
    border: 1px solid ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};
  }

  .comments-item-select-img-svg{
    fill: ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};
  }
`;

export const CommentsPage = styled.div`
  .single-comment-avatar{
    position: relative;
  }

  .single-comment-block-photo{
    position: absolute;
    z-index: 1;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(0, 0, 0, 0.2)'};
  }
  
  @media(max-width: 460px){
    .-photo{
      width: ${(props) => props.photoSize.width*1.2}px;
      height: ${(props) => props.photoSize.height*1.2}px;
    }
  }

  @media(min-width: 460px) and (max-width: 576px){
    .single-comment-block-photo{
      width: ${(props) => props.photoSize.width*2}px;
      height: ${(props) => props.photoSize.height*2}px;
    }
  }

  @media(min-width: 576px){
    .single-comment-block-photo{
      width: ${(props) => props.photoSize.width*2.4}px;
      height: ${(props) => props.photoSize.height*2.4}px;
    }
  }
  
  .single-comment-block{
    position: absolute;
    left: 0;
    top: 14px;
    right: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    z-index: 1;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(0, 0, 0, 0.2)'};
  }

  .single-comment{
    background-color: ${(props) => props.theme.theme === 'light' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(185, 185, 185, 0.7)'};
  }

  .single-comment-edit, .single-comment-delete{
    background-color: ${(props) => props.theme.theme === 'light' ? 'rgba(233, 233, 233, 0.648)' : 'rgb(171, 171, 171)'}
  }

  .single-comment-changed-status-true, .single-comment-time-create{
    color: ${(props) => props.theme.theme === 'light' ? 'rgba(73, 64, 64, 0.479)' : 'rgb(38, 38, 38)'};
  }

  .single-comment-block-black{
    cursor: pointer;
    position: absolute;
    width: 100%;
    z-index: 999;
    height: 100%;
    background: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(0, 0, 0, 0.2)'};
  }
`;

export const IconAvatar = styled.div`
  background: black
`;

export const UserName = styled.div`
  color: black;
  margin-top: 10px;
  font-size: 24px;
`

export const LightDrope = styled.div`
  display: ${(props) => props.theme.theme === 'light' ? 'none' : 'block'};
`

export const ProfileCase = styled.div`
  border: 1px solid ${(props) => props.theme.theme === 'light' ? 'gray' : 'rgb(32, 32, 55)'};
  background: ${(props) => props.theme.theme === 'light' ? 'rgb(210, 210, 210, 0.8)' : 'rgb(1,90,90, 0.7)'};
  padding: 5px;
  width: 260px;
  height: 150px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  position: relative;

  .profile-username{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -15%);
    top: 85px;
    font-size: 22px;
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'rgb(32, 32, 55)'};
  }

  .profile-avatar{
    border: 1px solid ${(props) => props.theme.theme === 'light' ? 'gray' : 'rgb(32, 32, 55)'};
    background: ${(props) => props.theme.theme === 'light' ? 'rgb(166, 166, 166)' : 'gray'};
    color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(32, 32, 45)'};
  }

  .online-status{
    font-style: italic;
    letter-spacing: 1px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -13px;
    right: 5px;
    font-size: 11px;
  }

  .profile-message-button{
    font-family: sans-serif;
    position: absolute;
    bottom: -15px;
    right: -10px;
    font-size: 15px;
    margin-top: 15px;
    background: ${(props) => props.theme.theme === 'light' ? 'rgb(222, 222, 222)' : 'rgb(0,90,90)'};
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'rgb(32, 32, 55)'};
    border: 1px solid ${(props) => props.theme.theme === 'light' ? 'gray' : 'rgb(32, 32, 55)'};
    border-radius: 5px;
    padding: 5px 20px;
    &:hover{
      transform: translate(0, -1px);
      background: ${(props) => props.theme.theme === 'light' ? 'rgb(217, 217, 217)' : 'rgb(0,95,95)'};
    }
    &:active{
      background: ${(props) => props.theme.theme === 'light' ? 'rgb(197, 197, 197)' : 'rgb(0,55,55)'};
    }
  }

  .offline-status{
    color: ${(props) => props.theme.theme === 'light' ? 'red' : 'rgb(156, 0, 0, 0.7)'};
  }
`

export const PageAuth = styled.div`
  .authpage-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0px 80px 0px;
    background-image: url(${(props) => props.theme.pageBackground});
    margin: 0px 20px 20px 20px;
    height: 600px;
    border-bottom-left-radius: 3px;
    border-bottom-right-radius: 3px;

    @media(min-width: 576px) {
      border: 1px solid ${(props) => props.theme.border};
    }

    @media (max-width: 576px) { 
      border-top: 1px solid ${(props) => props.theme.border};
      height: calc(${window.innerHeight}px - 45px);
      margin: 0px;
    } 
  }

  .authpage-papper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 20px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(117, 118, 120)'};

    .authpage-verifyMail-wrap{
      z-index: 777;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: absolute;
      width: 100%;
      height: 100%;
      background-color: ${(props) => props.theme.theme === 'light' ? 'rgb(24, 247, 98)' : 'rgb(24, 150, 28)'};
      font-size: 15px;
      padding: 5px 15px;
      border: 1px solid;
      animation: 1500ms myEffect;
    }

    @keyframes myEffect {
      0% {
        opacity: 0;
        transform: translateY(0%);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .switch-mode{
      margin-top: 9px;
    }

    .switch-mode:disabled{
      color:black
    }

    .authpage-google-button{
      box-shadow: none;
    }

    .authpage-button{
      border: none;
      font-family: ${(props) => props.theme.theme === 'light' ? 'sans-serif' : 'Georgia'};
      background-color: ${(props) => props.theme.theme === 'light' ? '#1976d2' : 'black'};
      color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(158, 154, 148)'};
      font-weight: ${(props) => props.theme.theme === 'light' ? '300' : 'bold'};
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      border-radius: 4px;
      font-size: 9px;
      text-transform: uppercase;
      padding: 8px 10px;
      width: 100%;
    }

    .authpage-btnBlock{
      margin: 7px 0px;
    }
    
    .authpage-google-button{
      font-family: ${(props) => props.theme.theme === 'light' ? '' : 'Georgia'};
      background-color: ${(props) => props.theme.theme === 'light' ? '#1976d2' : 'black'};
      color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(158, 154, 148)'};
      font-weight: ${(props) => props.theme.theme === 'light' ? '300' : 'bold'};
      margin-bottom: 8px;
    }
    
    .authpage-avatar{
      margin: 20px 0px 5px 0px;
      background-color: ${(props) => props.theme.theme === 'light' ? '' : 'rgb(61, 67, 71)'};
      color: ${(props) => props.theme.theme === 'light' ? '' : 'gray'};
    }
  }
`;
