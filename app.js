    var lastNum = /([()\w]+[-+/*^]?)(?!.*\d)/g;
	function replace(withThis){
			entered.textContent = entered.textContent.replace(lastNum,"");	//dropping the last number..
            entered.textContent += withThis;								//and replace it 'withThis'. 'withThis' is defined in invoked fn.
	}

    function enter (content){
        if (entered.textContent.length < 40){
            if(lastAns.textContent && !entered.textContent.length && typeof content !== "number") {
                entered.textContent += lastAns.textContent;
                if(content==="PI"||content==="(") {
                    entered.textContent += "*";
                }
            }
        entered.textContent += content;									//add new entered.textContent info
        }
    };
    function backspace(){
        entered.textContent = entered.textContent.substring(0, entered.textContent.length - 1);		// replace current entered.textContent with what it is minus last letter
    };
    function clearAll(){
        entered.textContent = "";										//clear entered.textContent info
    };
    function copyAns(){
        if(storage.lastAns) {
            entered.textContent += storage.lastAns.toString();
        }
    };
    function copySndAns(){
        if(storage.SndLastAns) {
            entered.textContent += storage.SndLastAns.toString();
        }
    };
    function pref(content){								//for appending negative sign
        var replacement = "(" + content + entered.textContent.match(lastNum) + ")";
        if (entered.textContent == ""){
            enter(content);									//if empty, just add "-"
        }
        else{														//else get the last number and wrap it with (-x)
			replace(replacement);
        }
    };
    function wrapper(content){												//for appending sin(), cos(), tan()
        entered.textContent = content + "(" + entered.textContent.match(lastNum) + ")";
    };
    function cycleSinCosTan(){
        if (entered.textContent === "sin") {
            entered.textContent = "cos";
        } else if (entered.textContent === "cos") {
            entered.textContent = "tan";
        } else {
            entered.textContent = "sin";
        }
    }
    function cycleLogLn(){
        if (entered.textContent === "log") {
            entered.textContent = "E";
        } else {
            entered.textContent = "log";
        }
    }
    function calculate(){
        var answer = Parser.evaluate(entered.textContent);

        SndLastAns.textContent = lastAns.textContent;				//push up the last entry
        SndLastEntered.textContent = lastEntered.textContent;
        SndLastEntered.nextElementSibling.setAttribute("data-txt",lastAns.textContent);

        lastAns.textContent = answer;		//push up current entry, show answer
        lastEntered.textContent = entered.textContent;
        lastEntered.nextElementSibling.setAttribute("data-txt",answer);
        entered.textContent = "";											//clear entry for new entry
    };
