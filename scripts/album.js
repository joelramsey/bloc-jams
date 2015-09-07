

 var createSongRow = function(songNumber, songName, songLength) {
     
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);

     var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));

        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }

        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();

            var $volumeFill = $('.volume .fill');
            var $volumeThumb = $('.volume .thumb');
            $volumeFill.width(currentVolume + '%');
            $volumeThumb.css({left: currentVolume + '%'});
            
            updatePlayerBarSong();
        }

        else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
               $(this).html(pauseButtonTemplate);
               $('.left-controls .play-pause').html(playerBarPauseButton);
               currentSoundFile.play();
               updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.left-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();   
            }
        }
     };

     var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
     };

     var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
     };

     $row.find('.song-item-number').click(clickHandler)

     $row.hover(onHover, offHover);

     console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);

     return $row;
 
 };

 var songNumber = parseInt($(this).attr('data-song-number'));

 var setCurrentAlbum = function(album) {

    currentAlbum = album;
 
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.name);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     
     $albumSongList.empty();
 
     
     for (i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
         $albumSongList.append($newRow);
     }
 
 };

 var updateSeekBarWhileSongPlays = function() {
 
    if (currentSoundFile) {
       
        currentSoundFile.bind('timeupdate', function timeUpdate(event) {
            
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
 
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(currentSoundFile.getTime());
            setTotalTimeInPlayerBar(currentSoundFile.getDuration());
        });
    }
 
 };


 var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
 
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
 
 }

 var setupSeekBars = function() {
 
    var $seekBars = $('.player-bar .seek-bar');
 
    $seekBars.click(function(event) {
        
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;

        if ($(this).parent().attr('class') == 'seek-control') {
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            setVolume(seekBarFillRatio * 100);   
        }
 
        updateSeekPercentage($(this), seekBarFillRatio);
    });

    $seekBars.find('.thumb').mousedown(function(event) {
 
        var $seekBar = $(this).parent();
 
        $(document).bind('mousemove.thumb', function(event){
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            var seekBarFillRatio = offsetX / barWidth;

            if ($seekBar.parent().attr('class') == 'seek-control') {
                seek(seekBarFillRatio * currentSoundFile.getDuration());   
            } else {
                setVolume(seekBarFillRatio);
            }
 
            updateSeekPercentage($seekBar, seekBarFillRatio);
        });
 
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
 
    });
 
 };

 var trackIndex = function(album, song){
    return album.songs.indexOf(song);
 };

 var getSongNumberCell = function(number) {
    return $("[data-song-number='" + number + "']");
};

 var nextSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex++;
    
    if (currentSongIndex >= currentAlbum.songs.length) {
        currentSongIndex = 0;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);

    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
    
    var getLastSongNumber = function(index) {
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = currentAlbum.songs.length - 1;
    }
    
    // Set a new current song
    setSong(currentSongIndex + 1);

    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var togglePlayFromPlayerBar = function(){

    if (!currentSoundFile) {                    
        return;
    };
    
    var $songElement = getSongNumberCell(currentlyPlayingSongNumber);

    if (currentSoundFile.isPaused()) {          
        $songElement.html(playButtonTemplate);
        $(this).html(playerBarPlayButton);
        currentSoundFile.play();
    }
    else {                                  
        $songElement.html(pauseButtonTemplate);
        $(this).html(playerBarPauseButton);
        currentSoundFile.pause();
    }
};

 var updatePlayerBarSong = function(){
    $('.currently-playing .song-name').text(currentSongFromAlbum.name);
    $('.currently-playing .artist-name').text(currentSongFromAlbum.artist);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
    $('.left-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar();
 };
 
 // Album button templates
 var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
 var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
 var playerBarPlayButton = '<span class="ion-play"></span>';
 var playerBarPauseButton = '<span class="ion-pause"></span>';

//Create global variables to store current song and album information

 var currentAlbum = null;

 var currentlyPlayingSongNumber = null;

 var currentSongFromAlbum = null;

 var currentSoundFile = null;

 var currentVolume = 80;

 //player bar selector elements
 var $previousButton = $('.left-controls .previous');
 var $nextButton = $('.left-controls .next');
 var $playButton = $('.left-controls .play-pause');

 var setSong = function(songNumber) {

    if(currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];

    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: [ 'mp3' ],
        preload: true
    });

    setVolume(currentVolume);
 };

 var seek = function(time) {
   
   if (currentSoundFile) {
       currentSoundFile.setTime(time);
   }
   
 }

 var setVolume = function(volume) {
    if (currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
 }

 var setCurrentTimeInPlayerBar = function(currentTime) {
    $(".current-time").text(filterTimeCode(currentTime));
 }

var setTotalTimeInPlayerBar = function(totalTime) {
    $(".total-time").text(filterTimeCode(totalTime));
 }

var filterTimeCode = function(timeInSeconds) {
    var time = parseFloat(timeInSeconds);
    var minutes = Math.floor(time/60);
    var seconds = Math.floor(time - minutes * 60);
    if (seconds >= 10) {
        var formatTime = minutes + ":" + seconds;
    } else {
        var formatTime = minutes + ":0" + seconds;
    }

    return formatTime;
};

 var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
 }

 $(document).ready(function(){

 setCurrentAlbum(albumPicasso);
 setupSeekBars();
 $previousButton.click(previousSong);
 $nextButton.click(nextSong);
 $playButton.click(togglePlayFromPlayerBar);

 });     

 var albums = [albumPicasso, albumMarconi, albumRamsey];
 var counter = 0;
 var albumCover = document.getElementsByClassName('album-cover-art')[0];

 var albumPicker = function(){
    if (++counter >= albums.length){
        counter = 0;
    }
    setCurrentAlbum(albums[counter]);
 }  
 
 albumCover.addEventListener('click', albumPicker);    
