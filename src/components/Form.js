import React from "react";

function Form({pinInput, setPinInput, frameScores, setFrameScores, frameCounter, setFrameCounter, framesWithBonus, setFramesWithBonus, validInput, setValidInput}) {
    
    const pinInputHandler = (e) => {
        if(isValidInput(e.target.value)) {
            setPinInput(e.target.value);
        }
    };

    const isValidInput = function(input) {
        if(frameCounter.gameOver) {
            setValidInput({isValid: false, message: "Game is over."});
        }else if((Number(input) > 10 || Number(input) < 0) || !input.trim()){
            setValidInput({isValid: false, message: "Please enter a number betweeen 0 and 10."});
        } else if(frameCounter.frame !== 10 && (frameCounter.shot === 2 && (Number(frameScores[frameCounter.frame - 1].shot1) + Number(input) > 10))) {
            setValidInput({isValid: false, message: "Total pins hit in the frame cannot exceed 10."});
        } else if( (frameCounter.frame === 10 && frameScores[frameCounter.frame - 1].type !== "strike" && (frameCounter.shot === 2 && (Number(frameScores[frameCounter.frame - 1].shot1) + Number(input) > 10)))
                || (frameCounter.frame === 10 && (frameScores[frameCounter.frame - 1].type === "strike") && (frameCounter.shot === 3) && (frameScores[frameCounter.frame - 1].shot2 !== 10) && ((Number(frameScores[frameCounter.frame - 1].shot2) + Number(input) > 10))) ) {
            //If we are in the 10th frame, an "open frame" can be defined by either shot 1 & 2 or by shot 2 & 3 -> make sure these totals don't exceed 10
            setValidInput({isValid: false, message: "Total pins hit in the first two shots of an open frame cannot exceed 10."});
        } else {
            setValidInput({isValid: true, message: ""});
        }
        return validInput;
    };

    const frameScoresHandler = (e) => {
        e.preventDefault();

        if(pinInput !== "") {
            let currentFrame = frameScores[Number(frameCounter.frame)-1];
            //First Shot
            if(frameCounter.shot === 1) {
                handleFirstShot(currentFrame);
            //Second Shot    
            } else if(frameCounter.shot === 2) {
                handleSecondShot(currentFrame);
            //Third Shot
            } else if(frameCounter.shot === 3) {
                handleThirdShot(currentFrame);
            }

            //Update frames that have bonus shots (bonus shots of previous frames need to be counted before we can update the current frame's current total)
            if(framesWithBonus.length > 0) {
                calculateBonusShots();
            }

            //Update total score for current frame
            currentFrame.totalScore = calculateTotalFrameScore(currentFrame);

            setFrameScores([
                ...frameScores
            ]);

            //Clear input text
            setPinInput("");
        }
    };

    const handleFirstShot = function(currentFrame) {
        currentFrame.shot1 = Number(pinInput);
        //If strike
        if(Number(pinInput) === 10) {
            //Set type to strike
            currentFrame.type = "strike";
            currentFrame.shot2 = frameCounter.frame !== 10 ? 0 : null;
            //Set number of bonus shots, add to bonus tracker -> if we're in the last frame, don't add to bonus tracker since we don't need to look a frame ahead for its bonus shots
            if(frameCounter.frame !== 10) {
                currentFrame.bonusCount = 2;
                framesWithBonus.push(currentFrame);
                setFramesWithBonus([...framesWithBonus]);
            }
            //Move onto next frame -> if we're on the last frame, move onto next shot instead (shot 3)
            frameCounter.shot += frameCounter.frame !== 10 ? 0 : 1;
            frameCounter.frame += frameCounter.frame !== 10 ? 1 : 0;
            setFrameCounter(frameCounter);
        //If not strike
        } else {
            //...Move onto next shot to find out if spare or open frame
            setFrameCounter({frame: Number(frameCounter.frame), shot: 2});
        }
    };

    const handleSecondShot = function(currentFrame) {
        currentFrame.shot2 = Number(pinInput);
        // If shot 1 + shot 2 = 10, then set type to spare (unless we've already determined its a strike)
        if(currentFrame.type !== "strike") {
            currentFrame.type = currentFrame.shot1 + currentFrame.shot2 === 10 ? "spare" : "";
        }
        // If we're in the last frame and no strike or spare, it's an open frame & shot 3 is automatically 0 
        if(frameCounter.frame === 10 && currentFrame.type === "") {
            currentFrame.shot3 = 0;
        }
        //Set number of bonus shots, add to bonus tracker -> if we're in the last frame, don't add to bonus tracker since we don't need to look a frame ahead for its bonus shots
        if(frameCounter.frame !== 10) {
            if(currentFrame.type === "spare") {
                currentFrame.bonusCount = 1;
                framesWithBonus.push(currentFrame);
                setFramesWithBonus([...framesWithBonus]);
            }
        }
        // Move onto next frame/shot -> if we're in the last frame move ahead to shot 3 -> if we're in last frame and it's an open frame then game is over (no shot 3 / bonus shot)
        if(frameCounter.frame !== 10) {
            setFrameCounter({frame: Number(frameCounter.frame) + 1, shot: 1});
        } else if(frameCounter.frame === 10 && (currentFrame.type === "spare" || currentFrame.type === "strike")) {
            frameCounter.shot += 1;
            setFrameCounter(frameCounter);
        } else if(frameCounter.frame === 10 && currentFrame.type === "") {
            frameCounter.gameOver = true;
            setFrameCounter(frameCounter);
        }
    };

    const handleThirdShot = function(currentFrame) {
        //We are in the 10th frame
        currentFrame.shot3 = Number(pinInput);
        //3rd shot only possible in last frame therefore game is over
        frameCounter.gameOver = true;
        setFrameCounter(frameCounter);
    };

    // Caclulates running total frame score (not including bonus shots)
    const calculateTotalFrameScore = function (currentFrame) {
        let total = 0;
        //Add previous frame's total score
        let prevFrame = frameScores[currentFrame.id-1];
        if(prevFrame) {
            total += Number(prevFrame.totalScore);
        }
        //Add current frame's shot values
        if(currentFrame.shot1) {
            total += currentFrame.shot1;
        }
        if(currentFrame.shot2) {
            total += currentFrame.shot2;
        }
        if(currentFrame.shot3) {
            total += currentFrame.shot3;
        }
        return total;                                                                     
    };

    //Calculates total for frames bonus shots
    const calculateBonusShots = function() {
        for(let i = 0; i < framesWithBonus.length; i++) {
            let bonusShotAdded = 0; //Keeps track of how many bonus shots have been added for the frame -> if bonus shot value is not known yet, it will not be counted here
            let bonusTotal = 0;
            let currentFrame = framesWithBonus[i];
            let nextFrame = frameScores[currentFrame.id + 1];
            let nextNextFrame = frameScores[currentFrame.id + 2];

            if(nextFrame && nextFrame.shot1) {
                // If current frame is a strike, we get two bonus shots
                if(currentFrame.type === "strike") {
                    // If first bonus shot is a strike
                    if(nextFrame.type === "strike") {
                        // Bonus shot 1 -> Add 10 pts for the strike
                        bonusTotal += 10;
                        bonusShotAdded++;
                        // Bonus shot 2 -> We now need to check current->next->next frame for bonus shot 2
                        if(nextNextFrame !== undefined) {
                            bonusTotal += nextNextFrame.shot1 ? nextNextFrame.shot1 : 0;
                            if(nextNextFrame.shot1) { bonusShotAdded++; };
                        } else {
                            // Bonus shot 2 -> If current->next-next frame is undefined, it's because we are at frame 9 & 2nd bonus will simply be frame 10's 2nd shot
                            bonusTotal += nextFrame.shot2 ? nextFrame.shot2 : 0;
                            if(nextFrame.shot2) { bonusShotAdded++; };
                        }
                    // If first bonus shot is not a strike, we simply add shot 1 & 2 of the current->next frame
                    } else {
                        bonusTotal += nextFrame.shot1 ? nextFrame.shot1 : 0;
                        if(nextFrame.shot1) { bonusShotAdded++; };

                        bonusTotal += nextFrame.shot2 ? nextFrame.shot2 : 0;
                        if(nextFrame.shot2) { bonusShotAdded++; };
                    }
                // If current shot is a spare, we get 1 bonus shot, which will always be the first shot of current->next
                } else if(currentFrame.type === "spare") {
                    bonusTotal += nextFrame.shot1;
                    bonusShotAdded++;
                }
            }
            // Update the current frame's total score with bonus points
            currentFrame.totalScore = calculateTotalFrameScore(currentFrame) + bonusTotal;

            //Check if we have counted all the frame's bonus shots. If so, kick it out from the bonus tracker & it's totalScore is now permanent
            if(currentFrame.bonusCount === bonusShotAdded) {
                setFramesWithBonus(framesWithBonus.filter((el) => el.id !== currentFrame.id));
            };
        }
    };

    return(
        <form>
            <label className="inputLabel">Enter Pins Hit:</label>
            <div>
                <input onChange={pinInputHandler} value={pinInput} min='0' max='10' type="number" className="add-score-input"/>
                <button onClick={frameScoresHandler} className="add-score-button" type="submit" disabled={!validInput.isValid}>
                    <i className="fas fa-plus-square"></i>
                </button>
            </div>
            <label className="errorMessage">{validInput.message}</label>
        </form>
    );
}

export default Form;