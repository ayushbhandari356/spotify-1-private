console.log("lets start javascript");
console.log("anish kumar")
let currentsong=new Audio();
let songs;
let currfolder;
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    // Adding leading zero if seconds is a single digit
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
}

// Example usage:
const timeInMinutesSeconds = secondsToMinutesSeconds(125);
console.log(timeInMinutesSeconds); // Output: "2:05"

async function getsongs(folder) {
    currfolder=folder;
    let a = await fetch(`/${folder}`);
    console.log('this should',a);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")){
         songs.push(element.href.split(`/${folder}/`)[1]);
        };
    }
     console.log('songs',songs);
     //show all the song in the playlist
     let songul=document.querySelector(".songlist").getElementsByTagName("ul")[0];
     songul.innerHTML = "";
     for (const song of songs) {
         songul.innerHTML=songul.innerHTML + `<li><img src="img/music.svg" alt="" class="invert">
             <div class="info">
                 <div class="songname">
                 ${song.replaceAll("%20","  ")}
                 </div>
                 <div class="artist">
                      - Ayush Bhandari
                 </div>
             </div>
             <div class="playnow">
                 <span >Play Now</span>
                 <img src="img/playicon.svg" alt="" class="invert">
             </div></li>`
         
     }
 
 //    attach an event listner to each song
     Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
         e.addEventListener("click", (Event) => {
             const trackName = e.querySelector(".info").firstElementChild.innerHTML.trim();
             console.log("Selected track:", trackName);
             playMusic(trackName,true);
             play.setAttribute('src', 'img/pause.svg');
             
         });
     });
    
}

const playMusic = (track,pause=false) => {
    console.log("this is track",track);
    const encodedTrack = encodeURIComponent(track);
    console.log("encoded track:", encodedTrack);
    const url = `/${currfolder}/` + encodedTrack;
    currentsong.src=`/${currfolder}/` + encodedTrack;
    console.log("Attempting to load:", url);
    
    if(!false){

        document.querySelector(".songinfo").innerHTML=decodeURI(track);
        document.querySelector(".songtime").innerHTML="0:00/0:00";
    }
    currentsong.play().catch(error => {
        console.error("Failed to load audio:", error);
    });
}


async function main() {
   
   
    // get the list
     await getsongs("songs/cs");
     console.log('neeche ka song',songs);
     console.log('p songs',songs[0]);
    playMusic(songs[0],false);
   
//    display all the albums in the  page
    // displayAlbum() i am not able to get the songs href instead getting spotify privacy policy anchors tag
   
 // Add event listener for play/pause button
    const play = document.getElementById("play"); // Assuming your play button has an ID of "play"
    play.addEventListener("click", () => {
       
        if (currentsong.paused) {
            currentsong.play();
            play.setAttribute('src', 'img/pause.svg');
        } else {
            currentsong.pause();
            play.setAttribute('src', 'img/playicon.svg');
        }
    });
  


    // listen for time update events
  currentsong.addEventListener("timeupdate", () => {
    const currentTime = currentsong.currentTime;
    const duration = currentsong.duration;
    const seekbar = document.querySelector(".seekbar");
    const circle = document.querySelector(".circle");

         // Update seekbar color based on progress
    const progress = (currentTime / duration) * 100;
    seekbar.style.background = `linear-gradient(to right, rgb(9, 167, 9) ${progress}%, #555 ${progress}%)`;

         // Update other elements as before
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentTime
    )} / ${secondsToMinutesSeconds(duration)}`;
    circle.style.left = `${progress}%`;
  });
    
    
  
  // ad event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left=percent+"%";
        currentsong.currentTime=((currentsong.duration)*percent)/100;
    })


    // add event listner for hamburger
    document.querySelector(".hamburgur").addEventListener("click",e=>{
        document.querySelector(".left").style.left="0";
    })
 
 
    // add event listner for hamburger close
    document.querySelector(".hamburgur_close").addEventListener("click",e=>{
        document.querySelector(".left").style.left="-100%";
    })

    
    
    // add event listner to prev 
    const previous=document.getElementById("previous")
        previous.addEventListener("click",e=>{
            console.log("Previous")
            console.log(songs)
            let index =songs.indexOf(currentsong.src.split("/").slice(-1)[0])
            console.log(index)
            if((index-1) >= 0 ){
    
                playMusic(songs[index-1],true)
            }
    })
        
 
 
    // add event listner to next
    document.getElementById("next").addEventListener("click",e=>{
        console.log("next")
        
        console.log(songs)
        let index =songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(index)
        if((index+1) < songs.length ){

            playMusic(songs[index+1],true)
        }
    })

  
  
    // load the playlist whenever the card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e=>{
       
        e.addEventListener("click",async(event) =>{
             
            let songs = await getsongs(`songs/${event.currentTarget.dataset.folder}`);
            
        })
    })  
    // add event listner to mute
    document.querySelector(".vol").addEventListener("click", (e) => {
    if (e.target.src.endsWith("img/vol.svg")) {
        e.target.src = "img/mute.svg";
        currentsong.volume = 0;
    } else {
        currentsong.volume = 1;
        e.target.src = "img/vol.svg";
    }
});

    
}
main();
