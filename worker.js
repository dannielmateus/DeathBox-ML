// Worker

console.log("worker started")

death_counter = 0

function switchVar(x, a, b){
    if (x === a){
        return b
    }
    if (x === b){
        return a
    }
}

function model(difficulty, initial_health, punishment, reward){
    function choices(quantity){
        choices = []
        for (var i = 0; i < quantity; i++){
            n = Math.random() 
            if (n > 0.5){
                choices.push("A")
            } 
            if (n <= 0.5){
                choices.push("B")
            }
        }
        return choices
    }
    
    function iterateChoices(choices, reward, punishment){
        for (var i = 0; i < choices.length; i++){
            console.log(i, ". HEALTH: ", health)
            postMessage({ from: "training_iteration", A: i, H: health, complete: false })
            if (choices[i] == "A"){
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
            if (choices[i] == "B"){
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
            if (health <= 0){
                death_counter += 1
                postMessage({ from: "training_iteration", A: i+1, H: health, complete: true })
                console.log("DEATH COUNTER: ", death_counter)
                return [i, choices]
            }
        }
        return [-1, choices]
    }
    
    c = []
    boxA = []
    function fit(difficulty, reward, punishment){
        boxA = []
        for (var i = 0; i < difficulty; i++){
            n = Math.random()
            if (n <= 0.5){
                boxA.push(0)
            }
            if (n > 0.5) {
                boxA.push(1)
            }
        }
        if (boxA.indexOf(0) === -1){
            boxA.push(0)
        }
        if (boxA.indexOf(1) === -1){
            boxA.push(1)
        }
        c = choices(boxA.length)
        epoch = 0
        while (true){
            epoch += 1
            postMessage({ from: "training_epoch", deaths: death_counter, epoch: epoch, complete: false })
            health = initial_health
            iteration = iterateChoices(c, reward, punishment)
            if (iteration[0] === -1){
                postMessage({ from: "training_epoch", deaths: death_counter, epoch: epoch, complete: true })
                death_counter = 0
                return c
            }
            c[iteration[0]] = switchVar(c[iteration[0]], "A", "B")
            console.log("A", c)
        }
    }
    return fit(difficulty, reward, punishment)
}

const INTERVAL = 500
i = -1

difficulty = 10
initial_health = 1
punishment = -1
reward = 1


onmessage = (e) => {
	var message = e.data;

    if (message.from == "constants"){
        difficulty = message.difficulty
        punishment = message.punishment
        reward = message.reward
    }

	if (message == "start-training") {
		startTrain();
	}
}

function startTrain(){
    set = model(difficulty, initial_health, punishment, reward)    
    var results = {
        set: set,
        initial_health: initial_health,
        difficulty: difficulty,
        boxA: boxA,
        punishment: punishment,
        reward: reward, 
        initial_health: initial_health,
        INTERVAL: INTERVAL
    }
    postMessage({ from: "model", results: results})
}

function showPattern(){
    pat = []
    for (var i = 0; i < boxA.length; i++){
        if (boxA[i] === 1){
            pat.push("A")
        }
        if (boxA[i] === 0){
            pat.push("B")
        }
    }
    return pat
}
