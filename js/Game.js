class Game{
    constructor(){

    }
    getState() {
        var gameStateRef = database.ref('gameState');
        gameStateRef.on("value", function (data) {
            gameState = data.val();
        })

    }

    update(state) {
        database.ref('/').update({
            gameState: state
        });
    }
    async start() {
        if (gameState === 0) {
            player = new Player();
            var playerCountRef = await database.ref('playerCount').once("value");
            if (playerCountRef.exists()) {
                playerCount = playerCountRef.val();
                player.getCount();
            }
            form = new Form()
            form.display();
        }
        player1 = createSprite(200,500);
        player1.addImage("player1",player_img);
        
        player2 = createSprite(800,500);
        player2.addImage("player2", player_img);
        players=[player1,player2];

        wall1 = createSprite(0, 300, 10, 600);
        wall1.shapeColor = "darkred";
        wall2 = createSprite(500, 600, 1000, 10);
        wall2.shapeColor = "darkred";
        wall3 = createSprite(1000, 300, 10, 600);
        wall3.shapeColor = "darkred";
        wall4 = createSprite(500, 0, 1000, 10);
        wall4.shapeColor = "darkred";
        walls = [wall1, wall2, wall3, wall4];
    }
    
    play(){
        
        form.hide();

        Player.getPlayerInfo();

        //player1.collide(edges);
        //player2.collide(edges);

        image(back_img, 0, 0, 1000, 800);
        var x =100;
        var y=200;
        var index =0;
        drawSprites();

        player1.collide(wall1);
        player1.collide(wall3);
        player2.collide(wall2);
        player2.collide(wall3);

        for(var plr in allPlayers){
        
            index = index+1;
            x = 500-allPlayers[plr].distance;
            y=500;
            
            players[index -1].x = x;
            players[index -1].y = y;

            if(index === player.index){   
                fill("black");
                textSize(25);
                text(allPlayers[plr].name ,x-25,y+25); 
            }
           
            // Add code to diplay the scores of both 
            // the players on the screen



        }

        if (keyIsDown(RIGHT_ARROW) && player.index !== null) {
            player.distance -= 10
            player.update();
        }
        if (keyIsDown(LEFT_ARROW) && player.index !== null) {
            player.distance += 10
            player.update();
        }
    
        if (frameCount % 20 === 0) {
            fruits = createSprite(random(100, 1000), 0, 100, 100);
            fruits.velocityY = 6;
            var rand = Math.round(random(1,5));
            switch(rand){
                case 1: fruits.addImage("fruit1",fruit1_img);
                break;
                case 2: fruits.addImage("fruit1", fruit2_img);
                break;
                case 3: fruits.addImage("fruit1", fruit3_img);
                break;
                case 4: fruits.addImage("fruit1", fruit4_img);
                break;
                case 5: fruits.addImage("fruit1", fruit5_img);
                break;
            }
            fruitGroup.add(fruits);
            
        }

        // Add code to destroy fruits, calculate scores and
        // update the scores to the database
        if (player.index !== null) {
            for (var i = 0; i < fruitGroup.length; i++){
                if(fruitGroup.get(i).isTouching(players)){
                    fruitGroup.get(i).destroy();
                    player.score += 1;
                    player.update();
                }
            }
            /*if(player.index === 1){
                textSize(25);
                fill("white");
                text("Your score: " + player1.score, 50, 50);
            }
            if(player.index === 2){
                textSize(25);
                fill("white");
                text("Your score: " + player2.score, 50, 50);
            }*/
        }

        // Add code for game end condition
        if(player.score >= 50) {
            this.end();
        }

    }

    end(){
      // Add code to update game state and display Game Over
        game.update(2);
        clear();
        background("orange")
        textSize(40);
        fill("blue");
        text("Game Over", 400,200);
        textSize(25);
        text("Good job teaming up to collect 50 fruits.", 290, 300);
        text("Pls clk reset to play game again, thanks.", 290, 400);
    }
}
