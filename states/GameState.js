let GameState = {
  
  create: function() {      
      this.background = this.game.add.sprite(0, 0, 'backyard');
      this.background.inputEnabled = true;
      this.background.events.onInputDown.add(this.placeItem, this);
  
      this.pet = this.game.add.sprite(100, 400, 'pet');
      this.pet.anchor.setTo(0.5);
  
      //custom properties
      this.pet.customParams = {health: 100, fun: 100};
  
      //draggable pet
      this.pet.inputEnabled = true;
      this.pet.input.enableDrag();
      this.pet.animations.add('funnyfaces', [1,2,3,2,1], 7, false);
  
      this.apple = this.game.add.sprite(72, 570, 'apple');
      this.apple.anchor.setTo(0.5);
      this.apple.inputEnabled = true;
      this.apple.customParams = {health: 20};
      this.apple.events.onInputDown.add(this.pickItem, this);
  
      this.candy = this.game.add.sprite(144, 570, 'candy');
      this.candy.anchor.setTo(0.5);
      this.candy.inputEnabled = true;
      this.candy.customParams = {health: -10, fun: 10};
      this.candy.events.onInputDown.add(this.pickItem, this);
  
      this.toy = this.game.add.sprite(216, 570, 'toy');
      this.toy.anchor.setTo(0.5);
      this.toy.inputEnabled = true;
      this.toy.customParams = {fun: 20};
      this.toy.events.onInputDown.add(this.pickItem, this);
  
      this.rotate = this.game.add.sprite(288, 570, 'rotate');
      this.rotate.anchor.setTo(0.5);
      this.rotate.inputEnabled = true;
      this.rotate.events.onInputDown.add(this.rotatePet, this);
  
      this.buttons = [this.apple, this.candy, this.toy, this.rotate];
  
      //nothing is selected
      this.selectedItem = null;
  
      //the user interface (UI) is not blocked at the start
      this.uiBlocked = false;
  
      let style = {
        font: '20px Arial',
        fill:'#ffe'
      };
  
      this.game.add.text(10,20, 'Health: ', style);
      this.game.add.text(140,20, 'Fun: ', style);
      this.healthText = this.game.add.text(80,20,'', style);
      this.funText = this.game.add.text(185,20,'', style);
  
      this.refreshStats();
      //decrease the health every 5 sec
      this.startDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND * 5, 
        this.reduceProperties, this);
  
    },
    pickItem: function(sprite, event) {
      
      //if the UI is blocked we can't pick an item
      if(!this.uiBlocked) {
        console.log('pick item');
  
        this.clearSelection();
  
        //alpha to indicate selection
        sprite.alpha = 0.4;
  
        this.selectedItem = sprite;
      }
    },

    rotatePet: function(sprite, event) {
  
      if(!this.uiBlocked) {     
  
        //we want the user interface (UI) to be blocked until the rotation ends
        this.uiBlocked = true;
  
        this.clearSelection();
  
        //alpha to indicate selection
        sprite.alpha = 0.4;
  
        
        let petRotation = this.game.add.tween(this.pet);
        petRotation.to({angle: '+720'}, 1000);
        petRotation.onComplete.add( function() {
            this.uiBlocked = false;
            sprite.alpha = 1;
            this.pet.customParams.fun += 10;
            console.log(this.pet.customParams.fun);
            this.refreshStats();
                              }, this);
        petRotation.start();
      }
    },
    
    placeItem: function(sprite, event){

      if(this.selectedItem && !this.uiBlocked){
          let x = event.position.x;
          let y = event.position.y;
          let newItem = this.game.add.sprite(x,y,this.selectedItem.key);
          newItem.anchor.setTo(0.5);
          newItem.customParams = this.selectedItem.customParams;
          this.uiBlocked = true;
  
          let petMovement = this.game.add.tween(this.pet);
          petMovement.to({x:x, y:y}, 700);
          petMovement.onComplete.add(function(){
          newItem.destroy();

          this.pet.animations.play('funnyfaces');
          this.uiBlocked = false;
          let stat;

          for(stat in newItem.customParams){
            if(newItem.customParams.hasOwnProperty(stat)){
              console.log(stat);
              this.pet.customParams[stat] += newItem.customParams[stat];
            }
          }
            this.refreshStats();
                                }, this);
          petMovement.start();
  
      }
      
    },
    clearSelection: function() {
  
      //remove transparency from all buttons
      this.buttons.forEach(function(element, index){
        element.alpha = 1;
      });
  
      //we are not selecting anything now
      this.selectedItem = null;
    },
  
    refreshStats: function(){
      this.healthText.text = this.pet.customParams.health;
      this.funText.text = this.pet.customParams.fun;
    },
  
    reduceProperties: function() {
      this.pet.customParams.health -= 10;
      this.pet.customParams.fun -= 15;
      this.refreshStats();
    }, 
    
    //executed multiple times per second w/o this the game has no fun
    update: function(){
      if(this.pet.customParams.health <= 0 || this.pet.customParams.fun <= 0){
        this.pet.frame = 4;
        this.uiBlocked = true;
        this.game.time.events.add(200, this.gameOver, this);
      }
    }, 
    
    gameOver: function(){
      this.state.start('HomeState', true, false, 'GAME OVER');
    },
  
    
  };