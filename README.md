# DeathBox-ML
Machine learning game 

What is the death box?

This game consists of two boxes that can either give you a reward or a prize. In this case, the prize is gaining health points, and the reward is losing them. If you lose all your health points, you have to start from the beginning, with the same pattern. Wheter a box will give you a punishment or a reward is decided by the random pattern generated every time you start the game. For example, if you chose box A when the you should choose box B, you will lose x health points. You need to survive until the final stage. But of course, this is a machine learning code, so the machine will do everything. It will learn from its mistakes, and generate a pattern that gets it alive through all the stages. It starts with 1 health point, so a punishment greater or equal than 1 will already cause a death. You can choose the number of stages, as well as the reward and punishment. After that, you can click on the "Train model" button to make the machine learn the pattern (not necessarily the perfect pattern, but one that gets it alive), and then "Run the model" to see its choices and health changes in action.

To run it, you first need to get node modules by running **npm i** on Node.js at the source's root folder. Then you just need to execute **node index.js** and go to **localhost:5002** in your browser.

![image](https://user-images.githubusercontent.com/106636721/184276974-e6793fd1-501d-4d84-9550-8e0968a18311.png)
