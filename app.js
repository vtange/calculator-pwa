(function(){

var app = angular.module('calculator',[]);

app.factory('memory', [function(){
  var storage = {
      SndLastEntered:"",
      SndLastAns:"",
      lastEntered:"",
      lastAns:"",
  };
  return storage;
}]);//end of service

app.controller('MainCtrl', ['$scope', 'memory', function($scope, memory){
    $scope.storage = memory; // load service for practice. making my life more complicated for no reason :)
    $scope.entered = "";	 // init calculator
    var lastNum = /([()\w]+[-+/*^]?)(?!.*\d)/g;
	function replace(withThis){
			$scope.entered = $scope.entered.replace(lastNum,"");	//dropping the last number..
        	$scope.entered += withThis;								//and replace it 'withThis'. 'withThis' is defined in invoked fn.
	}

    $scope.enter = function(content){
        if ($scope.entered.length < 40){
            if($scope.storage.lastAns && !$scope.entered.length && typeof content !== "number") {
                $scope.entered += $scope.storage.lastAns;
                if(content==="PI"||content==="(") {
                    $scope.entered += "*";
                }
            }
        $scope.entered += content;									//add new entered info
        }
    };
    $scope.backspace = function(){
        $scope.entered =  $scope.entered.substring(0, $scope.entered.length - 1);		// replace current entered with what it is minus last letter
    };
    $scope.clear = function(){
        $scope.entered = "";										//clear entered info
    };
    $scope.copyAns = function(){
        if($scope.storage.lastAns) {
            $scope.entered += $scope.storage.lastAns.toString();
        }
    };
    $scope.copySndAns = function(){
        if($scope.storage.SndLastAns) {
            $scope.entered += $scope.storage.SndLastAns.toString();
        }
    };
    $scope.prefix = function(content){								//for appending negative sign
        var replacement = "(" + content + $scope.entered.match(lastNum) + ")";
        if ($scope.entered == ""){
            $scope.enter(content);									//if empty, just add "-"
        }
        else{														//else get the last number and wrap it with (-x)
			replace(replacement);
        }
    };
    $scope.wrapper = function(content){												//for appending sin(), cos(), tan()
        $scope.entered = content + "(" + $scope.entered.match(lastNum) + ")";
    };
    $scope.cycleSinCosTan = function(){
        if ($scope.entered === "sin") {
            $scope.entered = "cos";
        } else if ($scope.entered === "cos") {
            $scope.entered = "tan";
        } else {
            $scope.entered = "sin";
        }
    }
    $scope.cycleLogLn = function(){
        if ($scope.entered === "log") {
            $scope.entered = "E";
        } else {
            $scope.entered = "log";
        }
    }
    $scope.evaluate = function(){
        $scope.answer = Parser.evaluate($scope.entered);

        $scope.storage.SndLastAns = $scope.storage.lastAns;				//push up the last entry
        $scope.storage.SndLastEntered = $scope.storage.lastEntered;

        $scope.storage.lastAns = $scope.answer;		//push up current entry, show answer
        $scope.storage.lastEntered = $scope.entered;
        $scope.entered = "";											//clear entry for new entry
    };

}]);//end of controller


})();