const sounds = [ "./media/clap.wav", "./media/hihat.wav", "./media/openhat.wav", "./media/snare.wav"];
const drumkit = document.createElement("div");
drumkit.classList.add("drumkit");

for (let i = 0; i < sounds.length; i++) {
    const src = sounds[i];
    AddSound(src);
}
document.body.append(drumkit);

document.addEventListener('keypress', onKeyPress);


const tracks = document.createElement("div");
tracks.classList.add("tracks");
const RECORD_CHANNELS = 4;
let track_list = [];

for (let i = 0; i < RECORD_CHANNELS; i++) {
    const channel = document.createElement("div");
    channel.setAttribute("id", `channel${i}`);
    const text = document.createElement("span");
    text.innerText = `TRACK ${i}`;
    channel.append(text);

    const record = document.createElement("button");
    record.innerText = "Record";
    record.addEventListener("click", RecordTrack);
    channel.append(record);

    const play = document.createElement("button");
    play.innerText = "Play";
    play.addEventListener("click", PlayTrack);
    channel.append(play);

    tracks.append(channel);
}

document.body.append(tracks);

function RecordTrack(event) {
    const trackId = Number(event.target.parentElement.getAttribute("id").replace("channel", ""));
    let track = [0];
    const startTime = Date.now();
    let recordBtn = event.target;
    document.addEventListener("keypress", Record)
    recordBtn.removeEventListener("click", RecordTrack);
    recordBtn.innerText = "Stop recording";
    recordBtn.addEventListener("click", () => {
        track.push(Date.now() - startTime);
        const newBtn = recordBtn.cloneNode(true);
        recordBtn.replaceWith(newBtn);
        recordBtn = newBtn;
        recordBtn.innerText = "Record";
        document.removeEventListener("keypress", Record);
        recordBtn.addEventListener("click", RecordTrack);
        track_list[trackId] = track;
        console.log(track_list);
    });

    function Record(event) {
        track.push({
            timestamp: Date.now() - startTime,
            key: event.key
        });
    }
}

async function PlayTrack(event) {
    const trackId = Number(event.target.parentElement.getAttribute("id").replace("channel", ""));
    const track = track_list[trackId];
    let trackBtn = event.target;
    let trackPlaying = true;

    await Play(track);
    trackBtn.innerText = "Stop playing";
    trackBtn.removeEventListener("click", PlayTrack);

    trackBtn.addEventListener("click", () => {
        trackPlaying = false;
        const newBtn = trackBtn.cloneNode(true);
        trackBtn.replaceWith(newBtn);
        trackBtn = newBtn;
        trackBtn.innerText = "Play";
        trackBtn.addEventListener("click", PlayTrack);
        trackPlaying = false;
    });

    async function Play(track) {
        let trackDuration;
        trackDuration = track[track.length-1];
        for (let i = 0; i < track.length; i++) {
            const sound = track[i];
            setTimeout(() => {
                if (sound.key != null && trackPlaying) playSound(KeyToSound[sound.key]);
            }, sound.timestamp);
        }
        setTimeout(() => {
            if (trackPlaying) Play(track);
        }, trackDuration);
    }
}


const KeyToSound = 
{
    'a': drumkit.children[0],
    's': drumkit.children[1],
    'd': drumkit.children[2],
    'f': drumkit.children[3]
}

function onKeyPress(event) {
    const sound = KeyToSound[event.key];
    playSound(sound);
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function AddSound(src) {
    const sound = document.createElement("audio");
    sound.setAttribute("src", src);
    sound.setAttribute("controls", "");
    drumkit.append(sound);
}