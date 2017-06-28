

function BotStateManager() {

  this.process = function(selection, action) {
    switch (selection) {
      case 'calculateGoal':
        console.log('performed ' + action);
        break;
      default:
        console.log('nothing');
    }
  };

  this.y = function() {
    console.log('y');
  };

};


//
//   subscribe('calculateGoal/mouseover', function(args) {
//     console.log("hi");
//   });
//
//   subscribe('calculateGoal/mouseleave', function(args) {
//     console.log("bye");
//   });
//
// };
