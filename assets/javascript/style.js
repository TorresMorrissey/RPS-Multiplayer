var config = {
    apiKey: "AIzaSyD4oavLoUAZuoix8RXL436iTUnf_hS2eVI",
    authDomain: "choochoo-c11f3.firebaseapp.com",
    databaseURL: "https://choochoo-c11f3.firebaseio.com",
    projectId: "choochoo-c11f3",
    storageBucket: "choochoo-c11f3.appspot.com",
    messagingSenderId: "86042397220"
  };

firebase.initializeApp(config);

var database = firebase.database();

// Create variables for form inputs. 
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";


$('#submit').on('click', function(){

        // grab text from input field, grab value & trim blank spaces before and after 
          trainName = $('#trainName').val().trim();
          destination = $('#destination').val().trim();
          firstTrainTime = $('#firstTrainTime').val().trim();
          frequency = $('#frequency').val().trim();

          // pushing object data to firebase
          database.ref().push({
              train: trainName,
              destination : destination,
              trainTime: firstTrainTime,
            frequency: frequency,
          });

// Don't refresh the page!
return false; 
}); // End #submit click function

// Create Firebase "watcher" (.on("value"))
database.ref().on('child_added', function(snapshot){

        var newTrainName = snapshot.val().train;
        var newDestination = snapshot.val().destination;
        var newFirstTrainTime = snapshot.val().trainTime;
        var newFrequency = snapshot.val().frequency;

        // Moment ============================================================

              // First Time (pushed back 1 year to make sure it comes before current time)
              var firstTimeConverted = moment(newFirstTrainTime,"hh:mm").subtract(1, "years");
              console.log(firstTimeConverted);

              // Current Time
              var currentTimeMoment = moment();
              console.log("Current Time: " + moment(currentTimeMoment).format("hh:mm"));

              //Difference between the times
              var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
              console.log("Difference In Time: " + diffTime);

              // Time apart (remainder)
              var tRemainder = diffTime % newFrequency;
              console.log(tRemainder);

              // Minute Until Train
              var tMinutesUntilTrain = newFrequency - tRemainder;
              console.log("Minutes Until Train: " + tMinutesUntilTrain);

              // Next Train
              var nextTrain = moment().add(tMinutesUntilTrain, "minutes");
              console.log("Arrival Time: " + moment(nextTrain).format("hh:mm"));

              // Next Train Arrival Time
              var nextTrainArrivalTime = moment(nextTrain).format("hh:mm");

        // End Moment ============================================================

        // Log everthing that's coming out of snapshot
        console.log(snapshot.val());
        console.log('train: '+ snapshot.val().train);
        console.log('destination: '+ snapshot.val().destination);
        console.log('train time: '+ snapshot.val().trainTime);
        console.log('frequency: '+ snapshot.val().frequency);
        console.log('next train: '+ nextTrainArrivalTime);
        console.log('minutes away: '+ tMinutesUntilTrain);

    $(".trainInformation").append('<tr><td>'+ newTrainName +'</td><td>'+ newDestination +'</td><td>'+ newFrequency +'</td><td>'+ nextTrainArrivalTime +'</td><td>'+ tMinutesUntilTrain +'</td></tr>');

}); // End database.ref().on('value', function(snapshot){