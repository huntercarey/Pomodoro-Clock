$(function(){
    let clock = new Clock();
    clock.displayCurrentTime();
    clock.displaySessionTime();
    clock.displayBreakTime();
    clock.displaySessionCount();

    //EVENT LISTENERS

    //add session time
    $('.time-session .plus').click(function() {
        clock.changeSessionTime('add');
    });

    //subtract session time
    $('.time-session .minus').click(function() {
        clock.changeSessionTime('subtract');
    });

    //add break time
    $('.time-break .plus').click(function() {
        clock.changeBreakTime('add');
    });

    //subtract break time
    $('.time-break .minus').click(function() {
        clock.changeBreakTime('subtract');
    });

    $('.time-start').click(function() {
        clock.toggleClock();
    });

    //Reset
    $('.time-reset').click(function() {
        clock.reset();
    });


});

function Clock() {

    var startTime = 1500,  //Starting value for our timer in seconds
        currentTime = 1500, //Current time for our timer in seconds
        sessionTime = 1500, //Length of a session in seconds
        breakTime = 300, //Length of a break in seconds
        sessionCount = 0, //The number of sessions
        mode = 'Session', //Keeps track of what mode we're in (session or break)
        active = false, //Keeps track of whether the clock is running or not
        _this = this, //Refeerence to the clock itself
        timer; //Reference to the interval that we set up to make the timer run

        //DISPLAY FUNCTIONS

    //Function to convert a number of seconds into a formatted time string
    function formatTime(secs) {
        var result = '';
        let seconds = secs % 60;
        let minutes = parseInt(secs / 60) % 60;
        let hours = parseInt(secs / 3600);

        //Function adds leading zeroes if minutes/seconds are less than 10
        function addLeadingZeroes(time) {
            if (time < 10) {
                return '0' + time;
            } else {
                return time;
            }
        }

        //If we have a value for hours greater than 0, we need to show it on our time output
        if (hours > 0) {
            result += (hours + ':');
        }

        //Build up the result string with minutes and seconds
        result += (addLeadingZeroes(minutes) + ':' + addLeadingZeroes(seconds));

        //Return result string
        return result;
    }

    //Function to display the time remaining on the timer
    this.displayCurrentTime = function() {
        $('.main-display').text(formatTime(currentTime));
    }

    //Function to display the session time
    this.displaySessionTime = function() {
        $('.time-session-display').text(parseInt(sessionTime / 60) + ' min');
    }

    //Function to display the break time
    this.displayBreakTime = function() {
        $('.time-break-display').text(parseInt(breakTime / 60) + ' min');
    }

    //Function to control the session count text
    this.displaySessionCount = function () {
        //If our session count is 0, we should show the text: Pomodoro Clock
        if (sessionCount === 0) {
            $('.session-count').html('<h2>Pomodoro Clock</h2>');
        } else if (mode === 'Session') {
            //If our session count is greater than 0 and we're in a session, we should show which session we're in
            $('.session-count').html('<h2>Session ' + sessionCount + '</h2>');
        } else if (mode === 'Break') {
            //If we're in a break, we should show the text: Break
            $('.session-count').html('<h2>Break!</h2>');
        }
        
        
    }

    //CHANGE TIME FUNCTIONS

    //Function to add or subtract 60 seconds from the session time whenever the plus or minus buttons are interacted with.
    this.changeSessionTime = function(command) {
        //if NOT active
        if (!active) { 
            this.reset();
            if (command === 'add') {
                //Add a minute to our session time
                sessionTime += 60;
            } else if (sessionTime > 60) {
                //If session time is greater than 1 minute, subtract 1 minute from it
                sessionTime -= 60;
            }
            currentTime = sessionTime;
            startTime = sessionTime;
            this.displaySessionTime();
            this.displayCurrentTime();
        }
    }

    //This is a function to add or remove 60 seconds from the break time when the plus or minus buttons are interacted with
    this.changeBreakTime = function(command) {
        if (!active) {
            this.reset();
            if (command === 'add') {
                breakTime += 60;
            } else if (breakTime > 60) {
                breakTime -= 60;
            }
            this.displayBreakTime();
        }
    }

    //Toggle the clock between running and paused
    this.toggleClock = function() {
        if (!active) {
            //Start the clock running
            active = true;
            if (sessionCount === 0) {
                sessionCount = 1;
                this.displaySessionCount();
            }
            $('.time-start').text('Pause');
            timer = setInterval(function() {
                _this.stepDown();
            }, 1000);
        }  else {
            $('.time-start').text('Start');
            active = false;
            clearInterval(timer);
        }
    }

    //Subtract 1 second from currentTime, display the new currentTime, and when the time runs out, alternate between session and break
    this.stepDown = function() {
        if (currentTime > 0) {
            currentTime--;
            this.displayCurrentTime();
            if (currentTime === 0) {
                if (mode === 'Session') {
                    mode = 'Break';
                    currentTime = breakTime;
                    startTime = breakTime;
                    this.displaySessionCount();
                } else {
                    mode = 'Session';
                    currentTime = sessionTime;
                    startTime = sessionTime;
                    sessionCount += 1;
                    this.displaySessionCount();
                }
            }
        }
    }

    //Function to reset the timer
    this.reset = function() {
        //Clear the timer interval so the clock stops counting down
        clearInterval(timer);
        active = false;
        //Reset our mode to Session
        mode = 'Session';
        //Reset the current time to the session time
        currentTime = sessionTime;
        //Reset Session count
        sessionCount = 0;
        //Make sure the text for the start/pause button is set to start
        $('.time-start').text('Start');

        //Display the correct currentTime, sessionTime, and sessionCount
        this.displayCurrentTime();
        this.displaySessionTime();
        this.displaySessionCount();
    }
}