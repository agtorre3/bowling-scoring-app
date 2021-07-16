import React from 'react';

function Frames({frameScores, frameCounter}) {

    // Format the score data to display "X" and "/" for strikes and spares, "-" for skipped shots
    const scoreData = function(frameScore, shot) {
        if(shot === 1) {
            if(frameScore.shot1 === null) {
                return "";
            } else {
                return frameScore.type === "strike" ? "X" : frameScore.shot1;
            }
        } 

        if(shot === 2) {
            if(frameScore.shot2 === null) {
                return "";
            } else if(frameScore.type === "spare") {
                return "/";
            } else if (frameScore.type === "strike" && frameScore.id !== 9){
                return "-"
            } else if (frameScore.id === 9 && frameScore.shot2 === 10) {
                return "X";
            } else {
                return frameScore.shot2;
            }
        }

        if(shot === 3) {
            if(frameScore.shot3 === null) {
                return "";
            } else if(frameScore.type === "") {
                return "-";
            } else if(frameScore.shot3 === 10) {
                return "X";
            } else {
                return frameScore.shot3;
            }
        }
    };

    const highlightCell = function(frameScore, shot) {
        if((frameScore.id === (frameCounter.frame - 1)) && (frameCounter.shot === shot) && !frameCounter.gameOver) {
            return "highlight";
        }
    };

    const frameShotsCells = frameScores.map(frameScore => {
        if(frameScore.id === 9) {
            return [
                <td colSpan="4" id={frameScore.id + "-" + 1} className={highlightCell(frameScore, 1)}>{scoreData(frameScore, 1)}</td>,
                <td colSpan="4" id={frameScore.id + "-" + 2} className={highlightCell(frameScore, 2)}>{scoreData(frameScore, 2)}</td>,
                <td colSpan="4" id={frameScore.id + "-" + 3} className={highlightCell(frameScore, 3)}>{scoreData(frameScore, 3)}</td>
            ]
        } 

        return [
            <td colSpan="4" id={frameScore.id + "-" + 1} className={highlightCell(frameScore, 1)}>{scoreData(frameScore, 1)}</td>,
            <td colSpan="4" id={frameScore.id + "-" + 2} className={highlightCell(frameScore, 2)}>{scoreData(frameScore, 2)}</td>
        ]
    });
    
    const frameScoresCells = frameScores.map((frameScore) => (
        <td colSpan={frameScore.id === 9 ? 12 : 8} id={frameScore.id}>{frameScore.totalScore}</td>
    ));
    

    return(
        <div className="framesSection" id="framesDiv">
            <table id="scorecardTable" className="framesTable" cellSpacing="0">
                <thead>
                    <tr className="frameHeaders" id="headers">
                        <th id="1" colSpan="8">FRAME 1</th>
                        <th id="2" colSpan="8">FRAME 2</th>
                        <th id="3" colSpan="8">FRAME 3</th>
                        <th id="4" colSpan="8">FRAME 4</th>
                        <th id="5" colSpan="8">FRAME 5</th>
                        <th id="6" colSpan="8">FRAME 6</th>
                        <th id="7" colSpan="8">FRAME 7</th>
                        <th id="8" colSpan="8">FRAME 8</th>
                        <th id="9" colSpan="8">FRAME 9</th>
                        <th id="10" colSpan="12">FRAME 10</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="frameShots" id="shots">
                        {frameShotsCells} 
                    </tr>
                    <tr className="frameScores" id="scores">
                        {frameScoresCells}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Frames;