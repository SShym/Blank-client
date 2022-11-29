import styled from "styled-components";

export const SwitchButton = styled.label`
  position: relative;
  display: inline-block;
  width: 24px;
  height: 32px;
  bottom: 6px;
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
    height: 24px;
    width: 24px;
    left: -1px;
    top: -6px;
    background-color: ${(props) => props.theme.button};
    background-image: url(${(props) => props.theme.img});
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
  .pick{
    transition-property: color, border-left;
    transition-duration: 0.5s;
    color: ${(props) => props.theme.theme === 'light' ? 'white' : 'gray'};
    border-left: 1px solid ${(props) => props.theme.theme === 'light' ? 'white' : 'gray'};
  }

`;

export const NavbarBlock = styled.div`
  transition: all 0.5s;
  background-color: ${(props) => props.theme.backgroundNavbar};
  border-top: 1px solid ${(props) => props.theme.border};
  border-left: 1px solid ${(props) => props.theme.border};
  border-right: 1px solid ${(props) => props.theme.border};
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  padding: 4px 4px;
  margin: 0px 20px 0px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .navbar-link button{
    border: 1px solid ${(props) => props.theme.border};
    color: ${(props) => props.theme.border};
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
  min-height: 550px;
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

  .comments-item-img-preview-wrap{
    border-top: none;
    border-bottom: 1px solid ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};;
    border-left: 1px solid ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};;
    border-right: 1px solid ${(props) => props.theme.theme === 'light' ? 'black' : 'gray'};;
  }
`;

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
  transition-property: color, background-color;
  transition-duration: 0.5s;
  padding: 10px;
  background-color: ${(props) => props.theme.SettingsRightBlock};
  color: ${(props) => props.theme.SettingsText};
  flex-basis: 80%;
  width: 100%;
  height: 100%;

  .delete-profile-block button{
    transition-property: border, color;
    transition-duration: 0.5s;
    border: 1px solid ${(props) => props.theme.theme === 'light' ? 'red' : 'black'};
    color: ${(props) => props.theme.theme === 'light' ? 'red' : 'black'};
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
  .single-comment-without-profileImg{
    background-color: ${(props) => props.theme.theme === 'light' ? 'rgb(238, 238, 238)' : 'gray'};
    color: ${(props) => props.theme.theme === 'light' ? 'black' : 'black'};
    border: 1px solid black;
  }

  .single-comment{
    background-color: ${(props) => props.theme.theme === 'light' ? 'rgba(255, 255, 255, 0.836)' : 'gray'};
  }

  .single-comment-edit, .single-comment-delete{
    background-color: ${(props) => props.theme.theme === 'light' ? 'rgba(233, 233, 233, 0.648)' : 'rgb(171, 171, 171)'}
  }

  .single-comment-changed-status-true, .single-comment-time-create{
    color: ${(props) => props.theme.theme === 'light' ? 'rgba(73, 64, 64, 0.479)' : 'rgb(38, 38, 38)'
  }
`;

export const PageAuth = styled.div`
  .authpage-wrap {
    padding: 80px 0px 80px 0px;
    background-image: url(${(props) => props.theme.pageBackground});
    margin:0px 20px 20px 20px;
    border: 1px solid ${(props) => props.theme.border};
    borderBottomRightRadius: 3px;
    borderBottomLeftRadius: 3px;
  }
  .authpage-papper {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px 20px;
    border-radius: 5px;
    background-color: ${(props) => props.theme.theme === 'light' ? 'white' : 'rgb(117, 118, 120)'};
  
    .authpage-btnBlock button{
      font-family: 'Georgia';
      background-color: black;
      color: rgb(158, 154, 148);
      font-weight: bold;
    }
    
    .authpage-google-button{
      font-family: 'Georgia';
      background-color: black;
      color: rgb(158, 154, 148);
      margin-bottom: 10px;
      font-weight: bold;
    }
    
    .authpage-avatar{
      margin: 20px 0px 5px 0px;
      background-color: rgb(61, 67, 71);
      color: gray;
    }
  }
`;






