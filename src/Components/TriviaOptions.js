import { React } from 'react';

function TriviaOptions(props) {


    return (
      <div className="AnswerBtnContainer">
        <button className="AnswerBtn" value={props.name} onClick={props.onPress}><img src={"./images/profile_"+props.name+".png"} alt={props.name}></img></button>
      </div>
    )
}

export default TriviaOptions;