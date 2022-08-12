const myWorker = new Worker('worker.js')

modelInfo = []
myWorker.onmessage = (e) => {
	var message = e.data
	console.log(message)
	
	switch(message.from) {
		case "training_iteration":
			if (message.complete) {
				document.getElementById("iteration").innerHTML = "Training done!"
			} else {
				document.getElementById("iteration").innerHTML = "Health: " + message.H + "<br>Attempt: " + (message.A + 1)
			}
			break

		case "training_epoch":
			if (message.complete) {
				document.getElementById("epoch").innerHTML = "Training done in: " + message.epoch + " epochs (deaths)"
                document.getElementById("startbtn").style.display = "inline"
			} else {
				document.getElementById("epoch").innerHTML = "Epoch: " + message.epoch
			}
			break
		
		case "model":
            modelInfo = message.results
            document.getElementById("pattern").innerHTML = "Random pattern: " + String(showPattern())
			break
	}
}

function trainMessage(){
    difficulty = Number(document.getElementById("stages").value)
    punishment = (-1) * Number(document.getElementById("punishment").value)
    reward = Number(document.getElementById("reward").value)
    constMessage = { from: "constants", difficulty: difficulty, punishment: punishment, reward: reward}
    myWorker.postMessage(constMessage)
	myWorker.postMessage('start-training')
}

function showPattern(){
    pat = []
    for (var i = 0; i < modelInfo.boxA.length; i++){
        if (modelInfo.boxA[i] === 1){
            pat.push("A")
        }
        if (modelInfo.boxA[i] === 0){
            pat.push("B")
        }
    }
    return pat
}

i = 0
health = 1
function showChoices(){
    document.getElementById("startbtn").style.display = "none"
	var set = modelInfo.set
	var difficulty = modelInfo.difficulty
	var boxA = modelInfo.boxA
	var punishment = modelInfo.punishment
	var reward = modelInfo.reward
	var INTERVAL = modelInfo.INTERVAL

    if (set[i] == "A"){
        let dif = () => {
            if (boxA[i] == 1){
                return reward
            }
            if (boxA[i] == 0){
                return punishment
            }
        }
        health += dif()
    }
    if (set[i] == "B"){
        let dif = () => {
            if (boxA[i] == 1){
                return punishment
            }
            if (boxA[i] == 0){
                return reward
            }
        }
        health += dif()
    }
    document.getElementById("currenthealth").innerHTML = "Health: " + String(health)
    document.getElementById("stage").innerHTML = "Current stage: " + String(i + 1) + "/" + String(difficulty)
    function changeBoxColor(choice){
        if (choice === "A"){
            document.getElementById("boxA").style.borderColor = "green"
            document.getElementById("boxB").style.borderColor = "black"
        }
        if (choice === "B"){
            document.getElementById("boxB").style.borderColor = "green"
            document.getElementById("boxA").style.borderColor = "black"
        }
    }

    i++

    if (set[i] == "A"){
        changeBoxColor("A")
    }
    if (set[i] == "B"){
        changeBoxColor("B")
    }
    if (boxA[i] === 0 && set[i+1] === "A"){
        document.getElementById("rightchoice").innerHTML = "Right choice: B"
    }
    if (boxA[i] === 1 && set[i+1] === "A"){
        document.getElementById("rightchoice").innerHTML = "Right choice: A"
    }
    if (i < set.length){
        document.getElementById("modelpattern").innerHTML += String(set[i]) + ","
    }
    if (i < set.length){
        setTimeout(showChoices, INTERVAL)
    }
    else {
        document.getElementById("done").innerHTML = "Done!"
        document.getElementById("reset").style.display = "inline"
    }

}

